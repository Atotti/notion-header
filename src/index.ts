import { Hono } from 'hono';
import { getCurrentFormattedDate, getCurrentFormattedTime } from './utils/dateUtils';
import { partlyCloudy } from './utils/icon';

const app = new Hono();

app.get('/svg', async (c) => {
  const date = getCurrentFormattedDate();
  const time = getCurrentFormattedTime();

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="200">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Rampart+One&amp;family=Zen+Kaku+Gothic+New&amp;display=swap');
      text {
        font-family: 'Zen kaku Gothic New', sans-serif;
      }
    </style>
      <rect width="100%" height="100%" fill="lightgray" />
      <text x="20%" y="30%" dominant-baseline="middle" text-anchor="middle" font-size="50" fill="black">
        ${date}
      </text>
      <text x="20%" y="60%" dominant-baseline="middle" text-anchor="middle" font-size="60" fill="black" letter-spacing="4">
        ${time}
      </text>
      <svg x="55%" y="5%" width="100" height="100">
        ${partlyCloudy}
      </svg>
      <text x="60%" y="70%" dominant-baseline="middle" text-anchor="middle" font-size="30" fill="black" letter-spacing="4">
        Nakano, Tokyo 25°C
      </text>
    </svg>
  `;

  return c.text(svgContent, 200, {
    'Content-Type': 'image/svg+xml'
  });
});

export default app;
