import { z } from 'zod';

export const FieldTypeSchema = z.enum(['string', 'number', 'boolean', 'date', 'text', 'email']);

export const TableFieldSchema = z.object({
  name: z.string(),
  type: FieldTypeSchema,
  required: z.boolean().optional().default(false),
  unique: z.boolean().optional().default(false),
});

export const TableSchema = z.object({
  name: z.string(),
  fields: z.array(TableFieldSchema),
});

export const ComponentTypeSchema = z.enum(['table', 'form', 'chart', 'stat', 'container']);

export const UIComponentSchema = z.any(); // Recursive, simplified for now

export const PageSchema = z.object({
  title: z.string(),
  path: z.string(),
  sections: z.array(z.object({
    type: ComponentTypeSchema,
    config: z.any(),
  })),
});

export const AppConfigSchema = z.object({
  appName: z.string(),
  database: z.object({
    tables: z.array(TableSchema),
  }),
  ui: z.object({
    pages: z.array(PageSchema),
    navigation: z.array(z.object({
      label: z.string(),
      path: z.string(),
      icon: z.string().optional(),
    })),
  }),
  auth: z.object({
    enabled: z.boolean().optional().default(true),
    allowRegistration: z.boolean().optional().default(true),
  }),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;
export type Table = z.infer<typeof TableSchema>;
