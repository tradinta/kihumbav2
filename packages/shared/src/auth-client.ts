import { createAuthClient } from 'better-auth/react';
import { phoneNumberClient, twoFactorClient, magicLinkClient } from 'better-auth/client/plugins';
import { passkeyClient } from '@better-auth/passkey/client';

export const createKihumbaAuthClient = (apiBase: string) => {
    return createAuthClient({
        baseURL: apiBase,
        plugins: [
            phoneNumberClient(),
            twoFactorClient(),
            passkeyClient(),
            magicLinkClient(),
        ],
    });
};
