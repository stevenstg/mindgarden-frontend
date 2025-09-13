// src/Sidebar.jsx
import React, { useState } from 'react';

export function Sidebar({ groupedDiaries, onDiarySelect, selectedDiaryId, onNewDiary }) {
  const [openMonths, setOpenMonths] = useState({});

  const toggleMonth = (month) => {
    setOpenMonths(prev => ({ ...prev, [month]: !prev[month] }));
  };

  // 默认展开最新月份
  React.useEffect(() => {
    if (Object.keys(groupedDiaries).length > 0) {
      const latestMonth = Object.keys(groupedDiaries).sort().reverse()[0];
      setOpenMonths({ [latestMonth]: true });
    }
  }, [groupedDiaries]);


  return (
    <aside className="sidebar">
      <h1>MindGarden 日记</h1>
      <button className="new-diary-btn" onClick={onNewDiary}>
        + 写新日记
      </button>

      {Object.keys(groupedDiaries).sort().reverse().map(month => (
        <div key={month} className="month-group">
          <h2 onClick={() => toggleMonth(month)}>
            {openMonths[month] ? '▼' : '►'} {month}
          </h2>
          {openMonths[month] && (
            <ul className="diary-link-list">
              {groupedDiaries[month].map(diary => (
                <li
                  key={diary.id}
                  className={`diary-link ${diary.id === selectedDiaryId ? 'selected' : ''}`}
                  onClick={() => onDiarySelect(diary.id)}
                >
                  {diary.date}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </aside>
  );
}