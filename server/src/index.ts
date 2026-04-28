import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dynamicRouter from './routes/dynamic.js';
import prisma from './lib/prisma.js';
import { SchemaManager } from './lib/schema-manager.js';
import { AppConfigSchema } from './types/config.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/data', dynamicRouter);

// Endpoint to update app configuration
app.post('/api/config', async (req, res) => {
  try {
    const config = AppConfigSchema.parse(req.body);
    const ownerId = 'default-user-id'; // Mock

    // Save config to DB
    const savedConfig = await prisma.appConfig.upsert({
      where: { id: 'current-config' }, // Simplified for MVP
      create: {
        id: 'current-config',
        name: config.appName,
        config: config as any,
        ownerId
      },
      update: {
        name: config.appName,
        config: config as any
      },
    });

    // Ensure database structure matches
    await SchemaManager.syncSchema(config);

    res.json({ message: 'Configuration updated and database synced', config: savedConfig });
    } catch (error: any) {
    console.error('Configuration deployment error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/config', async (req, res) => {
  const config = await prisma.appConfig.findFirst();
  res.json(config?.config || null);
});

app.listen(PORT, async () => {
  console.log(`Aether Server running on http://localhost:${PORT}`);
  
  // Ensure default user exists for the mock ownerId
  try {
    await prisma.user.upsert({
      where: { id: 'default-user-id' },
      update: {},
      create: {
        id: 'default-user-id',
        email: 'admin@aether.ai',
        password: 'admin-password-mock'
      }
    });
  } catch (e) {
    console.error('Failed to create default user:', e);
  }
});
