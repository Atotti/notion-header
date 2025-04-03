export function getCurrentFormattedDate(timezone?: string): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
        month: 'long',
        day: 'numeric',
        weekday: 'short',
        timeZone: timezone || 'UTC'
    };
    return new Intl.DateTimeFormat('en-US', options).format(now);
}

export function getCurrentFormattedTime(timezone?: string): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        timeZone: timezone || 'UTC'
    };
    return new Intl.DateTimeFormat('en-US', options).format(now);
}

export interface CalendarDay {
    date: number;
    month: number;
    year: number;
    weekday: string;
    isToday: boolean;
}

/**
 * 現在の日付を中心に1週間分のカレンダーデータを生成する
 * @param timezone タイムゾーン（指定がない場合はUTC）
 * @returns 7日分のカレンダーデータ（今日を中心に前後3日ずつ）
 */
export function generateWeekCalendar(timezone?: string): CalendarDay[] {
    const today = new Date();
    const result: CalendarDay[] = [];

    // 今日の3日前から3日後までの計7日間
    for (let i = -3; i <= 3; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const weekdayOptions: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            timeZone: timezone || 'UTC'
        };
        const weekday = new Intl.DateTimeFormat('en-US', weekdayOptions).format(date);

        result.push({
            date: date.getDate(),
            month: date.getMonth() + 1, // JavaScriptの月は0始まりなので+1
            year: date.getFullYear(),
            weekday,
            isToday: i === 0
        });
    }

    return result;
}
