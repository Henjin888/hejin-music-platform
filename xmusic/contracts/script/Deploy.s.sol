// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/XMusicFactory.sol";
import "../src/XMToken.sol";

/**
 * @title DeployScript
 * @notice 部署脚本 - Sepolia 测试网
 */
contract DeployScript is Script {
    // Sepolia 测试网配置
    address constant SEPOLIA_TREASURY = 0x1234567890123456789012345678901234567890; // 替换为实际地址
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deployer address:", deployer);
        console.log("Deploying to Sepolia testnet...");
        
        vm.startBroadcast(deployerPrivateKey);

        // 1. 部署平台代币
        XMToken xmToken = new XMToken();
        console.log("XMToken deployed at:", address(xmToken));

        // 2. 部署工厂合约
        XMusicFactory factory = new XMusicFactory(SEPOLIA_TREASURY);
        console.log("XMusicFactory deployed at:", address(factory));

        // 3. 配置权限
        xmToken.grantRole(xmToken.MINTER_ROLE(), address(factory));
        factory.grantRole(factory.OPERATOR_ROLE(), deployer);
        
        console.log("Permissions configured");

        vm.stopBroadcast();
        
        console.log("Deployment completed!");
        console.log("--------------------");
        console.log("XMToken:", address(xmToken));
        console.log("XMusicFactory:", address(factory));
    }
}
