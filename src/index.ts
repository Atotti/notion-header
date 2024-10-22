import { Hono } from 'hono'
import fetch from 'node-fetch'
import { env } from 'hono/adapter'

dotenv.config();

const app = new Hono()

type LocationData = {
  city: string;
  country: string;
  lat: number;
  lon: number;
};

type WeatherData = {
  weather: { description: string }[];
  main: { temp: number };
};

// IPアドレスを取得するヘルパー関数
function getClientIp(c: any): string {
  const forwarded = c.req.header('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0];
  }
  return '127.0.0.1'; // フォールバックとしてローカルIP
}

// IPアドレスから位置情報を取得する関数
async function getLocation(ip: string) {
  const response = await fetch(`http://ip-api.com/json/${ip}`);
  const data = await response.json() as LocationData;
  return {
    city: data.city,
    country: data.country,
    lat: data.lat,
    lon: data.lon
  };
}

// 緯度経度から天気情報を取得する関数
async function getWeather(lat: number, lon: number) {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY; // 環境変数からAPIキーを取得
  console.log('API KEY:', apiKey);
  if (!apiKey) {
    throw new Error('OpenWeatherMap API key is not defined in environment variables');
  }
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
  const data = await response.json() as WeatherData;
  return data.weather[0].description + ', ' + data.main.temp + '°C'; // 天気と温度を返す
}

app.get('/svg', async (c) => {
  const now = new Date().toLocaleString();
  const ip = getClientIp(c); // リクエストのIPアドレスを取得

  // IPアドレスから位置情報を取得
  const location = await getLocation(ip);

  // 位置情報が取得できたら天気を取得
  const weather = await getWeather(location.lat, location.lon);

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="280">
      <rect width="100%" height="100%" fill="lightgray" />
      <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" font-size="24" fill="black">
        Current Time: ${now}
      </text>
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-size="18" fill="black">
        Location: ${location.city}, ${location.country}
      </text>
      <text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" font-size="18" fill="black">
        Weather: ${weather}
      </text>
    </svg>
  `;

  return c.text(svgContent, 200, {
    'Content-Type': 'image/svg+xml'
  });
});


export default app

