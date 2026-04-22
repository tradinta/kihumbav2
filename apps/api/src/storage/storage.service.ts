import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private s3: S3Client;
  private logger = new Logger(StorageService.name);
  private bucket: string;

  constructor() {
    this.bucket = process.env.R2_BUCKET_NAME || 'kihumba-assets';
    
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    });
  }

  /**
   * Generates a presigned URL for direct client-side upload to R2
   * Enforces Content-Type and provides a secure path.
   */
  async getPresignedUrl(
    fileName: string, 
    contentType: string, 
    folder: 'avatars' | 'covers' | 'documents' | 'events' | 'thumbnails' | 'fires' = 'avatars'
  ) {
    const extension = fileName.split('.').pop();
    const key = `${folder}/${uuidv4()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    // We enforce the Content-Type in the signature
    const url = await getSignedUrl(this.s3, command, { 
      expiresIn: 3600,
    });
    
    const publicBase = process.env.R2_PUBLIC_URL?.replace(/\/+$/, '');
    if (!publicBase) {
      this.logger.error('R2_PUBLIC_URL is not defined in .env! Images will not load.');
    }

    return {
      url,
      key,
      publicUrl: publicBase ? `${publicBase}/${key}` : key, // Fallback to just key if base is missing
    };
  }

  /**
   * Validates if the file is an "actual photo" by checking magic numbers (signatures)
   * Fetches only the first 512 bytes from R2 to minimize egress/latency.
   */
  async validateImageSignature(key: string): Promise<boolean> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Range: 'bytes=0-511',
      });

      const response = await this.s3.send(command);
      if (!response.Body) return false;

      const buffer = Buffer.from(await response.Body.transformToByteArray());

      if (buffer.length < 4) return false;

      // Check Magic Numbers
      const hex = buffer.toString('hex', 0, 8).toUpperCase();

      // PNG: 89 50 4E 47
      if (hex.startsWith('89504E47')) return true;
      // JPEG: FF D8 FF
      if (hex.startsWith('FFD8FF')) return true;
      // GIF87a: 47 49 46 38 37 61 | GIF89a: 47 49 46 38 39 61
      if (hex.startsWith('474946383761') || hex.startsWith('474946383961')) return true;
      // WebP: 52 49 46 46 (RIFF) ... 57 45 42 50 (WEBP)
      if (hex.startsWith('52494646') && buffer.toString('utf8', 8, 12) === 'WEBP') return true;

      this.logger.warn(`Validation failed for ${key}: Invalid file signature.`);
      return false;
    } catch (e) {
      this.logger.error(`Validation failed for ${key}: ${e.message}`);
      return false;
    }
  }

  /**
   * Validates if the file is a legitimate document (PDF, DOCX, PPTX, TXT)
   */
  async validateDocumentSignature(key: string): Promise<boolean> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Range: 'bytes=0-511',
      });

      const response = await this.s3.send(command);
      if (!response.Body) return false;

      const buffer = Buffer.from(await response.Body.transformToByteArray());
      if (buffer.length < 4) return false;

      const hex = buffer.toString('hex', 0, 4).toUpperCase();

      // PDF: %PDF (25 50 44 46)
      if (hex === '25504446') return true;

      // DOCX / PPTX / ZIP: PK (50 4B 03 04)
      if (hex === '504B0304') return true;

      // TXT: Simple printable check for the first few bytes
      const text = buffer.toString('utf8', 0, 10);
      const isPrintable = /^[\x20-\x7E\s]*$/.test(text);
      if (isPrintable) return true;

      this.logger.warn(`Document validation failed for ${key}: Invalid signature.`);
      return false;
    } catch (e) {
      this.logger.error(`Document validation failed for ${key}: ${e.message}`);
      return false;
    }
  }
}
