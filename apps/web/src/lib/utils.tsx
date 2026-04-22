export function timeAgo(dateParam: string | Date | undefined): string {
    if (!dateParam) return '';
    
    const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
    const today = new Date();
    const seconds = Math.round((today.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) {
        return 'just now';
    } else if (minutes < 60) {
        return `${minutes}m`;
    } else if (hours < 24) {
        return `${hours}h`;
    } else if (days < 7) {
        return `${days}d`;
    } else if (days < 365) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
}
import React from 'react';
import Link from 'next/link';

export function renderContent(content: string) {
    if (!content) return null;

    // Regex for hashtags (#word) and mentions (@word)
    const regex = /([#@]\w+)/g;
    const parts = content.split(regex);

    return parts.map((part, index) => {
        if (part.startsWith('#')) {
            const hashtag = part.slice(1);
            return (
                <Link 
                    key={index} 
                    href={`/search?q=${encodeURIComponent(part)}`}
                    className="text-primary-gold hover:underline font-bold"
                    onClick={(e) => e.stopPropagation()}
                >
                    {part}
                </Link>
            );
        } else if (part.startsWith('@')) {
            const username = part.slice(1);
            return (
                <Link 
                    key={index} 
                    href={`/profile/${username}`}
                    className="text-primary-gold hover:underline font-bold"
                    onClick={(e) => e.stopPropagation()}
                >
                    {part}
                </Link>
            );
        }
        return part;
    });
}
