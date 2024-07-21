'use client';

import React from 'react';
import { EmailShare, FacebookShare, TwitterShare, WhatsappShare } from 'react-share-kit';
import { Tag } from '@/lib/blog.d';
import { usePathname } from 'next/navigation';
import { getURL } from '@/utils/helpers';

export const ShareButtons: React.FC<{ shareUrlSource: string; title: string; tags: Tag[] }> = ({
    shareUrlSource,
    title,
    tags
}) => {
    const shareUrl = getURL() + usePathname();

    return (
        <div className="space-y-4 flex flex-row items-center">
            <div className="text-center mr-4">Share: </div>
            <div>
                <FacebookShare
                    url={shareUrl}
                    quote={title}
                    size={30}
                    className="mr-4"
                    round={true}
                />
                <TwitterShare
                    url={shareUrl}
                    title={title}
                    hashtags={[`${tags[0].slug}`]}
                    size={30}
                    className="mr-4"
                    round={true}
                />
                <WhatsappShare
                    url={shareUrl}
                    title={title}
                    separator=":: "
                    size={30}
                    className="mr-4"
                    round={true}
                />
                <EmailShare url={shareUrl} subject={title} body="body" size={30} round={true} />
            </div>
        </div>
    );
};
