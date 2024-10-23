export function getCurrentFormattedDate(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', weekday: 'short' };
    return new Intl.DateTimeFormat('ja-JP', options).format(now);
}

export function getCurrentFormattedTime(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric'};
    return new Intl.DateTimeFormat('ja-JP', options).format(now);
}
