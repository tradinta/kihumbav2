
'use client';

import { useSession } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface SettingsGuardProps {
    children: React.ReactNode;
    title: string;
}

export default function SettingsGuard({ children, title }: SettingsGuardProps) {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        document.title = `${title} | Kihumba Settings`;
    }, [title]);

    useEffect(() => {
        if (!isPending && !session) {
            setIsRedirecting(true);
            router.push(`/auth/login?callbackUrl=${pathname}`);
        } else if (session?.user && (session.user as any).isBanned) {
            setIsRedirecting(true);
            router.push('/banned');
        }
    }, [session, isPending, router, pathname]);

    if (isPending || !session || isRedirecting || (session?.user as any).isBanned) {
        return (
            <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999]">
                <div className="relative">
                    <div className="size-24 border-2 border-primary-gold/10 rounded-full animate-pulse" />
                    <Loader2 size={32} className="text-primary-gold animate-spin absolute inset-0 m-auto" />
                </div>
                <p className="mt-6 text-[10px] font-black text-primary-gold uppercase tracking-[0.4em] animate-pulse">
                    Verifying Identity...
                </p>
            </div>
        );
    }

    return <>{children}</>;
}
