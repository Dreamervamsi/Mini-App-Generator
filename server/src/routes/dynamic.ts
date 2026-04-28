import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// Middleware to authenticate and attach user (mocked for now, will integrate properly)
// For now, assume req.user.id exists

router.get('/:table', async (req: any, res) => {
  try {
    const { table } = req.params;
    const ownerId = req.user?.id || 'default-user-id'; // To be replaced with real auth
    const tableName = `dyn_${table.toLowerCase()}`;

    const data = await prisma.$queryRawUnsafe(
      `SELECT * FROM "${tableName}" WHERE owner_id = $1`,
      ownerId
    );

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:table', async (req: any, res) => {
  try {
    const { table } = req.params;
    const ownerId = req.user?.id || 'default-user-id';
    const tableName = `dyn_${table.toLowerCase()}`;
    const fields = Object.keys(req.body);
    const values = Object.values(req.body);

    const placeholders = fields.map((_, i) => `$${i + 2}`).join(', ');
    const columns = fields.map(f => `"${f}"`).join(', ');

    const sql = `
      INSERT INTO "${tableName}" ("owner_id", ${columns})
      VALUES ($1, ${placeholders})
      RETURNING *;
    `;

    const result = await prisma.$queryRawUnsafe(sql, ownerId, ...values);
    res.status(201).json((result as any)[0]);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Add PUT and DELETE similarly...

export default router;
