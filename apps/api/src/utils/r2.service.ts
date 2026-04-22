import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class R2Service {
    private client: S3Client;

    constructor() {
        this.client = new S3Client({
            region: 'auto',
            endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID!,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
            },
        });
    }

    /**
     * Generate a presigned URL for uploading a file to R2.
     * @param contentType The MIME type of the file (e.g. image/jpeg)
     * @param prefix Optional prefix for the key (e.g. 'marketplace/')
     */
    async getPresignedUploadUrl(contentType: string, prefix: string = '') {
        const key = `${prefix}${uuidv4()}`;
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        });

        // URL expires in 15 minutes
        const url = await getSignedUrl(this.client, command, { expiresIn: 900 });

        return {
            url,
            key,
            publicUrl: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`,
        };
    }
}
