// src/DiaryViewer.jsx
import React, { useState, useEffect } from 'react';
import { API_URL } from './config.js';

// 编辑器组件保持不变
function DiaryEditor({ onSave, initialContent = '' }) { /* ... 和之前一样 ... */ }

// Viewer主组件
export function DiaryViewer({ diary, onSaveDiary }) { // 移除了 onAnalysisComplete prop
  const [isLoading, setIsLoading] = useState(false);
  // vvvv 添加一个新state，用于存放临时的分析结果 vvvv
  const [tempAnalysis, setTempAnalysis] = useState(null);
  // ^^^^ 添加新state ^^^^
  
  // 当切换日记时，清空上一次的临时分析结果
  useEffect(() => {
    setTempAnalysis(null);
  }, [diary]);


  const handleAnalysis = () => {
    if (!diary || !diary.id) return;
    
    setIsLoading(true);
    setTempAnalysis(null);
    
    fetch(`${API_URL}/api/analysis/daily/${diary.id}`, {
      method: 'POST',
    })
      .then(response => response.json())
      .then(analysisData => {
        // vvvv 将返回的临时结果存入新state vvvv
        setTempAnalysis(analysisData);
        // ^^^^ 不再调用全局更新，只更新局部 ^^^^
      })
      .catch(error => {
        console.error("Error fetching analysis:", error);
        alert("AI分析失败，请稍后再试。");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (!diary) {
    return <DiaryEditor onSave={onSaveDiary} />;
  }

  // 决定显示哪个分析结果
  const displayData = tempAnalysis || diary;

  return (
    <div className="diary-viewer">
      <h2 className="date">{diary.date}</h2>
      <p className="content">{diary.content}</p>
      
      <hr style={{margin: '32px 0'}} />

      <div className="ai-analysis-section">
        <h3>AI 教练分析</h3>
        {/* 如果displayData里有分析，就显示它 */}
        {displayData.ai_score !== null && displayData.ai_analysis ? (
          <div className="analysis-result">
            <p><strong>评分:</strong> {displayData.ai_score || displayData.score} / 10</p>
            <p><strong>分析:</strong> {displayData.ai_analysis || displayData.analysis}</p>
          </div>
        ) : (
          <button onClick={handleAnalysis} disabled={isLoading}>
            {isLoading ? '分析中...' : '获取AI评分与分析 (不保存)'}
          </button>
        )}
      </div>
    </div>
  );
}