import React, { useRef } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';


function EditorBox() {
  const editorRef = useRef();
  const onChange = () => {
    const data = editorRef.current.getInstance().getHTML();
  };



  const onUploadImage = async (blob, callback) => {
    let formData = new FormData();
    formData.append("file", blob);
    formData.append("fileGroup", "editor");

    const url = await axios.post(API_URL + 'file/upload', formData)
        .then((res)=>{
          console.log(res, "해치웠나?")
        })
        .catch(()=>{

        })
        .finally(()=>{

        })

    callback(url, 'alt text');
    return false;
  };



  
  return (
    <div className="edit_wrap">
      <Editor
        previewStyle="vertical"
        height="600px"
        initialEditType="wysiwyg"
        useCommandShortcut={false}
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