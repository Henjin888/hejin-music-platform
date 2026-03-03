// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/XMusicFactory.sol";
import "../src/ArtistProject.sol";
import "../src/XMToken.sol";

/**
 * @title XMusicTest
 * @notice 完整测试套件
 */
contract XMusicTest is Test {
    XMusicFactory factory;
    XMToken xmToken;
    
    address admin = address(1);
    address artist = address(2);
    address agent = address(3);
    address investor1 = address(4);
    address investor2 = address(5);
    address treasury = address(6);

    function setUp() public {
        vm.startPrank(admin);
        
        xmToken = new XMToken();
        factory = new XMusicFactory(treasury);
        xmToken.grantRole(xmToken.MINTER_ROLE(), address(factory));
        factory.grantRole(factory.OPERATOR_ROLE(), admin);
        
        // 调整工厂配置以便测试
        factory.updateConfig(
            250, // 2.5% fee
            1 ether, // min target - 降低
            10000 ether, // max target
            1 days, // min duration
            180 days, // max duration
            false // require verification
        );
        
        vm.stopPrank();
        
        // 给投资人一些 ETH
        vm.deal(investor1, 1000 ether);
        vm.deal(investor2, 1000 ether);
    }

    function test_CreateProject() public {
        vm.prank(admin);
        
        ArtistProject.Allocation memory allocation = ArtistProject.Allocation({
            artistShare: 4000,
            investorShare: 3500,
            agentShare: 1500,
            communityShare: 1000
        });

        address projectAddr = factory.createProject(
            "Lin Xi Token",
            "LXT",
            "Lin Xi's 2025 Tour",
            "First national tour",
            "Indie Pop",
            "Beijing",
            artist,
            agent,
            10 ether, // 目标10 ether
            0.1 ether,
            1000, // 1000份
            0.01 ether, // 每份0.01 ether
            30 days,
            allocation
        );

        assertTrue(factory.isProject(projectAddr));
        assertEq(factory.getProjectCount(), 1);
        
        address[] memory artistProjects = factory.getArtistProjects(artist);
        assertEq(artistProjects.length, 1);
        assertEq(artistProjects[0], projectAddr);
        
        console.log("Project created at:", projectAddr);
    }

    function test_InvestInProject() public {
        // 创建项目
        vm.prank(admin);
        
        ArtistProject.Allocation memory allocation = ArtistProject.Allocation({
            artistShare: 4000,
            investorShare: 3500,
            agentShare: 1500,
            communityShare: 1000
        });

        address projectAddr = factory.createProject(
            "Lin Xi Token",
            "LXT",
            "Lin Xi's 2025 Tour",
            "First national tour",
            "Indie Pop",
            "Beijing",
            artist,
            agent,
            10 ether,
            0.1 ether,
            1000,
            0.01 ether,
            30 days,
            allocation
        );

        ArtistProject project = ArtistProject(payable(projectAddr));

        // 投资人1投资 50份 = 0.5 ether
        vm.prank(investor1);
        project.invest{value: 0.5 ether}(50);

        assertEq(project.balanceOf(investor1), 50);
        
        // 投资人2投资 100份 = 1 ether
        vm.prank(investor2);
        project.invest{value: 1 ether}(100);

        assertEq(project.balanceOf(investor2), 100);
        
        console.log("Investment test passed");
    }

    function test_RevenueDistribution() public {
        // 创建项目
        vm.prank(admin);
        
        ArtistProject.Allocation memory allocation = ArtistProject.Allocation({
            artistShare: 4000,
            investorShare: 3500,
            agentShare: 1500,
            communityShare: 1000
        });

        address projectAddr = factory.createProject(
            "Lin Xi Token",
            "LXT",
            "Lin Xi's 2025 Tour",
            "First national tour",
            "Indie Pop",
            "Beijing",
            artist,
            agent,
            10 ether, // 目标 10 ether
            0.1 ether,
            1000, // 1000份
            0.01 ether, // 每份0.01 ether
            30 days,
            allocation
        );

        // 投资 - 目标10 ether / 每份0.01 ether = 1000份
        // 投资人份额是35%，即350份 = 3.5 ether，但这样达不到目标
        // 需要调整：让目标等于投资人可投的最大值
        // 350份 * 0.01 ether = 3.5 ether，所以目标设为3.5 ether
        
        // 重新创建项目，调整目标
        vm.stopPrank();
        vm.startPrank(admin);
        
        // 更新工厂配置允许更低的目标
        factory.updateConfig(
            250, // 2.5% fee
            0.1 ether, // min target - 降低
            10000 ether, // max target
            1 days, // min duration
            180 days, // max duration
            false // require verification
        );
        
        address projectAddr2 = factory.createProject(
            "Lin Xi Token 2",
            "LXT2",
            "Lin Xi's 2025 Tour",
            "First national tour",
            "Indie Pop",
            "Beijing",
            artist,
            agent,
            3.5 ether, // 目标 = 350份 * 0.01 ether
            0.1 ether,
            1000,
            0.01 ether,
            30 days,
            allocation
        );
        
        vm.stopPrank();

        ArtistProject project = ArtistProject(payable(projectAddr2));

        // 投资350份 = 3.5 ether，正好达到目标
        vm.prank(investor1);
        project.invest{value: 3.5 ether}(350);

        // 检查项目状态是否变为 FUNDED
        ArtistProject.ProjectStatus status = project.getProjectStatus();
        assertEq(uint256(status), uint256(ArtistProject.ProjectStatus.FUNDED));

        // 添加收益
        vm.deal(artist, 100 ether);
        vm.prank(artist);
        project.addRevenue{value: 5 ether}("Streaming revenue");

        // 检查待领取收益
        uint256 pending = project.getPendingRewards(investor1);
        assertGt(pending, 0);
        
        console.log("Pending rewards for investor1:", pending);

        // 领取收益
        uint256 balanceBefore = investor1.balance;
        vm.prank(investor1);
        project.claimRewards();
        uint256 balanceAfter = investor1.balance;

        assertGt(balanceAfter, balanceBefore);
        assertEq(project.getPendingRewards(investor1), 0);
        
        console.log("Revenue distribution test passed");
    }

    function test_PlatformConfig() public {
        vm.prank(admin);
        
        // 更新配置
        factory.updateConfig(
            300, // 3% fee
            5000 * 1e18, // min target
            2000000 * 1e18, // max target
            3 days, // min duration
            180 days, // max duration
            true // require verification
        );
        
        (uint256 feeRate,,,,,bool requireVerification) = factory.config();
        
        assertEq(feeRate, 300);
        assertTrue(requireVerification);
        
        console.log("Platform config test passed");
    }

    function test_RevertWhen_InvestBelowMinimum() public {
        vm.prank(admin);
        
        ArtistProject.Allocation memory allocation = ArtistProject.Allocation({
            artistShare: 4000,
            investorShare: 3500,
            agentShare: 1500,
            communityShare: 1000
        });

        address projectAddr = factory.createProject(
            "Lin Xi Token",
            "LXT",
            "Lin Xi's 2025 Tour",
            "First national tour",
            "Indie Pop",
            "Beijing",
            artist,
            agent,
            10 ether,
            1 ether, // min investment 1 ether
            1000,
            0.01 ether,
            30 days,
            allocation
        );

        ArtistProject project = ArtistProject(payable(projectAddr));

        vm.prank(investor1);
        // 尝试投资低于最低限额 - 应该回滚
        vm.expectRevert("Below minimum");
        project.invest{value: 0.5 ether}(50);
    }
}
