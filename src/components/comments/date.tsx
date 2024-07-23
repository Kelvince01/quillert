import { isValid, parseISO, format } from 'date-fns';
import React from 'react';

interface DateProps {
    dateString: string;
}

export default function Date({ dateString }: DateProps): React.JSX.Element {
    if (!isValid(parseISO(dateString))) {
        return <>No date</>;
    }
    const date = parseISO(dateString);
    return <time dateTime={dateString}>{format(date, 'LLLL	d, yyyy')}</time>;
}
