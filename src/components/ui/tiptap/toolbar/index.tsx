import { Editor } from '@tiptap/react';
import styles from './Toolbar.module.css';
import { Bold, Code, Italic, List, Strikethrough } from 'lucide-react';

type Props = {
    editor: Editor | null;
};

export function Toolbar({ editor }: Props) {
    if (!editor) {
        return null;
    }

    return (
        <div className={styles.toolbar}>
            <button
                className={styles.button}
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                data-active={editor.isActive('bold') ? 'is-active' : undefined}
                aria-label="bold"
            >
                <Bold className="h-4 w-4" />
            </button>
            <button
                className={styles.button}
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                data-active={editor.isActive('italic') ? 'is-active' : undefined}
                aria-label="italic"
            >
                <Italic className="h-4 w-4" />
            </button>
            <button
                className={styles.button}
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                data-active={editor.isActive('strike') ? 'is-active' : undefined}
                aria-label="strikethrough"
            >
                <Strikethrough className="h-4 w-4" />
            </button>
            <button
                className={styles.button}
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                disabled={!editor.can().chain().focus().toggleBulletList().run()}
                data-active={editor.isActive('bulletList') ? 'is-active' : ''}
                aria-label="bulletlist"
            >
                <List className="h-4 w-4" />
            </button>
            <button
                className={styles.button}
                type="button"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
                data-active={editor.isActive('codeBlock') ? 'is-active' : ''}
                aria-label="codeblock"
            >
                <Code className="h-4 w-4" />
            </button>
        </div>
    );
}
