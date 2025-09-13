// src/DiaryViewer.jsx
import React from 'react';

function DiaryEditor({ onSave, initialContent = '' }) {
  const [content, setContent] = React.useState(initialContent);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(content);
    setContent('');
  };

  return (
    <div className="diary-editor">
      <h2>写下今天的记录与感想...</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="15"
          required
        ></textarea>
        <button type="submit">保存日记</button>
      </form>
    </div>
  );
}

export function DiaryViewer({ diary, onSaveDiary }) {
  if (!diary) {
    // 如果没有选中日记，就显示编辑器
    return <DiaryEditor onSave={onSaveDiary} />;
  }

  return (
    <div className="diary-viewer">
      <h2 className="date">{diary.date}</h2>
      <p className="content">{diary.content}</p>
      {/* 在这里可以添加 "AI分析" 按钮和显示分析结果的逻辑 */}
    </div>
  );
}