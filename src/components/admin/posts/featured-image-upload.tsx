'use client';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
    FileUploader,
    FileInput,
    FileUploaderContent,
    FileUploaderItem
} from '@/components/ui/extensions/file-upload';
import Image from 'next/image';
import React from 'react';
import { DropzoneOptions } from 'react-dropzone';

const FileSvgDraw = () => {
    return (
        <>
            <svg
                className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
            >
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
            </svg>
            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span>
                &nbsp; or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">WEBP, PNG, JPG or JPEG</p>
        </>
    );
};

interface FeaturedImageUploadProps {
    value: File[] | null;
    onValueChange: (value: File[] | null) => void;
}

const FeaturedImageUpload = ({ value, onValueChange }: FeaturedImageUploadProps) => {
    const dropzone = {
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png']
        },
        multiple: false,
        maxFiles: 1,
        maxSize: 4 * 1024 * 1024
    } satisfies DropzoneOptions;

    return (
        <FileUploader
            value={value}
            onValueChange={onValueChange}
            dropzoneOptions={dropzone}
            reSelect={true}
            className="relative bg-background rounded-lg p-2"
        >
            <FileInput className="outline-dashed outline-1 outline-foreground">
                <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                    <FileSvgDraw />
                </div>
            </FileInput>
            <FileUploaderContent className="flex items-center flex-row gap-2">
                {value &&
                    value.length > 0 &&
                    value?.map((file, i) => (
                        <FileUploaderItem
                            key={i}
                            index={i}
                            className="size-20 p-0 rounded-md overflow-hidden" // size-20
                            aria-roledescription={`file ${i + 1} containing ${file.name}`}
                        >
                            <AspectRatio className="size-full">
                                <Image
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="aspect-square shrink-0 object-cover rounded-md"
                                    fill
                                    loading="lazy"
                                />
                            </AspectRatio>
                        </FileUploaderItem>
                    ))}
            </FileUploaderContent>
        </FileUploader>
    );
};

export default FeaturedImageUpload;
