import { type ClassValue, clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const copyText = (text: string) => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        const input = document.createElement('textarea');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
    }
};

export function humanizeTimeSince(timestamp: string) {
    const now = new Date();
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}

export function getUsernameFromEmail(email: string) {
    const match = email.match(/^(.+?)@/);
    return match ? match[1] : '';
}

export function getFirstTwoLetters(word: string) {
    return word.substring(0, 2);
}
