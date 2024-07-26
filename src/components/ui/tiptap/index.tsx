'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';
import { Toolbar } from '@/components/ui/tiptap/toolbar';
import styles from './Editor.module.css';

const Tiptap: React.FC<{
    initialValue: string;
    onChange: (html: string) => void;
}> = ({ initialValue, onChange }) => {
    const editor = useEditor({
        editorProps: {
            attributes: {
                // Add styles to editor element
                class: styles.editor
            }
        },
        extensions: [StarterKit],
        content: initialValue ? initialValue : '<p>Type message... 🌎️</p>',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        }
    });

    return (
        <div className={styles.container}>
            <div className={styles.editorHeader}>
                <Toolbar editor={editor} />
            </div>
            <EditorContent editor={editor} className={styles.editorContainer} />
        </div>
    );
};

export default Tiptap;
