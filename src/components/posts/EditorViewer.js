import React from 'react';
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

function EditorViewer({ contents }) {
  return <Viewer initialValue={contents || ''} />;
}

export default EditorViewer;