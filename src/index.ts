import { Hono } from 'hono';
import {
  getCurrentFormattedDate,
  getCurrentFormattedTime,
  generateWeekCalendar
} from './utils/dateUtils';
import {
  generateHeaderSVG
} from './utils/svgUtils';

const app = new Hono();

/**
 * SVG画像を生成するエンドポイント
 * Notionヘッダーに埋め込むための日付、時間、カレンダーを表示するSVG
 */
app.get('/svg', async (c) => {
  // クライアントのタイムゾーンを取得（Cloudflare Workersの機能を使用）
  // @ts-ignore - Cloudflare Workersの型定義が不足しているため
  const timezone = c.req.cf?.timezone || 'UTC';

  // 日付と時間を取得（タイムゾーンを考慮）
  const date = getCurrentFormattedDate(timezone);
  const time = getCurrentFormattedTime(timezone);

  // 1週間分のカレンダーデータを生成（タイムゾーンを考慮）
  const calendarData = generateWeekCalendar(timezone);

  // クエリパラメータからテーマを取得
  const isDarkMode = c.req.query('theme') === 'dark';

  // 最終的なSVGを生成（テーマを指定）
  const svgContent = generateHeaderSVG(date, time, calendarData, isDarkMode);

  // SVG画像としてレスポンスを返す
  return c.text(svgContent, 200, {
    'Content-Type': 'image/svg+xml',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
});

export default app;
