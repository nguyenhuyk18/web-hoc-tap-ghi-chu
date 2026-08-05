"use client";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { Image as ImageExtension } from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { useRef, useState } from "react";

const lowlight = createLowlight(common);

function asHtml(value: string) { return /<\w+[\s>]/.test(value) ? value : value ? `<p>${value}</p>` : ""; }

export function CompactRichEditor({ value = "", onChange, placeholder, allowImages = false }: { value?: string; onChange: (html: string) => void; placeholder: string; allowImages?: boolean }) {
  const imageRef = useRef<HTMLInputElement>(null); const [uploadError, setUploadError] = useState("");
  async function upload(file: File) { const data=new FormData(); data.append("file",file); const response=await fetch("/api/upload",{method:"POST",body:data}); const result=await response.json(); if(!response.ok) throw new Error(result.error||"Không thể tải ảnh"); return result.url as string; }
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit.configure({ codeBlock:false }), CodeBlockLowlight.configure({ lowlight, defaultLanguage:"javascript" }), TextStyle, Color, Underline, Highlight.configure({ multicolor: true }), TextAlign.configure({ types: ["heading", "paragraph"] }), Link.configure({ openOnClick: false, autolink: true }), ImageExtension.configure({ allowBase64:false }), Placeholder.configure({ placeholder })],
    content: asHtml(value),
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
    editorProps: { handleDrop(view,event){ if(!allowImages) return false; const file=Array.from(event.dataTransfer?.files||[]).find(item=>item.type.startsWith("image/")); if(!file)return false; event.preventDefault(); void upload(file).then(url=>{const node=view.state.schema.nodes.image?.create({src:url});if(node)view.dispatch(view.state.tr.insert(view.state.selection.from,node));}).catch(reason=>setUploadError(reason instanceof Error?reason.message:"Không thể tải ảnh")); return true; }, handlePaste(view,event){ if(!allowImages)return false; const file=Array.from(event.clipboardData?.files||[]).find(item=>item.type.startsWith("image/"));if(!file)return false;event.preventDefault();void upload(file).then(url=>{const node=view.state.schema.nodes.image?.create({src:url});if(node)view.dispatch(view.state.tr.insert(view.state.selection.from,node));}).catch(reason=>setUploadError(reason instanceof Error?reason.message:"Không thể tải ảnh"));return true;} },
  });
  const setLink = () => { const url = window.prompt("Nhập đường dẫn liên kết:", editor?.getAttributes("link").href || "https://"); if (url === null) return; if (!url) editor?.chain().focus().unsetLink().run(); else editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run(); };
  return <div className="compactWordEditor">
    <div className="compactToolbar">
      <div><button type="button" title="Hoàn tác" onClick={() => editor?.chain().focus().undo().run()}>↶</button><button type="button" title="Làm lại" onClick={() => editor?.chain().focus().redo().run()}>↷</button></div>
      <div><button type="button" className={editor?.isActive("bold") ? "active" : ""} onClick={() => editor?.chain().focus().toggleBold().run()}><b>B</b></button><button type="button" className={editor?.isActive("italic") ? "active" : ""} onClick={() => editor?.chain().focus().toggleItalic().run()}><i>I</i></button><button type="button" className={editor?.isActive("underline") ? "active" : ""} onClick={() => editor?.chain().focus().toggleUnderline().run()}><u>U</u></button><button type="button" onClick={() => editor?.chain().focus().toggleStrike().run()}><s>S</s></button></div>
      <select aria-label="Kiểu văn bản" defaultValue="paragraph" onChange={(event) => { const level = event.target.value; if (level === "paragraph") editor?.chain().focus().setParagraph().run(); else editor?.chain().focus().toggleHeading({ level: Number(level) as 2|3 }).run(); }}><option value="paragraph">Văn bản thường</option><option value="2">Tiêu đề 2</option><option value="3">Tiêu đề 3</option></select>
      <div><button type="button" className={editor?.isActive("bulletList") ? "active" : ""} onClick={() => editor?.chain().focus().toggleBulletList().run()}>• List</button><button type="button" className={editor?.isActive("orderedList") ? "active" : ""} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>1. List</button><button type="button" onClick={() => editor?.chain().focus().setTextAlign("left").run()}>☰</button><button type="button" onClick={() => editor?.chain().focus().setTextAlign("center").run()}>≡</button><button type="button" onClick={() => editor?.chain().focus().setTextAlign("right").run()}>☷</button></div>
      <div><button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()}>❝</button><button type="button" title="Khối code" className={editor?.isActive("codeBlock")?"active":""} onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>&lt;/&gt;</button>{editor?.isActive("codeBlock")&&<select className="codeLanguageSelect" aria-label="Ngôn ngữ code" value={editor.getAttributes("codeBlock").language||"javascript"} onChange={event=>editor.chain().focus().updateAttributes("codeBlock",{language:event.target.value}).run()}><option value="javascript">JavaScript</option><option value="typescript">TypeScript</option><option value="php">PHP</option><option value="python">Python</option><option value="java">Java</option><option value="c">C</option><option value="cpp">C++</option><option value="csharp">C#</option><option value="css">CSS</option><option value="html">HTML</option><option value="sql">SQL</option><option value="bash">Bash</option><option value="json">JSON</option></select>}<button type="button" onClick={setLink}>🔗</button>{allowImages&&<><button type="button" title="Chèn hình ảnh" onClick={()=>imageRef.current?.click()}>▧</button><input ref={imageRef} hidden type="file" accept="image/*" onChange={async event=>{const file=event.target.files?.[0];if(!file)return;try{editor?.chain().focus().setImage({src:await upload(file)}).run();}catch(reason){setUploadError(reason instanceof Error?reason.message:"Không thể tải ảnh");}}}/></>}<label className="compactColor" title="Màu chữ">A<input type="color" defaultValue="#ffffff" onChange={(event) => editor?.chain().focus().setColor(event.target.value).run()} /></label><label className="compactHighlight" title="Tô sáng">▰<input type="color" defaultValue="#facc15" onChange={(event) => editor?.chain().focus().toggleHighlight({ color: event.target.value }).run()} /></label></div>
    </div>
    <EditorContent editor={editor} />
    {uploadError&&<p className="formError">{uploadError}</p>}
  </div>;
}
