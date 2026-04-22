import { Injectable, OnModuleInit } from '@nestjs/common';
import { algoliasearch, SearchClient } from 'algoliasearch';

@Injectable()
export class AlgoliaService implements OnModuleInit {
    private client: SearchClient;

    onModuleInit() {
        this.client = algoliasearch(
            process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
            process.env.ALGOLIA_ADMIN_KEY!
        );
    }

    async indexPost(post: any) {
        try {
            await this.client.saveObjects({
                indexName: 'kihumba_posts',
                objects: [{
                    objectID: post.id,
                    content: post.content,
                    contentType: post.contentType,
                    createdAt: new Date(post.createdAt).getTime(),
                    author: {
                        id: post.author.id,
                        username: post.author.username,
                        fullName: post.author.fullName,
                        avatar: post.author.avatar
                    },
                    videoTitle: post.video?.title || '',
                    isSpark: post.video?.isSpark || false,
                    likes: post._count?.interactions || 0,
                    comments: post._count?.comments || 0,
                    viewCount: post.viewCount || 0,
                    tags: post.content.match(/#\w+/g) || []
                }]
            });
        } catch (error) {
            console.error('Algolia Index Post Error:', error);
        }
    }

    async indexUser(user: any) {
        try {
            await this.client.saveObjects({
                indexName: 'kihumba_users',
                objects: [{
                    objectID: user.id,
                    username: user.username,
                    fullName: user.fullName,
                    avatar: user.avatar,
                    createdAt: new Date(user.createdAt).getTime()
                }]
            });
        } catch (error) {
            console.error('Algolia Index User Error:', error);
        }
    }

    async deletePost(postId: string) {
        try {
            await this.client.deleteObjects({
                indexName: 'kihumba_posts',
                objectIDs: [postId]
            });
        } catch (error) {
            console.error('Algolia Delete Post Error:', error);
        }
    }
}
