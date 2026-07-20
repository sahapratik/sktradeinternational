import { z } from 'zod';

export const quoteRequestSchema = z.object({
  contactName: z.string().trim().min(1).max(120),
  contactEmail: z.string().trim().email().max(180),
  contactPhone: z.string().trim().min(5).max(30),
  company: z.string().trim().max(160).optional(),
  sector: z.enum([
    'Tableware',
    'Tiles',
    'Sanitary Ware',
    'Machinery',
    'Kiln Furniture',
    'Logistics',
    'Technical Support',
    'Other',
  ]),
  message: z.string().trim().max(2000).optional(),
  items: z
    .array(
      z.object({
        productName: z.string().trim().min(1).max(160),
        quantity: z.string().trim().max(60).optional(),
      })
    )
    .max(30)
    .default([]),
  // Honeypot field: real users never populate a field hidden via CSS.
  // A filled honeypot means a bot filled every visible field programmatically.
  website: z.string().max(0).optional(),
});

export const chatIntakeSchema = z.object({
  name: z.string().trim().min(1).max(120),
  contact: z.string().trim().min(3).max(180),
  sector: z.string().trim().max(60),
  message: z.string().trim().min(1).max(2000),
  pageContext: z.string().trim().max(200).optional(),
  website: z.string().max(0).optional(), // honeypot
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email().max(180),
  password: z.string().min(8).max(200),
});
