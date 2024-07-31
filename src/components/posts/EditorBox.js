import React, { forwardRef } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

const EditorBox = forwardRef((props, ref) => {
  const onChange = () => {
    const data = ref.current.getInstance().getHTML();
    props.onChange(data); // 부모 컴포넌트의 onChange 호출
  };

  const onUploadImage = async (blob, callback) => {
    let formData = new FormData();
    formData.append("file", blob);

    const url = await props.onUploadImage(blob, callback);
    callback(url, 'alt text');
    return false;
  };

  return (
    <div className="edit_wrap">
      <Editor
        initialValue={props.initialValue ?? ''}
        placeholder="내용을 적어주세요!"
        previewStyle="vertical"
        height="600px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        language="ko-KR"
        ref={ref}
        onChange={onChange}
        plugins={[colorSyntax]}
        hooks={{
          addImageBlobHook: onUploadImage
        }}
      />
    </div>
  );
});

export default EditorBox;