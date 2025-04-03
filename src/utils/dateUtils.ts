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
    const now = new Date();

    // タイムゾーンを考慮した「今日」の日付を取得
    const todayParts = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        timeZone: timezone || 'UTC'
    }).formatToParts(now);

    // formatToPartsの結果から年、月、日を抽出
    const todayYear = parseInt(todayParts.find(part => part.type === 'year')?.value || '0');
    const todayMonth = parseInt(todayParts.find(part => part.type === 'month')?.value || '0');
    const todayDay = parseInt(todayParts.find(part => part.type === 'day')?.value || '0');

    const result: CalendarDay[] = [];
    const baseDate = new Date(now);

    // 今日の3日前から3日後までの計7日間
    for (let i = -3; i <= 3; i++) {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() + i);

        // この日付をタイムゾーンを考慮して取得
        const dateParts = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            timeZone: timezone || 'UTC'
        }).formatToParts(date);

        const year = parseInt(dateParts.find(part => part.type === 'year')?.value || '0');
        const month = parseInt(dateParts.find(part => part.type === 'month')?.value || '0');
        const day = parseInt(dateParts.find(part => part.type === 'day')?.value || '0');

        const weekday = new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            timeZone: timezone || 'UTC'
        }).format(date);

        // タイムゾーンを考慮した日付比較
        const isToday = year === todayYear && month === todayMonth && day === todayDay;

        result.push({
            date: day,
            month: month,
            year: year,
            weekday,
            isToday: isToday
        });
    }

    return result;
}
