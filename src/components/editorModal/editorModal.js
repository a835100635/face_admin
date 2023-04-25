import { Modal } from 'antd';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import React, { useState, useEffect } from 'react';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css

function EditorModal(props) {
  const { visible, title, content, onHandleOk, onHandleCancel, editType } = props;

  const [editor, setEditor] = useState(null);
  const [html, setHtml] = useState(content);
  const toolbarConfig = {};
  const editorConfig = {
    // JS 语法
    placeholder: '请输入内容...'
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if ([null, '', undefined].includes(editor)) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  // 监听 content 变化
  useEffect(() => {
    if (visible) {
      setHtml(content);
    }
  }, [content, visible]);

  const onOk = () => {
    onHandleOk &&
      onHandleOk({
        editType,
        content: html
      });
    setHtml('');
  };
  const onCancel = () => {
    onHandleCancel && onHandleCancel();
    setHtml('');
  };

  return (
    <Modal title={title} open={visible} width={800} onOk={() => onOk()} onCancel={() => onCancel()}>
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => setHtml(editor.getHtml())}
          mode="default"
          style={{ height: '500px', overflowY: 'hidden' }}
        />
      </div>
    </Modal>
  );
}

export default EditorModal;
