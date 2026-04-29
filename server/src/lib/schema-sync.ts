import prisma from './prisma.js';

export interface EntityField {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  required?: boolean;
}

export interface EntityConfig {
  slug: string;
  label: string;
  fields: EntityField[];
}

const TYPE_MAP: Record<string, string> = {
  string: 'TEXT',
  number: 'DOUBLE PRECISION',
  boolean: 'BOOLEAN',
  date: 'TIMESTAMP WITH TIME ZONE',
};

export async function syncSchema(entities: EntityConfig[]) {
  console.log('Synchronizing schema for entities:', entities.map(e => e.slug));
  
  for (const entity of entities) {
    const tableName = `dyn_${entity.slug.toLowerCase()}`;
    
    // 1. Create table if not exists with base columns
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "${tableName}" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "owner_id" TEXT NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Ensure each field exists as a column
    for (const field of entity.fields) {
      const dbType = TYPE_MAP[field.type] || 'TEXT';
      const isRequired = field.required ? 'NOT NULL' : '';
      
      try {
        // We use a safe way to add columns if they don't exist
        // PostgreSQL doesn't have "ADD COLUMN IF NOT EXISTS" in older versions, 
        // but it does in recent ones. Let's assume modern PG or handle error.
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "${tableName}" 
          ADD COLUMN IF NOT EXISTS "${field.name}" ${dbType} ${field.required && field.type === 'string' ? "DEFAULT ''" : ""}
        `);
        
        // If it already exists, we might want to update types/constraints, 
        // but for an MVP, adding missing columns is enough.
      } catch (error) {
        console.error(`Error adding column ${field.name} to ${tableName}:`, error);
      }
    }
  }
}
