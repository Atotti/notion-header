import { CalendarDay } from './dateUtils';

/**
 * 日付、時間、カレンダーを表示するモダンなSVGを生成する
 * レスポンシブデザインで中央配置
 * @param date 日付文字列
 * @param time 時間文字列
 * @param calendarData カレンダーデータ
 * @returns 完全なSVG文字列
 */
export function generateHeaderSVG(date: string, time: string, calendarData: CalendarDay[]): string {
  const dayWidth = 60;
  const svgWidth = 1000;
  const svgHeight = 200;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f8f9fa" />
          <stop offset="100%" stop-color="#e9ecef" />
        </linearGradient>
      </defs>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&amp;display=swap');
        text {
          font-family: 'Noto Sans JP', sans-serif;
        }
        .date-text {
          font-size: 24px;
          fill: #212529;
          font-weight: 400;
        }
        .time-text {
          font-size: 48px;
          fill: #212529;
          font-weight: 700;
          letter-spacing: 2px;
        }
        .calendar-weekday {
          font-size: 12px;
          fill: #555;
          text-anchor: middle;
        }
        .calendar-date {
          font-size: 16px;
          font-weight: bold;
          text-anchor: middle;
        }
        .today-circle {
          fill: rgba(66, 99, 235, 0.7);
          filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1));
        }
        .today-text {
          fill: white;
        }
        .other-day-text {
          fill: #212529;
        }
      </style>

      <!-- 背景 -->
      <rect width="100%" height="100%" fill="url(#bg-gradient)" rx="10" ry="10" />

      <!-- 左側：日付と時間 -->
      <g transform="translate(${svgWidth * 0.15}, ${svgHeight * 0.5})">
        <text x="0" y="-30" class="date-text" text-anchor="start">${date}</text>
        <text x="0" y="30" class="time-text" text-anchor="start">${time}</text>
      </g>

      <!-- 区切り線 -->
      <line x1="${svgWidth * 0.35}" y1="${svgHeight * 0.2}" x2="${svgWidth * 0.35}" y2="${svgHeight * 0.8}" stroke="#adb5bd" stroke-width="1" />

      <!-- 右側：カレンダー - 中央揃え -->
      <g transform="translate(${svgWidth * 0.65}, ${svgHeight * 0.5})">
        ${calendarData.map((day, index) => {
          const offset = index - Math.floor(calendarData.length / 2);
          const x = offset * dayWidth;

          if (day.isToday) {
            return `
              <circle cx="${x}" cy="0" r="20" class="today-circle" />
              <text x="${x}" y="0" dy="5" class="calendar-date today-text">${day.date}</text>
              <text x="${x}" y="25" class="calendar-weekday">${day.weekday}</text>
            `;
          } else {
            return `
              <text x="${x}" y="0" dy="5" class="calendar-date other-day-text">${day.date}</text>
              <text x="${x}" y="25" class="calendar-weekday">${day.weekday}</text>
            `;
          }
        }).join('')}
      </g>
    </svg>
  `;
}
