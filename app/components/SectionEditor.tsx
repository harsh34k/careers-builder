"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Bold, Italic, Underline as UnderlineIcon } from "lucide-react";

export default function SectionEditor({ value, onChange }: any) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML()); // store HTML in DB
        },
    });

    if (!editor) return null;

    return (
        <div className="border border-gray-200 rounded-md ">
            {/* Toolbar */}
            <div className="flex gap-2 border-b p-2 bg-gray-50 rounded-t-md">

                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1 rounded hover:bg-gray-200 ${editor.isActive("bold") && "bg-gray-300"}`}
                >
                    <Bold size={16} />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1 rounded hover:bg-gray-200 ${editor.isActive("italic") && "bg-gray-300"}`}
                >
                    <Italic size={16} />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-1 rounded hover:bg-gray-200 ${editor.isActive("underline") && "bg-gray-300"}`}
                >
                    <UnderlineIcon size={16} />
                </button>

            </div>

            {/* Editable Content */}
            <EditorContent editor={editor} className="p-2 min-h-[100px]" />
        </div>
    );
}
