import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// Get all records for a table
router.get('/:table', async (req: any, res) => {
  try {
    const { table } = req.params;
    const ownerId = req.user?.id || 'default-user-id';
    const tableName = `dyn_${table.toLowerCase()}`;

    const data = await prisma.$queryRawUnsafe(
      `SELECT * FROM "${tableName}" WHERE owner_id = $1 ORDER BY created_at DESC`,
      ownerId
    );

    res.json(data);
  } catch (error: any) {
    console.error(`Error fetching data for ${req.params.table}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new record
router.post('/:table', async (req: any, res) => {
  try {
    const { table } = req.params;
    const ownerId = req.user?.id || 'default-user-id';
    const tableName = `dyn_${table.toLowerCase()}`;

    // Filter out internal fields if they happen to be in body
    const { id, owner_id, created_at, updated_at, ...data } = req.body;

    const fields = Object.keys(data);
    const values = Object.values(data);

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
    console.error(`Error creating record for ${req.params.table}:`, error);
    res.status(400).json({ error: error.message });
  }
});

// Update a record
router.put('/:table/:id', async (req: any, res) => {
  try {
    const { table, id } = req.params;
    const ownerId = req.user?.id || 'default-user-id';
    const tableName = `dyn_${table.toLowerCase()}`;

    const { owner_id, created_at, updated_at, ...data } = req.body;
    const fields = Object.keys(data);
    const values = Object.values(data);

    const setClause = fields.map((f, i) => `"${f}" = $${i + 3}`).join(', ');

    const sql = `
      UPDATE "${tableName}"
      SET ${setClause}, "updated_at" = CURRENT_TIMESTAMP
      WHERE "id" = $1 AND "owner_id" = $2
      RETURNING *;
    `;

    const result = await prisma.$queryRawUnsafe(sql, id, ownerId, ...values);
    res.json((result as any)[0]);
  } catch (error: any) {
    console.error(`Error updating record ${req.params.id} for ${req.params.table}:`, error);
    res.status(400).json({ error: error.message });
  }
});

// Delete a record
router.delete('/:table/:id', async (req: any, res) => {
  try {
    const { table, id } = req.params;
    const ownerId = req.user?.id || 'default-user-id';
    const tableName = `dyn_${table.toLowerCase()}`;

    await prisma.$queryRawUnsafe(
      `DELETE FROM "${tableName}" WHERE "id" = $1 AND "owner_id" = $2`,
      id,
      ownerId
    );

    res.json({ message: 'Deleted successfully' });
  } catch (error: any) {
    console.error(`Error deleting record ${req.params.id} for ${req.params.table}:`, error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
