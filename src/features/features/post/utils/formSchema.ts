import z from 'zod';

export const formPayloadSchema = z
  .object({
    caption: z.string().min(1, 'Caption is required'),
    image: z.instanceof(File, { message: 'Image is required' }),
  });

export type AddPostFormValues = z.infer<typeof formPayloadSchema>;