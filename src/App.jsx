// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = "http://127.0.0.1:8000"; // 你的后端地址

function App() {
  const [diaries, setDiaries] = useState([]);
  const [newDiaryContent, setNewDiaryContent] = useState("");

  // 获取所有日记
  useEffect(() => {
    fetch(`${API_URL}/api/diaries/`)
      .then(response => response.json())
      .then(data => setDiaries(data))
      .catch(error => console.error("Error fetching diaries:", error));
  }, []);

  // 提交新日记
  const handleSubmit = (e) => {
    e.preventDefault();
    const newDiary = {
      date: new Date().toISOString().split('T')[0], // 使用今天日期
      content: newDiaryContent,
    };

    fetch(`${API_URL}/api/diaries/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDiary),
    })
      .then(response => response.json())
      .then(data => {
        setDiaries([data, ...diaries]); // 将新日记添加到列表顶部
        setNewDiaryContent(""); // 清空输入框
      })
      .catch(error => console.error("Error creating diary:", error));
  };
  
  // (分析日记的函数可以类似地添加)

  return (
    <div className="App">
      <h1>MindGarden 日记</h1>
      
      <form onSubmit={handleSubmit} className="diary-form">
        <textarea
          value={newDiaryContent}
          onChange={(e) => setNewDiaryContent(e.target.value)}
          placeholder="写下今天的记录与感想..."
          rows="10"
          required
        ></textarea>
        <button type="submit">保存新日记</button>
      </form>

      <div className="diary-list">
        {diaries.map(diary => (
          <div key={diary.id} className="diary-entry">
            <h3>{diary.date}</h3>
            <p>{diary.content}</p>
            {/* 在这里可以添加一个按钮来触发AI分析 */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;