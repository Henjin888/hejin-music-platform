// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/XMusicFactory.sol";
import "../src/XMToken.sol";
import "../src/ArtistProject.sol";

/**
 * @title DeployAndCreateProject
 * @notice 部署合约并创建示例项目
 */
contract DeployAndCreateProject is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        address treasury = vm.envAddress("TREASURY_ADDRESS");
        
        console.log("Deployer:", deployer);
        console.log("Treasury:", treasury);
        
        vm.startBroadcast(deployerPrivateKey);

        // 1. 部署平台代币
        XMToken xmToken = new XMToken();
        console.log("XMToken deployed at:", address(xmToken));

        // 2. 部署工厂合约
        XMusicFactory factory = new XMusicFactory(treasury);
        console.log("XMusicFactory deployed at:", address(factory));

        // 3. 配置权限
        xmToken.grantRole(xmToken.MINTER_ROLE(), address(factory));
        factory.grantRole(factory.OPERATOR_ROLE(), deployer);
        
        // 4. 更新工厂配置（降低门槛便于测试）
        factory.updateConfig(
            250, // 2.5% fee
            0.01 ether, // min target
            1000 ether, // max target
            1 days, // min duration
            180 days, // max duration
            false // require verification
        );
        
        console.log("Factory configured");

        // 5. 创建示例项目
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
            "First national tour - 10 cities across China",
            "Indie Pop",
            "Beijing",
            deployer, // 艺术家地址
            treasury, // 经纪人地址
            1 ether, // 目标 1 ETH
            0.01 ether, // 最低投资
            1000, // 1000份
            0.001 ether, // 每份0.001 ETH
            30 days,
            allocation
        );
        
        console.log("Example project created at:", projectAddr);

        vm.stopBroadcast();
        
        // 输出部署信息
        console.log("\n=== DEPLOYMENT COMPLETE ===");
        console.log("Network: Sepolia Testnet");
        console.log("XMToken:", address(xmToken));
        console.log("XMusicFactory:", address(factory));
        console.log("Example Project:", projectAddr);
        console.log("===========================\n");
        
        // 保存到文件
        string memory deploymentInfo = string.concat(
            "XMToken=", vm.toString(address(xmToken)), "\n",
            "XMusicFactory=", vm.toString(address(factory)), "\n",
            "ExampleProject=", vm.toString(projectAddr), "\n"
        );
        
        vm.writeFile("deployment-sepolia.txt", deploymentInfo);
        console.log("Deployment info saved to deployment-sepolia.txt");
    }
}
