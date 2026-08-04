"use client";
import { Image as ImageExtension } from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { Extension } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ArticleValue = { _id?: string; title?: string; slug?: string; summary?: string; content?: string; coverImage?: string; type?: string; category?: string; level?: string; published?: boolean };

const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [{
      types: ["textStyle"],
      attributes: {
        fontSize: {
          default: null,
          parseHTML: (element) => element.style.fontSize || null,
          renderHTML: (attributes) => attributes.fontSize ? { style: `font-size: ${attributes.fontSize}` } : {},
        },
      },
    }];
  },
});

export function ArticleEditor({ article = {}, specialties }: { article?: ArticleValue; specialties: string[] }) {
  const router = useRouter(); const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(""); const [saving, setSaving] = useState(false); const [coverImage, setCoverImage] = useState(article.coverImage || "");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextStyle,
      FontSize,
      FontFamily,
      Color,
      Underline,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      ImageExtension.configure({ allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: "Nhập nội dung bài viết tại đây..." }),
    ],
    content: article.content || "<h1>Tiêu đề bài viết</h1><p>Bắt đầu soạn nội dung của bạn...</p>",
    editorProps: {
      handleDrop(view, event) {
        const file = Array.from(event.dataTransfer?.files || []).find((item) => item.type.startsWith("image/"));
        if (!file) return false;
        event.preventDefault();
        const position = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos ?? view.state.selection.from;
        void upload(file)
          .then((url) => {
            const imageNode = view.state.schema.nodes.image?.create({ src: url });
            if (imageNode) view.dispatch(view.state.tr.insert(position, imageNode));
          })
          .catch((reason) => setError(reason instanceof Error ? reason.message : "Không thể tải ảnh"));
        return true;
      },
      handlePaste(view, event) {
        const file = Array.from(event.clipboardData?.files || []).find((item) => item.type.startsWith("image/"));
        if (!file) return false;
        event.preventDefault();
        const position = view.state.selection.from;
        void upload(file)
          .then((url) => {
            const imageNode = view.state.schema.nodes.image?.create({ src: url });
            if (imageNode) view.dispatch(view.state.tr.insert(position, imageNode));
          })
          .catch((reason) => setError(reason instanceof Error ? reason.message : "Không thể tải ảnh"));
        return true;
      },
    },
  });

  async function upload(file: File) {
    const form = new FormData(); form.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: form }); const result = await response.json();
    if (!response.ok) throw new Error(result.error); return result.url as string;
  }
  async function insertImage(file?: File) {
    try { const selected = file || fileRef.current?.files?.[0]; if (!selected) return; editor?.chain().focus().setImage({ src: await upload(selected) }).run(); }
    catch (e) { setError(e instanceof Error ? e.message : "Không thể tải ảnh"); }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(""); const data = Object.fromEntries(new FormData(event.currentTarget));
    const body = { ...data, content: editor?.getHTML(), coverImage, published: data.published === "on" };
    const response = await fetch(article._id ? `/api/articles/${article._id}` : "/api/articles", { method: article._id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json(); setSaving(false); if (!response.ok) return setError(result.error);
    router.replace("/admin/articles");
  }
  const setLink = () => { const url = window.prompt("Nhập đường dẫn liên kết:", editor?.getAttributes("link").href || "https://"); if (url === null) return; if (!url) editor?.chain().focus().unsetLink().run(); else editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run(); };
  const setFontSize = (size: string) => editor?.chain().focus().setMark("textStyle", { fontSize: size }).run();
  return <form className="editorForm" onSubmit={submit}>
    <div className="editorFields">
      <label>Tiêu đề *<input name="title" defaultValue={article.title} required placeholder="Ví dụ: Mô hình OSI là gì?" /></label>
      <label>Đường dẫn (để trống sẽ tự tạo)<input name="slug" defaultValue={article.slug} placeholder="mo-hinh-osi-la-gi" /></label>
      <label className="full">Mô tả ngắn *<textarea name="summary" defaultValue={article.summary} required rows={3} /></label>
      <label>Chuyên ngành *<select name="type" defaultValue={article.type || specialties[0]} required>{specialties.map((name) => <option key={name}>{name}</option>)}</select></label>
      <label>Chủ đề<select name="category" defaultValue={article.category || "Cơ bản"}><option>Cơ bản</option><option>Giao thức</option><option>Bảo mật</option><option>Thực hành</option></select></label>
      <label>Cấp độ<select name="level" defaultValue={article.level || "Nhập môn"}><option>Nhập môn</option><option>Trung cấp</option><option>Nâng cao</option></select></label>
      <label className="full">Ảnh bìa<input type="file" accept="image/*" onChange={async (e) => { const file=e.target.files?.[0]; if(file) setCoverImage(await upload(file)); }} />{coverImage && <span className="uploadDone">✓ Đã tải ảnh bìa</span>}</label>
    </div>
    <div className="wordEditor">
      <div className="wordTitlebar"><div><span>W</span><b>Trình soạn thảo bài viết</b></div><small>Đã lưu tự động trên trình duyệt</small></div>
      <div className="wordTabs"><b>Trang đầu</b><span>Chèn</span><span>Định dạng</span><span>Xem</span></div>
      <div className="wordRibbon">
        <div className="ribbonGroup historyGroup">
          <div className="ribbonButtons"><button type="button" title="Hoàn tác" onClick={() => editor?.chain().focus().undo().run()}>↶</button><button type="button" title="Làm lại" onClick={() => editor?.chain().focus().redo().run()}>↷</button></div><small>Thao tác</small>
        </div>
        <div className="ribbonGroup fontGroup">
          <div className="fontSelectors"><select title="Phông chữ" defaultValue="Arial" onChange={(e) => editor?.chain().focus().setFontFamily(e.target.value).run()}><option value="Arial">Arial</option><option value="Georgia">Georgia</option><option value="'Times New Roman'">Times New Roman</option><option value="Verdana">Verdana</option><option value="'Courier New'">Courier New</option></select><select title="Cỡ chữ" defaultValue="16px" onChange={(e) => setFontSize(e.target.value)}><option value="12px">12</option><option value="14px">14</option><option value="16px">16</option><option value="18px">18</option><option value="20px">20</option><option value="24px">24</option><option value="32px">32</option><option value="40px">40</option></select></div>
          <div className="ribbonButtons"><button type="button" title="In đậm" className={editor?.isActive("bold") ? "active" : ""} onClick={() => editor?.chain().focus().toggleBold().run()}><b>B</b></button><button type="button" title="In nghiêng" className={editor?.isActive("italic") ? "active" : ""} onClick={() => editor?.chain().focus().toggleItalic().run()}><i>I</i></button><button type="button" title="Gạch chân" className={editor?.isActive("underline") ? "active" : ""} onClick={() => editor?.chain().focus().toggleUnderline().run()}><u>U</u></button><button type="button" title="Gạch ngang" onClick={() => editor?.chain().focus().toggleStrike().run()}><s>S</s></button><div className="textColorPalette" title="Màu chữ">{[["#ffffff","Trắng"],["#facc15","Vàng"],["#ff3b30","Đỏ"],["#ff7a00","Cam"],["#22c55e","Xanh lá"],["#38bdf8","Xanh dương"],["#c084fc","Tím"]].map(([color,name]) => <button type="button" key={color} title={name} aria-label={`Màu ${name}`} style={{ backgroundColor: color }} onClick={() => editor?.chain().focus().setColor(color).run()} />)}<label className="customColor" title="Màu khác">+<input type="color" defaultValue="#ffffff" onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()} /></label></div><label className="highlightTool" title="Màu tô sáng">🖍<input type="color" defaultValue="#facc15" onChange={(e) => editor?.chain().focus().toggleHighlight({ color: e.target.value }).run()} /></label></div><small>Phông chữ</small>
        </div>
        <div className="ribbonGroup paragraphGroup">
          <div className="ribbonButtons"><button type="button" title="Danh sách dấu đầu dòng" className={editor?.isActive("bulletList") ? "active" : ""} onClick={() => editor?.chain().focus().setParagraph().toggleBulletList().run()}>• Danh sách</button><button type="button" title="Danh sách đánh số" className={editor?.isActive("orderedList") ? "active" : ""} onClick={() => editor?.chain().focus().setParagraph().toggleOrderedList().run()}>1. Danh sách</button><button type="button" title="Căn trái" onClick={() => editor?.chain().focus().setTextAlign("left").run()}>☰</button><button type="button" title="Căn giữa" onClick={() => editor?.chain().focus().setTextAlign("center").run()}>≡</button><button type="button" title="Căn phải" onClick={() => editor?.chain().focus().setTextAlign("right").run()}>☷</button><button type="button" title="Căn đều" onClick={() => editor?.chain().focus().setTextAlign("justify").run()}>▤</button></div><small>Đoạn văn</small>
        </div>
        <div className="ribbonGroup styleGroup">
          <select title="Kiểu văn bản" defaultValue="paragraph" onChange={(e) => { const value=e.target.value; if(value==="paragraph") editor?.chain().focus().setParagraph().run(); else editor?.chain().focus().toggleHeading({ level: Number(value) as 1|2|3 }).run(); }}><option value="paragraph">Văn bản thường</option><option value="1">Tiêu đề 1</option><option value="2">Tiêu đề 2</option><option value="3">Tiêu đề 3</option></select><div className="ribbonButtons"><button type="button" title="Trích dẫn" onClick={() => editor?.chain().focus().toggleBlockquote().run()}>❝</button><button type="button" title="Đường kẻ ngang" onClick={() => editor?.chain().focus().setHorizontalRule().run()}>―</button></div><small>Kiểu</small>
        </div>
        <div className="ribbonGroup insertGroup">
          <div className="insertButtons"><button type="button" onClick={setLink}><span>🔗</span>Liên kết</button><button type="button" onClick={() => fileRef.current?.click()}><span>▧</span>Hình ảnh</button></div><small>Chèn</small>
        </div>
        <input ref={fileRef} hidden type="file" accept="image/*" onChange={(e) => insertImage(e.target.files?.[0])} />
      </div>
      <div className="wordRuler"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span><span>13</span><span>14</span><span>15</span><span>16</span><span>17</span></div>
      <div className="documentWorkspace"><EditorContent editor={editor} /></div>
      <div className="wordStatusbar"><span>Trang 1 / 1</span><span>Tiếng Việt</span><span className="statusSpacer" /><span>100%</span><input aria-label="Thu phóng" type="range" min="70" max="130" defaultValue="100" /></div>
    </div>
    <label className="publishCheck"><input type="checkbox" name="published" defaultChecked={article.published} /> Xuất bản để mọi người có thể xem</label>
    {error && <p className="formError">{error}</p>}
    <div className="formActions"><button type="button" onClick={() => router.back()}>Hủy</button><button className="primary" disabled={saving}>{article._id ? "Lưu thay đổi" : "Tạo bài viết"}</button></div>
  </form>;
}
