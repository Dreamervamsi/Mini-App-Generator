import prisma from '../lib/prisma.js';
import type { AppConfig, Table } from '../types/config.js';

export class SchemaManager {
  static async syncSchema(config: AppConfig) {
    console.log(`Syncing schema for app: ${config.appName}`);

    for (const table of config.database.tables) {
      await this.ensureTable(table);
    }
  }

  private static async ensureTable(table: Table) {
    const tableName = `dyn_${table.name.toLowerCase()}`;

    // Check if table exists
    const exists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = ${tableName}
      );
    `;

    // type casting for raw query result
    const tableExists = (exists as any)[0]?.exists;

    if (!tableExists) {
      console.log(`Creating table: ${tableName}`);
      const fieldDefs = table.fields.map(f => {
        let sqlType = 'TEXT';
        if (f.type === 'number') sqlType = 'DOUBLE PRECISION';
        if (f.type === 'boolean') sqlType = 'BOOLEAN';
        if (f.type === 'date') sqlType = 'TIMESTAMP';

        return `"${f.name}" ${sqlType} ${f.required ? 'NOT NULL' : ''}`;
      });

      // Always add ID and OwnerID for scoping
      const sql = `
        CREATE TABLE "${tableName}" (
          "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "owner_id" UUID NOT NULL,
          "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          ${fieldDefs.join(',\n')}
        );
      `;

      await prisma.$executeRawUnsafe(sql);
      console.log(`Table ${tableName} created successfully.`);
    } else {
      // In a real app, we'd handle migrations/alter table here
      console.log(`Table ${tableName} already exists.`);
    }
  }
}
