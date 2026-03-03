// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title ArtistProject
 * @notice 单个歌手项目的合约，管理份额代币和收益分配
 * @dev 每个歌手项目都是一个独立的可投资项目
 */
contract ArtistProject is ERC20, AccessControl, ReentrancyGuard, Pausable {
    // 角色定义
    bytes32 public constant ARTIST_ROLE = keccak256("ARTIST_ROLE");
    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // 项目状态
    enum ProjectStatus { 
        PENDING,      // 待启动
        FUNDING,      // 融资中
        FUNDED,       // 融资完成
        COMPLETED,    // 项目完成
        PAUSED        // 暂停
    }

    // 项目信息结构
    struct ProjectInfo {
        string name;
        string description;
        string genre;
        string location;
        address artist;
        address agent;
        uint256 targetAmount;
        uint256 minInvestment;
        uint256 totalShares;
        uint256 pricePerShare;
        uint256 startTime;
        uint256 endTime;
        ProjectStatus status;
        string metadataURI;
    }

    // 收益分配结构（基点 10000 = 100%）
    struct Allocation {
        uint256 artistShare;      // 歌手份额
        uint256 investorShare;    // 投资人份额
        uint256 agentShare;       // 经纪人份额
        uint256 communityShare;   // 社区份额
    }

    // 投资记录
    struct Investment {
        uint256 amount;
        uint256 shares;
        uint256 timestamp;
        bool claimed;
    }

    // 收益记录
    struct Revenue {
        uint256 amount;
        uint256 timestamp;
        string source;
        bool distributed;
    }

    // 状态变量
    ProjectInfo public projectInfo;
    Allocation public allocation;
    
    uint256 public totalRaised;
    uint256 public totalRevenue;
    uint256 public totalDistributed;
    
    // 用户数据
    mapping(address => Investment) public investments;
    mapping(address => uint256) public pendingRewards;
    mapping(address => uint256) public claimedRewards;
    mapping(uint256 => Revenue) public revenues;
    
    address[] public investors;
    uint256 public revenueCount;
    
    // 平台费用（基点 10000 = 100%）
    uint256 public constant PLATFORM_FEE = 250; // 2.5%
    address public platformTreasury;

    // 事件
    event ProjectStarted(uint256 startTime, uint256 endTime);
    event Invested(address indexed investor, uint256 amount, uint256 shares);
    event RevenueAdded(uint256 indexed revenueId, uint256 amount, string source);
    event RewardsDistributed(uint256 indexed revenueId, uint256 totalAmount);
    event RewardsClaimed(address indexed investor, uint256 amount);
    event ProjectCompleted(uint256 totalRaised, uint256 totalRevenue);
    event ProjectPaused(string reason);
    event ProjectUnpaused();
    event EmergencyWithdraw(address indexed to, uint256 amount);

    // 修饰器
    modifier onlyStatus(ProjectStatus _status) {
        require(projectInfo.status == _status, "Invalid project status");
        _;
    }

    modifier onlyArtistOrAdmin() {
        require(
            hasRole(ARTIST_ROLE, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Not authorized"
        );
        _;
    }

    /**
     * @notice 构造函数
     */
    constructor(
        string memory _name,
        string memory _symbol,
        string memory _projectName,
        string memory _description,
        string memory _genre,
        string memory _location,
        address _artist,
        address _agent,
        address _treasury,
        uint256 _targetAmount,
        uint256 _minInvestment,
        uint256 _totalShares,
        uint256 _pricePerShare,
        uint256 _duration,
        Allocation memory _allocation
    ) ERC20(_name, _symbol) {
        // 验证分配比例
        require(
            _allocation.artistShare + 
            _allocation.investorShare + 
            _allocation.agentShare + 
            _allocation.communityShare == 10000,
            "Invalid allocation"
        );
        
        require(_artist != address(0), "Invalid artist address");
        require(_treasury != address(0), "Invalid treasury address");
        require(_targetAmount > 0, "Invalid target amount");
        require(_totalShares > 0, "Invalid total shares");
        require(_pricePerShare > 0, "Invalid price");

        // 设置角色
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ARTIST_ROLE, _artist);
        _grantRole(AGENT_ROLE, _agent);
        _grantRole(DISTRIBUTOR_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);

        // 设置项目信息
        projectInfo = ProjectInfo({
            name: _projectName,
            description: _description,
            genre: _genre,
            location: _location,
            artist: _artist,
            agent: _agent,
            targetAmount: _targetAmount,
            minInvestment: _minInvestment,
            totalShares: _totalShares,
            pricePerShare: _pricePerShare,
            startTime: block.timestamp,
            endTime: block.timestamp + _duration,
            status: ProjectStatus.FUNDING,
            metadataURI: ""
        });

        allocation = _allocation;
        platformTreasury = _treasury;

        // 预铸份额给各方（投资人份额不预铸，由投资时铸造）
        uint256 artistTokens = (_totalShares * _allocation.artistShare) / 10000;
        uint256 agentTokens = (_totalShares * _allocation.agentShare) / 10000;
        uint256 communityTokens = (_totalShares * _allocation.communityShare) / 10000;

        if (artistTokens > 0) _mint(_artist, artistTokens);
        if (agentTokens > 0) _mint(_agent, agentTokens);
        if (communityTokens > 0) _mint(address(this), communityTokens);

        emit ProjectStarted(block.timestamp, block.timestamp + _duration);
    }

    /**
     * @notice 投资人购买份额
     * @param _shareAmount 要购买的份额数量
     */
    function invest(uint256 _shareAmount) 
        external 
        payable 
        nonReentrant 
        onlyStatus(ProjectStatus.FUNDING) 
        whenNotPaused 
    {
        require(block.timestamp < projectInfo.endTime, "Funding period ended");
        require(_shareAmount >= projectInfo.minInvestment / projectInfo.pricePerShare, "Below minimum");
        
        uint256 cost = _shareAmount * projectInfo.pricePerShare;
        require(msg.value >= cost, "Insufficient payment");
        
        // 检查是否超过可投资份额
        uint256 investorTokens = (projectInfo.totalShares * allocation.investorShare) / 10000;
        require(totalRaised + _shareAmount <= investorTokens, "Exceeds available shares");

        // 记录投资
        if (investments[msg.sender].shares == 0) {
            investors.push(msg.sender);
        }
        
        investments[msg.sender].amount += cost;
        investments[msg.sender].shares += _shareAmount;
        investments[msg.sender].timestamp = block.timestamp;
        
        totalRaised += _shareAmount;
        _mint(msg.sender, _shareAmount);

        // 退款多余的 ETH
        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }

        emit Invested(msg.sender, cost, _shareAmount);

        // 检查是否达成目标
        if (totalRaised >= projectInfo.targetAmount / projectInfo.pricePerShare) {
            _completeFunding();
        }
    }

    /**
     * @notice 完成融资
     */
    function _completeFunding() internal {
        projectInfo.status = ProjectStatus.FUNDED;
        
        // 扣除平台费用后转账给歌手
        uint256 platformFee = (totalRaised * projectInfo.pricePerShare * PLATFORM_FEE) / 10000;
        uint256 artistAmount = (totalRaised * projectInfo.pricePerShare) - platformFee;
        
        payable(platformTreasury).transfer(platformFee);
        payable(projectInfo.artist).transfer(artistAmount);
    }

    /**
     * @notice 录入收益（由艺术家或管理员调用）
     */
    function addRevenue(string memory _source) 
        external 
        payable 
        onlyArtistOrAdmin
        onlyStatus(ProjectStatus.FUNDED) 
    {
        require(msg.value > 0, "Must send revenue");
        
        revenueCount++;
        revenues[revenueCount] = Revenue({
            amount: msg.value,
            timestamp: block.timestamp,
            source: _source,
            distributed: false
        });
        
        totalRevenue += msg.value;
        
        emit RevenueAdded(revenueCount, msg.value, _source);
        
        // 自动分配
        _distributeRevenue(revenueCount);
    }

    /**
     * @notice 分配收益给所有份额持有者
     */
    function _distributeRevenue(uint256 _revenueId) internal {
        Revenue storage revenue = revenues[_revenueId];
        require(!revenue.distributed, "Already distributed");
        
        uint256 totalSupply = totalSupply();
        require(totalSupply > 0, "No shares issued");
        
        // 按份额比例分配给所有持有者
        for (uint256 i = 0; i < investors.length; i++) {
            address holder = investors[i];
            uint256 share = balanceOf(holder);
            if (share > 0) {
                uint256 reward = (revenue.amount * share) / totalSupply;
                pendingRewards[holder] += reward;
            }
        }
        
        // 分配给艺术家
        uint256 artistReward = (revenue.amount * allocation.artistShare) / 10000;
        pendingRewards[projectInfo.artist] += artistReward;
        
        // 分配给经纪人
        uint256 agentReward = (revenue.amount * allocation.agentShare) / 10000;
        pendingRewards[projectInfo.agent] += agentReward;
        
        revenue.distributed = true;
        totalDistributed += revenue.amount;
        
        emit RewardsDistributed(_revenueId, revenue.amount);
    }

    /**
     * @notice 投资人提取收益
     */
    function claimRewards() external nonReentrant {
        uint256 pending = pendingRewards[msg.sender];
        require(pending > 0, "No pending rewards");

        pendingRewards[msg.sender] = 0;
        claimedRewards[msg.sender] += pending;

        payable(msg.sender).transfer(pending);
        emit RewardsClaimed(msg.sender, pending);
    }

    /**
     * @notice 查询可领取收益
     */
    function getPendingRewards(address _holder) external view returns (uint256) {
        return pendingRewards[_holder];
    }

    /**
     * @notice 查询已领取收益
     */
    function getClaimedRewards(address _holder) external view returns (uint256) {
        return claimedRewards[_holder];
    }

    /**
     * @notice 获取投资信息
     */
    function getInvestmentInfo(address _investor) external view returns (Investment memory) {
        return investments[_investor];
    }

    /**
     * @notice 获取所有投资人
     */
    function getAllInvestors() external view returns (address[] memory) {
        return investors;
    }

    /**
     * @notice 暂停项目（紧急情况）
     */
    function pause(string memory _reason) external onlyRole(PAUSER_ROLE) {
        _pause();
        projectInfo.status = ProjectStatus.PAUSED;
        emit ProjectPaused(_reason);
    }

    /**
     * @notice 恢复项目
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
        projectInfo.status = ProjectStatus.FUNDING;
        emit ProjectUnpaused();
    }

    /**
     * @notice 更新元数据URI
     */
    function setMetadataURI(string memory _uri) external onlyArtistOrAdmin {
        projectInfo.metadataURI = _uri;
    }

    /**
     * @notice 获取项目状态
     */
    function getProjectStatus() external view returns (ProjectStatus) {
        return projectInfo.status;
    }

    /**
     * @notice 紧急提款（仅管理员）
     */
    function emergencyWithdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");
        
        payable(msg.sender).transfer(balance);
        emit EmergencyWithdraw(msg.sender, balance);
    }

    /**
     * @notice 接收ETH
     */
    receive() external payable {}
    fallback() external payable {}
}
