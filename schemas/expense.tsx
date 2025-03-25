import z, { ZodSchema } from "zod";

const expenseSchema: ZodSchema = z.object({
    amount: z.number(),
    description: z.string()
})

export {
    expenseSchema
}