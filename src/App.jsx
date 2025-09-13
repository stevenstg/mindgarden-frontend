// src/App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './Sidebar';
import { DiaryViewer } from './DiaryViewer';
import { API_URL } from './config.js'; // <--- 添加这一行
import './App.css';

function extractDayNumberFromString(dateString) {
  const match = dateString.match(/Day(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}


function App() {
  const [allDiaries, setAllDiaries] = useState([]);
  const [selectedDiaryId, setSelectedDiaryId] = useState(null);

  // 1. 获取所有日记
  useEffect(() => {
    fetch(`${API_URL}/api/diaries/`)
      .then(response => response.json())
      .then(data => {
        // vvvv 新的、更强大的排序逻辑 vvvv
        const sortedData = data.sort((a, b) => {
          // 首先按年月降序排 (e.g., 2025-09 在 2025-08 前面)
          const monthA = a.date.substring(0, 7);
          const monthB = b.date.substring(0, 7);
          if (monthA > monthB) return -1;
          if (monthA < monthB) return 1;

          // 如果月份相同，则按Day后面的数字升序排
          const dayA = extractDayNumberFromString(a.date);
          const dayB = extractDayNumberFromString(b.date);
          return dayA - dayB;
        });
        // ^^^^ 新排序逻辑结束 ^^^^
        
        setAllDiaries(sortedData);
        if (sortedData.length > 0) {
          setSelectedDiaryId(sortedData[0].id);
        }
      })
      .catch(error => console.error("Error fetching diaries:", error));
  }, []);

  // 2. 将日记按月份分组 (例如: '2025-09')
  const groupedDiaries = useMemo(() => {
    return allDiaries.reduce((acc, diary) => {
      const month = diary.date.substring(0, 7); // 提取 YYYY-MM
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(diary);
      return acc;
    }, {});
  }, [allDiaries]);

  // 3. 提交新日记
  const handleSaveDiary = (content) => {
    const newDiary = {
      date: new Date().toISOString().split('T')[0],
      content: content,
    };

    fetch(`${API_URL}/api/diaries/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDiary),
    })
      .then(response => response.json())
      .then(newEntry => {
        // 重新获取列表以保证排序和分组正确
        const updatedDiaries = [...allDiaries, newEntry].sort((a, b) => {
            const monthA = a.date.substring(0, 7);
            const monthB = b.date.substring(0, 7);
            if (monthA > monthB) return -1;
            if (monthA < monthB) return 1;
            const dayA = extractDayNumberFromString(a.date);
            const dayB = extractDayNumberFromString(b.date);
            return dayA - dayB;
        });
        setAllDiaries(updatedDiaries);
        setSelectedDiaryId(newEntry.id); // 选中刚刚创建的日记
      })
      .catch(error => console.error("Error creating diary:", error));
  };

  const handleAnalysisUpdate = (updatedDiary) => {
    setAllDiaries(prevDiaries => 
      prevDiaries.map(d => d.id === updatedDiary.id ? updatedDiary : d)
    );
  };

  const selectedDiary = allDiaries.find(d => d.id === selectedDiaryId);

  return (
    <div className="mind-garden-app">
      <Sidebar
        groupedDiaries={groupedDiaries}
        selectedDiaryId={selectedDiaryId}
        onDiarySelect={setSelectedDiaryId}
        onNewDiary={() => setSelectedDiaryId(null)} // 点击"写新日记"按钮，取消选中
      />
      <main className="main-content">
        <DiaryViewer 
          diary={selectedDiary} 
          onSaveDiary={handleSaveDiary} 
          onAnalysisComplete={handleAnalysisUpdate} 
        />
      </main>
    </div>
  );
}

export default App;