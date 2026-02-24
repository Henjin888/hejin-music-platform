// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title XMToken
 * @notice XMUSIC 平台代币，用于激励和治理
 * @dev 总量1亿枚，分阶段释放
 */
contract XMToken is ERC20, ERC20Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // 代币分配（总量1亿枚）
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18;
    
    // 分配比例
    uint256 public constant COMMUNITY_REWARDS = 4000; // 40% - 社区奖励
    uint256 public constant TEAM_ADVISORS = 2000;     // 20% - 团队和顾问
    uint256 public constant INVESTORS = 1500;         // 15% - 投资人
    uint256 public constant ECOSYSTEM = 1500;         // 15% - 生态建设
    uint256 public constant LIQUIDITY = 1000;         // 10% - 流动性

    // 已铸造数量
    uint256 public totalMinted;
    
    // 锁仓信息
    struct Vesting {
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 startTime;
        uint256 cliffDuration;
        uint256 vestingDuration;
        bool revocable;
    }
    
    mapping(address => Vesting) public vestingSchedules;
    
    // 事件
    event TokensMinted(address indexed to, uint256 amount, string category);
    event VestingCreated(address indexed beneficiary, uint256 amount, uint256 startTime);
    event TokensReleased(address indexed beneficiary, uint256 amount);
    event VestingRevoked(address indexed beneficiary, uint256 unreleased);

    /**
     * @notice 构造函数
     */
    constructor() ERC20("XMUSIC Token", "XM") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }

    /**
     * @notice 铸造代币（仅 MINTER_ROLE）
     * @param _to 接收地址
     * @param _amount 数量
     * @param _category 类别（用于事件记录）
     */
    function mint(
        address _to, 
        uint256 _amount,
        string memory _category
    ) external onlyRole(MINTER_ROLE) {
        require(_to != address(0), "Invalid address");
        require(_amount > 0, "Invalid amount");
        require(totalMinted + _amount <= MAX_SUPPLY, "Exceeds max supply");
        
        totalMinted += _amount;
        _mint(_to, _amount);
        
        emit TokensMinted(_to, _amount, _category);
    }

    /**
     * @notice 批量铸造
     */
    function batchMint(
        address[] calldata _recipients,
        uint256[] calldata _amounts,
        string memory _category
    ) external onlyRole(MINTER_ROLE) {
        require(_recipients.length == _amounts.length, "Length mismatch");
        
        uint256 totalAmount;
        for (uint256 i = 0; i < _amounts.length; i++) {
            totalAmount += _amounts[i];
        }
        
        require(totalMinted + totalAmount <= MAX_SUPPLY, "Exceeds max supply");
        
        for (uint256 i = 0; i < _recipients.length; i++) {
            totalMinted += _amounts[i];
            _mint(_recipients[i], _amounts[i]);
            emit TokensMinted(_recipients[i], _amounts[i], _category);
        }
    }

    /**
     * @notice 创建锁仓计划
     */
    function createVesting(
        address _beneficiary,
        uint256 _amount,
        uint256 _cliffDuration,
        uint256 _vestingDuration,
        bool _revocable
    ) external onlyRole(MINTER_ROLE) {
        require(_beneficiary != address(0), "Invalid address");
        require(_amount > 0, "Invalid amount");
        require(vestingSchedules[_beneficiary].totalAmount == 0, "Vesting exists");
        require(totalMinted + _amount <= MAX_SUPPLY, "Exceeds max supply");
        
        totalMinted += _amount;
        _mint(address(this), _amount);
        
        vestingSchedules[_beneficiary] = Vesting({
            totalAmount: _amount,
            releasedAmount: 0,
            startTime: block.timestamp,
            cliffDuration: _cliffDuration,
            vestingDuration: _vestingDuration,
            revocable: _revocable
        });
        
        emit VestingCreated(_beneficiary, _amount, block.timestamp);
    }

    /**
     * @notice 释放锁仓代币
     */
    function releaseVestedTokens() external {
        Vesting storage vesting = vestingSchedules[msg.sender];
        require(vesting.totalAmount > 0, "No vesting");
        
        uint256 releasable = _calculateReleasable(vesting);
        require(releasable > 0, "No tokens to release");
        
        vesting.releasedAmount += releasable;
        _transfer(address(this), msg.sender, releasable);
        
        emit TokensReleased(msg.sender, releasable);
    }

    /**
     * @notice 计算可释放数量
     */
    function _calculateReleasable(Vesting storage _vesting) internal view returns (uint256) {
        if (block.timestamp < _vesting.startTime + _vesting.cliffDuration) {
            return 0;
        }
        
        if (block.timestamp >= _vesting.startTime + _vesting.vestingDuration) {
            return _vesting.totalAmount - _vesting.releasedAmount;
        }
        
        uint256 elapsed = block.timestamp - _vesting.startTime;
        uint256 vested = (_vesting.totalAmount * elapsed) / _vesting.vestingDuration;
        return vested - _vesting.releasedAmount;
    }

    /**
     * @notice 查询可释放数量
     */
    function getReleasableAmount(address _beneficiary) external view returns (uint256) {
        Vesting storage vesting = vestingSchedules[_beneficiary];
        if (vesting.totalAmount == 0) return 0;
        return _calculateReleasable(vesting);
    }

    /**
     * @notice 撤销锁仓（仅管理员）
     */
    function revokeVesting(address _beneficiary) external onlyRole(DEFAULT_ADMIN_ROLE) {
        Vesting storage vesting = vestingSchedules[_beneficiary];
        require(vesting.revocable, "Not revocable");
        require(vesting.totalAmount > 0, "No vesting");
        
        uint256 unreleased = vesting.totalAmount - vesting.releasedAmount;
        vesting.totalAmount = vesting.releasedAmount;
        vesting.revocable = false;
        
        _burn(address(this), unreleased);
        totalMinted -= unreleased;
        
        emit VestingRevoked(_beneficiary, unreleased);
    }

    /**
     * @notice 销毁代币
     */
    function burn(uint256 _amount) public override onlyRole(BURNER_ROLE) {
        super.burn(_amount);
    }

    /**
     * @notice 从指定地址销毁
     */
    function burnFrom(address _account, uint256 _amount) 
        public 
        override 
        onlyRole(BURNER_ROLE) 
    {
        super.burnFrom(_account, _amount);
    }

    /**
     * @notice 获取剩余可铸造数量
     */
    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalMinted;
    }
}
