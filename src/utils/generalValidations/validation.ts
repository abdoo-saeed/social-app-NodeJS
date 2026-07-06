import z from "zod"




export const paginationValidationSchema = {
    query:z.strictObject({
            page:z.coerce.number().optional(),
            size:z.coerce.number().optional(),
            search:z.string().optional(),
    })
}

export type paginateDto = z.infer<typeof paginationValidationSchema.query>