import { createApiClient } from "@kihumba/shared";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = createApiClient(API_BASE);
