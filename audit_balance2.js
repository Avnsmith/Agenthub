// audit_balance2.js
require('dotenv').config({ path: '/Users/vinh/Documents/AgentHUB/.env' });
const { ethers } = require('ethers');
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.ARC_RPC_PRIMARY;
if (!PRIVATE_KEY || !RPC_URL) {
  console.error('Missing PRIVATE_KEY or RPC_URL');
  process.exit(1);
}
const wallet = new ethers.Wallet(PRIVATE_KEY);
const address = wallet.address;
const provider = new ethers.JsonRpcProvider(RPC_URL);
(async () => {
  try {
    const nativeBal = await provider.getBalance(address);
    const usdcAddress = '0x3600000000000000000000000000000000000000';
    const usdcAbi = ["function balanceOf(address) view returns (uint256)"];
    const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, provider);
    const usdcBal = await usdcContract.balanceOf(address);
    console.log('Buyer address:', address);
    console.log('Native ARC balance (wei):', nativeBal.toString());
    console.log('USDC balance (units, 6 decimals):', usdcBal.toString());
  } catch (e) {
    console.error('Error:', e);
  }
})();
