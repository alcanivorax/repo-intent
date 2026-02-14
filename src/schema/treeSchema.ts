import { z } from 'zod'

export const treeItemSchema = z.object({
  path: z.string(),
  type: z.enum(['blob']),
  size: z.number().int().nonnegative().optional(),
})

export const treeSchema = z.array(treeItemSchema)

export type TreeSchema = z.infer<typeof treeSchema>
