import { createClient } from '@/utils/supabase/client';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function DropzoneUpload() {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const supabase = createClient();

    const onDrop = useCallback(
        async (acceptedFiles: any) => {
            setUploading(true);

            for (const file of acceptedFiles) {
                try {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Math.random()}.${fileExt}`;
                    const filePath = `uploads/${fileName}`;

                    let { data, error } = await supabase.storage
                        .from('post_images')
                        .upload(filePath, file);

                    if (error) {
                        throw error;
                    }

                    // Get public URL
                    const { data: publicUrlData } = supabase.storage
                        .from('post_images')
                        .getPublicUrl(filePath);

                    const newFile = {
                        name: file.name,
                        path: filePath,
                        url: publicUrlData.publicUrl,
                        size: file.size
                    } as any;

                    setUploadedFiles((prev: any) => [...prev, newFile] as any);
                } catch (error: any) {
                    console.error('Error uploading file:', error.message);
                }
            }

            setUploading(false);
        },
        [supabase.storage]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div>
            <div {...getRootProps()} style={dropzoneStyles}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : (
                    <p>Drag n drop some files here, or click to select files</p>
                )}
            </div>
            {uploading && <p>Uploading...</p>}
            <ul>
                {uploadedFiles.map((file: any, index) => (
                    <li key={index}>
                        {file.name} -{' '}
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                            View
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const dropzoneStyles = {
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer'
} as any;
