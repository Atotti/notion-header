import { getClientIp, getLocation } from './locationUtils';

/**
 * クライアントのタイムゾーンを取得する
 * 優先順位: クエリパラメータ > Cloudflare > 簡易推測 > デフォルト(UTC)
 * @param c Honoのコンテキスト
 * @returns タイムゾーン文字列（IANA時間帯ID）
 */
export async function getClientTimezone(c: any): Promise<string> {
  // 1. クエリパラメータからタイムゾーンを取得
  const queryTz = c.req.query('tz');
  if (queryTz && isValidTimezone(queryTz)) {
    return queryTz;
  }

  // 2. Cloudflare Workersのタイムゾーン情報を使用
  if (c.req.cf?.timezone) {
    return c.req.cf.timezone;
  }

  // 3. IPアドレスから位置情報を取得し、簡易的にタイムゾーンを推測
  try {
    const clientIp = getClientIp(c);
    const location = await getLocation(clientIp);

    // 緯度・経度から簡易的にタイムゾーンを推測
    const timezone = estimateTimezoneFromCoordinates(location.lat, location.lon);
    if (timezone) {
      return timezone;
    }
  } catch (error) {
    console.error('Failed to determine timezone from IP:', error);
  }

  // 4. デフォルトのタイムゾーンを返す
  return 'UTC';
}

/**
 * 緯度・経度から簡易的にタイムゾーンを推測する
 * 主要な地域のみをカバーする簡易的な実装
 * @param lat 緯度
 * @param lon 経度
 * @returns 推測されたタイムゾーン、または null
 */
function estimateTimezoneFromCoordinates(lat: number, lon: number): string | null {
  // 日本
  if (lat >= 24 && lat <= 46 && lon >= 123 && lon <= 146) {
    return 'Asia/Tokyo';
  }

  // アメリカ東部
  if (lat >= 24 && lat <= 50 && lon >= -90 && lon <= -60) {
    return 'America/New_York';
  }

  // アメリカ西部
  if (lat >= 32 && lat <= 49 && lon >= -125 && lon <= -100) {
    return 'America/Los_Angeles';
  }

  // ヨーロッパ中央
  if (lat >= 36 && lat <= 60 && lon >= 0 && lon <= 20) {
    return 'Europe/Paris';
  }

  // イギリス
  if (lat >= 50 && lat <= 59 && lon >= -8 && lon <= 2) {
    return 'Europe/London';
  }

  // オーストラリア東部
  if (lat >= -44 && lat <= -10 && lon >= 141 && lon <= 154) {
    return 'Australia/Sydney';
  }

  // 中国
  if (lat >= 18 && lat <= 54 && lon >= 73 && lon <= 135) {
    return 'Asia/Shanghai';
  }

  // インド
  if (lat >= 6 && lat <= 37 && lon >= 68 && lon <= 97) {
    return 'Asia/Kolkata';
  }

  // ブラジル
  if (lat >= -33 && lat <= 5 && lon >= -75 && lon <= -35) {
    return 'America/Sao_Paulo';
  }

  return null;
}

/**
 * タイムゾーン名が有効かどうかを検証する
 * @param tz タイムゾーン文字列
 * @returns 有効な場合はtrue、無効な場合はfalse
 */
function isValidTimezone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch (e) {
    return false;
  }
}
