// audit_balance.js
require('dotenv').config({ path: '/Users/vinh/Documents/AgentHUB/.env' });
const { privateKeyToAccount, getAddress } = require('viem');
const { createPublicClient, http, decodeFunctionResult, encodeFunctionData } = require('viem');
const { arcTestnet } = require('./packages/config/src/index');

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.ARC_RPC_PRIMARY;

if (!PRIVATE_KEY || !RPC_URL) {
  console.error('Missing PRIVATE_KEY or RPC_URL');
  process.exit(1);
}

const account = privateKeyToAccount(PRIVATE_KEY);
const address = account.address;

const client = createPublicClient({ chain: arcTestnet, transport: http(RPC_URL) });

(async () => {
  try {
    const nativeBal = await client.getBalance({ address });
    const usdcAddress = '0x3600000000000000000000000000000000000000';
    const balanceOfData = encodeFunctionData({ abi: [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ type: 'address', name: 'account' }], outputs: [{ type: 'uint256', name: '' }] }], functionName: 'balanceOf', args: [address] });
    const usdcBalHex = await client.call({ data: balanceOfData, to: usdcAddress, account });
    const usdcBal = decodeFunctionResult({ abi: [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ type: 'address', name: 'account' }], outputs: [{ type: 'uint256', name: '' }] }], functionName: 'balanceOf', data: usdcBalHex });
    console.log('Buyer address:', address);
    console.log('Native ARC balance (wei):', nativeBal.toString());
    console.log('USDC balance (units, 6 decimals):', usdcBal.toString());
  } catch (e) {
    console.error('Error:', e);
  }
})();
