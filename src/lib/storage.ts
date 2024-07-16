import { createClient } from '@/utils/supabase/client';

export async function uploadImage(file: any) {
    const supabase = createClient();

    const { data, error } = await supabase.storage
        .from('post_images')
        .upload('path/to/your/image.jpg', file);

    if (error) {
        console.error('Error uploading image:', error);
    } else {
        // const imageUrl = data.publicUrl;
        // console.log('Image uploaded successfully!', imageUrl);
        // Use the imageUrl to set the image on Next.js component
        // setImageUrl(imageUrl); // Assuming you have a state variable for imageUrl
    }
}
