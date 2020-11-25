import webLocalTime from '../src/index.js';

// we pass in date in ISO8601 format in UTC timezone, we request the representation for our local timezone
console.log(webLocalTime(new Date('2020-11-27T11:15:00+0000')));
// {
//   date: 'Friday Nov 27 2020',
//   time: '12:15',
//   timeClarification: 'noon',
//   emoji: '☀️',
//   timezone: 'Central European Standard Time',
//   parts: {…}
// }

// we pass in date in ISO8601 format in UTC+1 timezone, we request the representation for our local timezone
console.log(webLocalTime(new Date('2020-11-27T09:30:00+0100')));
// {
//   date: 'Friday Nov 27 2020',
//   time: '9:30 am',
//   timeClarification: 'morning',
//   emoji: '🌅',
//   timezone: 'Central European Standard Time',
//   parts: {…}
// }

// we pass in date in ISO8601 format in UTC+1 timezone, we request display representation for UTC timezone
console.log(webLocalTime(new Date('2020-11-27T15:02:00+0100'), { utc: true }));
// {
//   date: 'Friday Nov 27 2020',
//   time: '14:02',
//   timeClarification: '(2:02 pm) daytime',
//   emoji: '🏙️',
//   timezone: 'Coordinated Universal Time (UTC)',
//   parts: {…}
// }

// we pass in date in ISO8601 format in UTC-2 timezone, we request the representation for our local timezone
console.log(webLocalTime(new Date('2020-12-31T22:50:00-0200')));
// {
//   date: 'Friday Jan 1 2021',
//   time: '1:50 am',
//   timeClarification: 'night',
//   emoji: '🌙',
//   timezone: 'Central European Standard Time',
//   parts: {…}
// }

// we pass in date in ISO8601 format in UTC+3 timezone, we request the representation for our local timezone (without including the year)
console.log(webLocalTime(new Date('2020-12-30T20:50:00+0300'), { showYear: false }));
// {
//   date: 'Wednesday Dec 30',
//   time: '18:50',
//   timeClarification: '(6:50 pm) evening'
//   emoji: '🌆',
//   timezone: 'Central European Standard Time',
//   parts: {…}
// }

// we pass in date in ISO8601 format in UTC timezone, we request the representation for our local timezone
// 0:00 means start of the day (midnight)
console.log(webLocalTime(new Date('2020-12-31T23:00:00+0000')));
// {
//   date: 'Friday Jan 1 2021',
//   time: '0:00',
//   timeClarification: '(12:00 am) midnight',
//   emoji: '🌚',
//   timezone: 'Central European Standard Time',
//   parts: {…}
// }
