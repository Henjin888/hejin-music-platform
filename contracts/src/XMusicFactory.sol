// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ArtistProject.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title XMusicFactory
 * @notice 项目工厂合约，用于创建和管理歌手项目
 * @dev 所有项目通过此工厂创建，便于统一管理和追踪
 */
contract XMusicFactory is AccessControl, Pausable {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant TREASURY_ROLE = keccak256("TREASURY_ROLE");

    // 平台配置
    struct PlatformConfig {
        uint256 platformFeeRate;      // 平台费率（基点 10000 = 100%）
        uint256 minTargetAmount;      // 最低融资目标
        uint256 maxTargetAmount;      // 最高融资目标
        uint256 minDuration;          // 最短融资周期
        uint256 maxDuration;          // 最长融资周期
        bool requireVerification;     // 是否需要审核
    }

    // 项目记录
    struct ProjectRecord {
        address projectAddress;
        address artist;
        string name;
        uint256 createdAt;
        bool isActive;
    }

    // 状态变量
    PlatformConfig public config;
    address public platformTreasury;
    
    // 项目列表
    ProjectRecord[] public allProjects;
    mapping(address => address[]) public artistProjects;
    mapping(address => bool) public isProject;
    mapping(address => bool) public verifiedArtists;
    
    // 统计
    uint256 public totalProjects;
    uint256 public totalInvested;
    uint256 public totalRevenue;

    // 事件
    event ProjectCreated(
        address indexed projectAddress,
        address indexed artist,
        string name,
        uint256 targetAmount,
        uint256 timestamp
    );
    event ArtistVerified(address indexed artist, address indexed verifier);
    event ArtistRevoked(address indexed artist, address indexed revoker);
    event ConfigUpdated(string param, uint256 oldValue, uint256 newValue);
    event TreasuryUpdated(address oldTreasury, address newTreasury);
    event FeesWithdrawn(address indexed to, uint256 amount);

    /**
     * @notice 构造函数
     */
    constructor(address _treasury) {
        require(_treasury != address(0), "Invalid treasury address");
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
        _grantRole(TREASURY_ROLE, _treasury);
        
        platformTreasury = _treasury;
        
        // 默认配置
        config = PlatformConfig({
            platformFeeRate: 250,       // 2.5%
            minTargetAmount: 1000 * 1e18, // 1000 USDC
            maxTargetAmount: 1000000 * 1e18, // 1M USDC
            minDuration: 7 days,
            maxDuration: 90 days,
            requireVerification: false
        });
    }

    /**
     * @notice 创建新的歌手项目
     */
    function createProject(
        string memory _tokenName,
        string memory _tokenSymbol,
        string memory _projectName,
        string memory _description,
        string memory _genre,
        string memory _location,
        address _artist,
        address _agent,
        uint256 _targetAmount,
        uint256 _minInvestment,
        uint256 _totalShares,
        uint256 _pricePerShare,
        uint256 _duration,
        ArtistProject.Allocation memory _allocation
    ) external onlyRole(OPERATOR_ROLE) whenNotPaused returns (address projectAddress) {
        
        // 验证参数
        require(_artist != address(0), "Invalid artist address");
        require(bytes(_projectName).length > 0, "Empty project name");
        require(_targetAmount >= config.minTargetAmount, "Target too low");
        require(_targetAmount <= config.maxTargetAmount, "Target too high");
        require(_duration >= config.minDuration, "Duration too short");
        require(_duration <= config.maxDuration, "Duration too long");
        require(_totalShares > 0, "Invalid total shares");
        require(_pricePerShare > 0, "Invalid price");
        
        // 如果需要审核，检查艺术家是否已验证
        if (config.requireVerification) {
            require(verifiedArtists[_artist], "Artist not verified");
        }

        // 部署新项目合约
        ArtistProject project = new ArtistProject(
            _tokenName,
            _tokenSymbol,
            _projectName,
            _description,
            _genre,
            _location,
            _artist,
            _agent,
            platformTreasury,
            _targetAmount,
            _minInvestment,
            _totalShares,
            _pricePerShare,
            _duration,
            _allocation
        );

        projectAddress = address(project);
        
        // 记录项目
        allProjects.push(ProjectRecord({
            projectAddress: projectAddress,
            artist: _artist,
            name: _projectName,
            createdAt: block.timestamp,
            isActive: true
        }));
        
        artistProjects[_artist].push(projectAddress);
        isProject[projectAddress] = true;
        totalProjects++;

        // 转移项目所有权给艺术家
        project.grantRole(project.ARTIST_ROLE(), _artist);
        project.grantRole(project.AGENT_ROLE(), _agent);

        emit ProjectCreated(
            projectAddress,
            _artist,
            _projectName,
            _targetAmount,
            block.timestamp
        );
    }

    /**
     * @notice 验证艺术家
     */
    function verifyArtist(address _artist) external onlyRole(OPERATOR_ROLE) {
        require(_artist != address(0), "Invalid address");
        verifiedArtists[_artist] = true;
        emit ArtistVerified(_artist, msg.sender);
    }

    /**
     * @notice 撤销艺术家验证
     */
    function revokeArtist(address _artist) external onlyRole(OPERATOR_ROLE) {
        verifiedArtists[_artist] = false;
        emit ArtistRevoked(_artist, msg.sender);
    }

    /**
     * @notice 检查艺术家是否已验证
     */
    function isVerifiedArtist(address _artist) external view returns (bool) {
        return verifiedArtists[_artist];
    }

    /**
     * @notice 获取所有项目数量
     */
    function getProjectCount() external view returns (uint256) {
        return allProjects.length;
    }

    /**
     * @notice 获取某艺术家的所有项目
     */
    function getArtistProjects(address _artist) external view returns (address[] memory) {
        return artistProjects[_artist];
    }

    /**
     * @notice 获取项目列表（分页）
     */
    function getProjects(uint256 _offset, uint256 _limit) 
        external 
        view 
        returns (ProjectRecord[] memory) 
    {
        uint256 end = _offset + _limit;
        if (end > allProjects.length) {
            end = allProjects.length;
        }
        
        ProjectRecord[] memory result = new ProjectRecord[](end - _offset);
        for (uint256 i = _offset; i < end; i++) {
            result[i - _offset] = allProjects[i];
        }
        
        return result;
    }

    /**
     * @notice 更新平台配置
     */
    function updateConfig(
        uint256 _platformFeeRate,
        uint256 _minTargetAmount,
        uint256 _maxTargetAmount,
        uint256 _minDuration,
        uint256 _maxDuration,
        bool _requireVerification
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_platformFeeRate <= 1000, "Fee too high"); // Max 10%
        
        emit ConfigUpdated("platformFeeRate", config.platformFeeRate, _platformFeeRate);
        emit ConfigUpdated("minTargetAmount", config.minTargetAmount, _minTargetAmount);
        emit ConfigUpdated("maxTargetAmount", config.maxTargetAmount, _maxTargetAmount);
        
        config = PlatformConfig({
            platformFeeRate: _platformFeeRate,
            minTargetAmount: _minTargetAmount,
            maxTargetAmount: _maxTargetAmount,
            minDuration: _minDuration,
            maxDuration: _maxDuration,
            requireVerification: _requireVerification
        });
    }

    /**
     * @notice 更新平台国库地址
     */
    function setTreasury(address _newTreasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_newTreasury != address(0), "Invalid address");
        emit TreasuryUpdated(platformTreasury, _newTreasury);
        platformTreasury = _newTreasury;
    }

    /**
     * @notice 提取平台费用
     */
    function withdrawPlatformFees() external onlyRole(TREASURY_ROLE) {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        payable(platformTreasury).transfer(balance);
        emit FeesWithdrawn(platformTreasury, balance);
    }

    /**
     * @notice 暂停工厂
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @notice 恢复工厂
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @notice 接收ETH
     */
    receive() external payable {}
}
