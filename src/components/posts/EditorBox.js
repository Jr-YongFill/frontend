import React, { useRef } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import { baseAPI } from '../../config';

function EditorBox() {
  const editorRef = useRef();

  const onChange = () => {
    const data = editorRef.current.getInstance().getHTML();
    console.log(data);
  };

  const onUploadImage = async (blob, callback) => {
    let formData = new FormData();
    formData.append("file", blob);

    try {
      const response = await baseAPI.post('/api/upload?mode=post', formData)
      
      const url = response.data;
      console.log(url);

      callback(url, 'alt text');
    } catch (error) {
      console.error("Image upload failed", error);
    }
  };

  return (
    <div className="edit_wrap">
      <Editor
        placeholder="내용을 적어주세요!"
        previewStyle="vertical"
        height="600px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        language="ko-KR"
        ref={editorRef}
        onChange={onChange}
        plugins={[colorSyntax]}
        hooks={{
          addImageBlobHook: onUploadImage
        }}
      />
    </div>
  );
}

export default EditorBox;
