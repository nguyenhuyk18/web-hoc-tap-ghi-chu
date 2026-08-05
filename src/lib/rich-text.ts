export function richTextToPlainText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

export function isRichTextEmpty(html: unknown) {
  return typeof html !== "string" || !richTextToPlainText(html);
}
