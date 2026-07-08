import {z} from "zod"
import { createPostSchema, reactPost } from "./post.validation"

export type createPostDto = z.infer<typeof createPostSchema.body>
export type ReactPostQueryDto = z.infer<typeof reactPost.query>
export type ReactPostparamDto = z.infer<typeof reactPost.params>
