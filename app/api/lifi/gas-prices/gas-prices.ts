import { feeOptimizer } from '@/app/lib/fee-optimizer';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await feeOptimizer.getOptimizedFees();
    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to fetch gas prices:', error);
    res.status(500).json({ error: 'Failed to fetch gas prices' });
  }
}