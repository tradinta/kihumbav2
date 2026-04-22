import { createKihumbaAuthClient } from "@kihumba/shared";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api') + '/auth';

export const authClient = createKihumbaAuthClient(API_BASE);

export const {
    signIn,
    signUp,
    signOut,
    useSession,
} = authClient;
