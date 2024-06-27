import { getPageBySlug } from '@/lib/blog';
import { Section, Container, Main } from '@/components/craft';
import { Metadata } from 'next';

import BackButton from '@/components/back';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const page = await getPageBySlug(params.slug);
    return {
        title: page.title,
        description: page.excerpt
    };
}

export default async function Page({ params }: { params: { slug: string } }) {
    const page = await getPageBySlug(params.slug);

    return (
        <Section>
            <Container>
                <BackButton />
                <h1 className="pt-12">{page.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: page.content }} />
            </Container>
        </Section>
    );
}
