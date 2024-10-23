import { Hono } from 'hono';
import { getCurrentFormattedDate } from './utils/dateUtils';

const app = new Hono();

app.get('/svg', async (c) => {
  const now = getCurrentFormattedDate();

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="280">
      <rect width="100%" height="100%" fill="lightgray" />
      <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" font-size="24" fill="black">
        ${now}
      </text>
    </svg>
  `;

  return c.text(svgContent, 200, {
    'Content-Type': 'image/svg+xml'
  });
});

export default app;
