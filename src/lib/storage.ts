import { createClient } from '@/utils/supabase/client';
import { getRandomInt } from '@/utils/helpers';

export async function uploadImage(file: File, filePath: string) {
    const supabase = createClient();

    // const file = files[0];
    // const fileExt = file.name.split('.').pop();
    // const filePath = `${crypto.randomUUID()}-${getRandomInt(1, 1000)}.${fileExt}`;

    const { data, error } = await supabase.storage.from('post_images').upload(filePath, file);
    console.log(data);

    if (error) {
        console.error('Error uploading image:', error);
    } else {
        const imageUrl = data?.fullPath;
        console.log('Image uploaded successfully!', imageUrl);
    }
}
