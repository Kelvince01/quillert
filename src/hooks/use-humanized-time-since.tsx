import { useState, useCallback, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

export const useHumanizedTimeSince = (timestamp: string) => {
    const [humanizedTime, setHumanizedTime] = useState('');

    const updateHumanizedTime = useCallback(() => {
        setHumanizedTime(formatDistanceToNow(new Date(timestamp)));
    }, [timestamp]);

    useEffect(() => {
        updateHumanizedTime();
        const intervalId = setInterval(updateHumanizedTime, 60000); // Update every minute

        return () => clearInterval(intervalId);
    }, [updateHumanizedTime]);

    return humanizedTime;
};
