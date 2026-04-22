"use client";

import { createContext, useContext, type ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

// Re-export session hook for convenience
const { useSession } = authClient;

interface AuthContextType {
    user: any;
    session: any;
    isLoading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data, isPending } = useSession();

    const value: AuthContextType = {
        user: data?.user ?? null,
        session: data?.session ?? null,
        isLoading: isPending,
        isAuthenticated: !!data?.user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
