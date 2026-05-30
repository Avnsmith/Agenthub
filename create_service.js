// create_service.js
require('dotenv').config({ path: '/Users/vinh/Documents/AgentHUB/apps/api/.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  try {
    const service = await prisma.apiService.create({
      data: {
        name: 'Demo Service',
        description: 'A test service for audit',
        endpoint: 'https://example.com/api',
        pricePerCall: '5000', // $0.005 USDC (6 decimals)
        sellerAddress: process.env.SELLER_ADDRESS,
        category: 'AI & ML',
        tags: ['audit', 'demo'],
        isActive: true,
      },
    });
    console.log('Created service ID:', service.id);
  } catch (e) {
    console.error('Error creating service:', e);
  } finally {
    await prisma.$disconnect();
  }
})();
