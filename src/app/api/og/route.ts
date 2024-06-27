import { ImageResponse } from 'next/og';
import Logo from '../../../../../public/app-logo.png';
import homepageImage from '../../../../../public/quillert-homepage.png';
import { RenderIMGEl } from '@/components/OGImgEl';
import { getURL } from '@/utils/helpers';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        return new ImageResponse(
            RenderIMGEl({
                logo: getURL() + Logo.src,
                locale: 'en',
                image: getURL() + homepageImage.src
            }),
            {
                width: 1200,
                height: 630
            }
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500
        });
    }
}
