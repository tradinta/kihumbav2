// Consolidated API Client for Kihumba
// Used by all frontend apps (Web, Sellers, Logistics, Kao)

export class ApiError extends Error {
    public status: number;
    public data: any;

    constructor(status: number, message: string, data: any = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

async function fetchWithConfig(apiBase: string, endpoint: string, options: RequestInit = {}) {
    // Normalize slashes: strip trailing from base, leading from endpoint
    const base = apiBase.replace(/\/+$/, '');
    const path = endpoint.replace(/^\/+/, '');
    const url = endpoint.startsWith('http') ? endpoint : `${base}/${path}`;
    
    const config: RequestInit = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        credentials: 'include',
        cache: 'no-store', // Prevent stale membership data
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
        config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
        let errorData;
        const text = await response.text();
        try {
            errorData = text ? JSON.parse(text) : { message: response.statusText };
        } catch (e) {
            errorData = { message: response.statusText || 'Unknown API Error' };
        }
        throw new ApiError(response.status, errorData.message || 'API request failed', errorData);
    }

    if (response.status === 204) {
        return null;
    }

    const text = await response.text();
    try {
        return text ? JSON.parse(text) : null;
    } catch (e) {
        return text; // Return raw text if not JSON
    }
}

export const createApiClient = (apiBase: string) => ({
    get: (endpoint: string, options?: RequestInit) => fetchWithConfig(apiBase, endpoint, { ...options, method: 'GET' }),
    post: (endpoint: string, body?: any, options?: RequestInit) => fetchWithConfig(apiBase, endpoint, { ...options, method: 'POST', body }),
    put: (endpoint: string, body?: any, options?: RequestInit) => fetchWithConfig(apiBase, endpoint, { ...options, method: 'PUT', body }),
    patch: (endpoint: string, body?: any, options?: RequestInit) => fetchWithConfig(apiBase, endpoint, { ...options, method: 'PATCH', body }),
    delete: (endpoint: string, options?: RequestInit) => fetchWithConfig(apiBase, endpoint, { ...options, method: 'DELETE' }),
});
