"use client";
import { useEffect, useRef } from "react";
import hljs from "highlight.js/lib/common";

export function HighlightedNoteContent({html}:{html:string}){const ref=useRef<HTMLElement>(null);useEffect(()=>{ref.current?.querySelectorAll<HTMLElement>("pre code").forEach(block=>{delete block.dataset.highlighted;hljs.highlightElement(block);});},[html]);return <article ref={ref} className="prose noteProse" dangerouslySetInnerHTML={{__html:html}}/>;}
