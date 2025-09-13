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

export function DiaryViewer({ diary, onSaveDiary, onAnalysisComplete }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysis = () => {
    if (!diary || !diary.id) return;
    
    setIsLoading(true);
    
    fetch(`${API_URL}/api/analysis/daily/${diary.id}`, {
      method: 'POST',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(updatedDiary => {
        // 通知App组件更新这篇日记的数据
        onAnalysisComplete(updatedDiary);
      })
      .catch(error => {
        console.error("Error fetching analysis:", error);
        alert("AI分析失败，请稍后再试。");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // 如果没有选中日记，就显示编辑器
  if (!diary) {
    return <DiaryEditor onSave={onSaveDiary} />;
  }

  // 如果选中了日记，就显示内容
  return (
    <div className="diary-viewer">
      <h2 className="date">{diary.date}</h2>
      <p className="content">{diary.content}</p>
      
      <hr style={{margin: '32px 0'}} />

      <div className="ai-analysis-section">
        <h3>AI 教练分析</h3>
        {diary.ai_score !== null ? (
          <div className="analysis-result">
            <p><strong>评分:</strong> {diary.ai_score} / 10</p>
            <p><strong>分析:</strong> {diary.ai_analysis}</p>
          </div>
        ) : (
          <button onClick={handleAnalysis} disabled={isLoading}>
            {isLoading ? '分析中...' : '获取AI评分与分析'}
          </button>
        )}
      </div>
    </div>
  );
}