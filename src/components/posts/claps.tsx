'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import { PiHandsClapping } from 'react-icons/pi';
import { useDebounceValue } from 'usehooks-ts';
import { Post } from '@/lib/blog.d';
import { createClient } from '@/utils/supabase/client';

export default function Claps({ id, claps: postClaps }: Post) {
    const [claps, setClaps] = useState(postClaps || 0);
    const [cacheCount, setCacheCount] = useState(0);
    const [debouncedCacheCount] = useDebounceValue(cacheCount, 1000);
    const supabase = createClient();

    useEffect(() => {
        if (debouncedCacheCount > 0) {
            const saveClaps = async () => {
                try {
                    const { data, error } = await supabase
                        .from('posts')
                        .update({ claps: debouncedCacheCount })
                        .eq('id', id);

                    if (error) throw error;

                    setCacheCount(0);
                } catch (error) {
                    console.error('Failed to save claps:', error);
                }
            };

            saveClaps();
        }
    }, [debouncedCacheCount]);

    const handleClap = useCallback(() => {
        setClaps((claps: number) => claps + 1);
        setCacheCount((cacheCount) => cacheCount + 1);
    }, []);

    return (
        <Fragment>
            <div className="block h-3 border-e border-gray-300 dark:border-neutral-500 mx-3"></div>
            <div className="hs-tooltip inline-block select-none">
                <button
                    onClick={handleClap}
                    type="button"
                    className="hs-tooltip-toggle flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-800 dark:text-neutral-200 dark:hover:text-gray-300"
                >
                    <PiHandsClapping className="flex-shrink-0 size-4" />
                    {claps} claps
                </button>
            </div>
        </Fragment>
    );
}
