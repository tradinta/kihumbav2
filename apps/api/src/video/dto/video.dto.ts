import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class VideoUploadUrlDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  subtitleMode?: 'AUTO' | 'NONE';
}

export class CreateVideoDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  uploadId: string;
}
