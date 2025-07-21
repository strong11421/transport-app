// src/posts/dto/create-post.dto.ts
import { IsString, MinLength, IsInt } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  content: string;

  @IsInt()
  userId: number; // ✅ This is required
}
