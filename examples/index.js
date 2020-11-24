import webLocalTime from '../src/index.js';

// we pass in date in ISO8601 format in UTC timezone, we request the representation for our local timezone
console.log(webLocalTime(new Date('2020-11-27T11:15:00+0000')));
// date: 'Friday Nov 27 2020',
//   time: '12:15 PM',
//   timeClarification: 'noon',
//   emoji: '☀️',
//   timezone: 'Central European Standard Time',
//   parts: {…}
// }

// we pass in date in ISO8601 format in UTC+1 timezone, we request the representation for our local timezone
console.log(webLocalTime(new Date('2020-11-27T15:02:00+0100')));
// {
//   date: 'Friday Nov 27 2020',
//   time: '15:02',
//   timeClarification: '(3:02 PM) daytime',
//   emoji: '🏙️',
//   timezone: 'Central European Standard Time',
//   parts: {…}
// }

// we pass in date in ISO8601 format in UTC+1 timezone, we request display representation for UTC timezone
console.log(webLocalTime(new Date('2020-11-27T15:02:00+0100'), { utc: true }));
// {
//   date: 'Friday Nov 27 2020',
//   time: '14:02',
//   timeClarification: '(2:02 PM) daytime',
//   emoji: '🏙️',
//   timezone: 'Coordinated Universal Time (UTC)',
//   parts: {…}
// }

// we pass in date in ISO8601 format in UTC+3 timezone, we request the representation for our local timezone (without including the year)
console.log(webLocalTime(new Date('2020-12-30T20:50:00+0300'), { showYear: false }));
// {
//   date: 'Wednesday Dec 30',
//   time: '18:50',
//   timeClarification: '(6:50 PM) evening'
//   emoji: '🌆',
//   timezone: 'Central European Standard Time',
//   parts: {…}
// }
