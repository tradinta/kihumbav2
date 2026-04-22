import { Controller, Post, Body, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { StorageService } from './storage.service';
import { AuthGuard } from '../auth/better-auth';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  /**
   * Request a presigned URL to upload a file directly to R2
   */
  @Post('presigned-url')
  @UseGuards(AuthGuard)
  async getPresignedUrl(
    @Body('fileName') fileName: string,
    @Body('contentType') contentType: string,
    @Body('folder') folder: 'avatars' | 'covers' | 'documents' | 'events' | 'thumbnails' | 'fires' = 'avatars',
  ) {
    if (!fileName || !contentType) {
      throw new BadRequestException('fileName and contentType are required');
    }

    // MIME Validation
    if (folder === 'documents') {
      const VALID_DOCS = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain'
      ];
      if (!VALID_DOCS.includes(contentType)) {
        throw new BadRequestException('Invalid document type. Only PDF, DOCX, PPTX and TXT are allowed.');
      }
    } else if (folder !== 'thumbnails' && !contentType.startsWith('image/')) {
        // Thumbnail can be image, others like avatars/covers/events must be images
        throw new BadRequestException('Only images are allowed in this folder');
    }

    return this.storageService.getPresignedUrl(fileName, contentType, folder);
  }

  /**
   * Verify that an uploaded file is an "actual photo" (Magic Number verification)
   */
  @Post('verify')
  @UseGuards(AuthGuard)
  async verifyUpload(@Body('key') key: string) {
    if (!key) throw new BadRequestException('key is required');

    const isValid = await this.storageService.validateImageSignature(key);
    
    if (!isValid) {
      throw new BadRequestException('File verification failed: Not an actual photo.');
    }

    return { success: true, message: 'File verified successfully' };
  }

  /**
   * Verify that an uploaded file is a legitimate document
   */
  @Post('verify-document')
  @UseGuards(AuthGuard)
  async verifyDocument(@Body('key') key: string) {
    if (!key) throw new BadRequestException('key is required');

    const isValid = await this.storageService.validateDocumentSignature(key);
    
    if (!isValid) {
      throw new BadRequestException('Document verification failed: Invalid or malicious file signature.');
    }

    return { success: true, message: 'Document verified successfully' };
  }
}
