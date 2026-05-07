'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import CharacterCount from '@tiptap/extension-character-count'
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, Undo, Redo } from 'lucide-react'
import { useCallback } from 'react'

interface EditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichEditor({ content, onChange, placeholder }: EditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CharacterCount,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-navy underline' } }),
      Placeholder.configure({ placeholder: placeholder || 'Mulai menulis artikel kamu di sini...' }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { class: 'ProseMirror' } },
  })

  const addImage = useCallback(() => {
    const url = window.prompt('Masukkan URL gambar:')
    if (url && editor) editor.chain().focus().setImage({ src: url }).run()
  }, [editor])

  const addLink = useCallback(() => {
    const url = window.prompt('Masukkan URL:')
    if (url && editor) editor.chain().focus().setLink({ href: url }).run()
  }, [editor])

  if (!editor) return <div className="skeleton h-64" />

  const ToolBtn = ({ onClick, active, title, children }: any) => (
    <button type="button" onClick={onClick} title={title}
      className="p-2 rounded-lg transition-all text-sm"
      style={{ background: active ? '#EFF4FF' : 'transparent', color: active ? '#1B3A6B' : '#6C757D' }}>
      {children}
    </button>
  )

  const Divider = () => <div className="w-px h-5 self-center" style={{ background: '#E9ECEF' }} />

  return (
    <div className="border rounded-xl overflow-hidden" style={{ borderColor: '#E9ECEF' }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b" style={{ background: '#F8F9FA', borderColor: '#E9ECEF' }}>
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo size={15} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo size={15} /></ToolBtn>
        <Divider />
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 size={15} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3"><Heading3 size={15} /></ToolBtn>
        <Divider />
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><Bold size={15} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><Italic size={15} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><UnderlineIcon size={15} /></ToolBtn>
        <Divider />
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Kiri"><AlignLeft size={15} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Tengah"><AlignCenter size={15} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Kanan"><AlignRight size={15} /></ToolBtn>
        <Divider />
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List"><List size={15} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List"><ListOrdered size={15} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Kutipan"><Quote size={15} /></ToolBtn>
        <Divider />
        <ToolBtn onClick={addLink} active={editor.isActive('link')} title="Tambah Link"><LinkIcon size={15} /></ToolBtn>
        <ToolBtn onClick={addImage} title="Tambah Gambar"><ImageIcon size={15} /></ToolBtn>
      </div>

      {/* Editor area */}
      <div className="p-5 bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Word count */}
      <div className="px-5 py-2 border-t flex items-center justify-between" style={{ background: '#F8F9FA', borderColor: '#E9ECEF' }}>
        <span className="text-xs" style={{ color: '#ADB5BD' }}>
          {editor.storage.characterCount.words()} kata · {editor.storage.characterCount.characters()} karakter
        </span>
        <span className="text-xs" style={{ color: '#ADB5BD' }}>
          ~{Math.ceil(editor.storage.characterCount.words() / 200)} menit baca
        </span>
      </div>
    </div>
  )
}
