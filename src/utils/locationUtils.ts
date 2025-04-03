export type LocationData = {
    city: string;
    country: string;
    lat: number;
    lon: number;
};

/**
 * IPアドレスを取得するヘルパー関数
 * @param c Honoのコンテキスト
 * @returns クライアントのIPアドレス
 */
export function getClientIp(c: any): string {
  const forwarded = c.req.header('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0];
  }
  return '127.0.0.1'; // フォールバックとしてローカルIP
}

/**
 * IPアドレスから位置情報を取得する関数
 * @param ip IPアドレス
 * @returns 位置情報（都市、国、緯度、経度）
 */
export async function getLocation(ip: string) {
  const response = await fetch(`http://ip-api.com/json/${ip}`);
  const data = await response.json() as LocationData;
  return {
    city: data.city,
    country: data.country,
    lat: data.lat,
    lon: data.lon
  };
}
