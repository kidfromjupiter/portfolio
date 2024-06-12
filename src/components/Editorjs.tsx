import React, { memo, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Link from "@editorjs/link";
import Delimiter from "@editorjs/delimiter";
import CheckList from "@editorjs/checklist";
import ImageTool from '@editorjs/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL
export const EDITOR_JS_TOOLS = {
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  checkList: CheckList,
  list: List,
  header: Header, delimiter: Delimiter,
  link: Link,
  image: {
            class: ImageTool,
            config: {
              endpoints: {
                  byFile: `${API_URL}upload-image`, // Your FastAPI endpoint
              },
              field: 'file', // the FormData key for the image file
              types: 'image/*' // the accepted file types
            }
          }
}
// @ts-ignore
const Editor = ({ data, onChange, editorblock,readOnly = false }) => {

  const ref = useRef<EditorJS>();
  useEffect(() => {
    //Initialize editorjs if we don't have a reference
    if (!ref.current) {
      const editor = new EditorJS({
        holder: editorblock,
        readOnly:readOnly,
        tools: EDITOR_JS_TOOLS,
        data: data,
        async onChange(api ) {
          if (!readOnly) {
            const data = await api.saver.save();
            onChange(data);
          }
        },
      });
      ref.current = editor;
    }

    //Add a return function to handle cleanup
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);
  return <> <article className="prose prose-zinc dark:prose-invert max-w-full"><div id={editorblock} className="w-full" /></article><style>{`.codex-editor__redactor { padding-bottom:100px!important;}`}</style></>;
};

export default memo(Editor);
