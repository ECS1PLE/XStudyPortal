import { z } from 'zod';
import { defaultStartingPrices, helpTypeLabels, materialTypeLabels } from '@/lib/constants';

const helpTypeKeys = Object.keys(helpTypeLabels) as Array<keyof typeof helpTypeLabels>;
const materialTypeKeys = Object.keys(materialTypeLabels) as Array<keyof typeof materialTypeLabels>;

const priceMap = z.object({
  LAB_GUIDANCE: z.coerce.number().min(0),
  PRACTICE_COACHING: z.coerce.number().min(0),
  REPORT_REVIEW: z.coerce.number().min(0),
  COURSE_PROJECT_MENTORING: z.coerce.number().min(0),
  THESIS_CONSULTING: z.coerce.number().min(0)
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6)
});

export const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6),
  university: z.string().trim().min(2),
  course: z.coerce.number().int().min(1).max(6),
  isPerformer: z.boolean().default(false),
  bio: z.string().optional().transform((value) => value?.trim() || undefined),
  subjects: z.array(z.string().trim()).default([]),
  telegram: z.string().optional().transform((value) => value?.trim() || undefined),
  startingPrices: priceMap.default(defaultStartingPrices)
});

export const materialSchema = z.object({
  title: z.string().trim().min(5),
  description: z.string().trim().min(10),
  subject: z.string().trim().min(2),
  university: z.string().trim().min(2),
  type: z.enum(materialTypeKeys),
  downloadUrl: z.string().url()
});

export const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().min(1)
    })
  ).min(1)
});

export const adminPromoteSchema = z.object({
  userId: z.string().min(1)
});

export const adminMaterialSchema = z.object({
  materialId: z.string().min(1),
  status: z.enum(['APPROVED', 'REJECTED'])
});

export const performerVerifySchema = z.object({
  performerId: z.string().min(1),
  isVerified: z.boolean()
});

export const performerReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(1000).optional().transform((value) => value?.trim() || undefined)
});

export const performerQuerySchema = z.object({
  university: z.string().optional(),
  subject: z.string().optional(),
  helpType: z.enum(helpTypeKeys).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional()
});