// src/posts/dto/update-post.dto.ts
import { IsOptional, IsString, MinLength, IsInt } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsInt()
  userId?: number; // ✅ Add this
}
