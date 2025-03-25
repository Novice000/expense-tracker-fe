import z, { ZodSchema } from "zod";

export const registerSchema: ZodSchema = z.object({
    username: z.string().min(5, "Username must be at least 5 characters").max(30, "Username must be at most 30 characters"),
    budget: z.number().min(1000, "budget must be a minimum of 1000"),
    password: z.string().min(5, "Password must be at least 5 characters").refine(val => /[0-9]/.test(val), "Password must contain at least one number").refine(val => /[A-Z]/.test(val), "Password must contain at least one uppercase letter").refine(val=>/[a-z]/.test(val), "Password must contain at least one lowercase letter").refine(val=> /[#$!%*?&_-]/.test(val), "Password must contain at least one special character" ),
    confirmPassword: z.string()
}).refine(data=> data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

export const loginSchema: ZodSchema = z.object({
    username: z.string().min(5, "Username must be at least 5 characters").max(30, "Username must be at most 30 characters"),
    password: z.string().min(5, "Password must be at least 5 characters").refine(val => /[0-9]/.test(val), "Password must contain at least one number").refine(val => /[A-Z]/.test(val), "Password must contain at least one uppercase letter").refine(val=>/[a-z]/.test(val), "Password must contain at least one lowercase letter").refine(val=>/[#$!%*?&_-]/.test(val), "Password must contain at least one special character" ),
});