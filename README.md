# weblocaltime
Reliably convert time to local timezone in user browser.

This library does two things:

- correctly applies the modern browser [Intl Date Format API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) to show dates in users' browser local timezone
- adds additional clarification to date/time presentation to cover all possibilities for misunderstanding

Recently everyone is organizing a lot of online events and conferences and a lot of them show dates in ways that are very easy to misinterpret.

Hopefully this library / approach can solve this problem in a clear way. You can see the demo of the library in action at the [dmt-system](https://dmt-system.com) website where we do weekly R&D meetings.

![demo](img/dmt_meetup_example.png)

## The problem

There are many hidden issues and edge cases when trying to make clear exactly what time an event or anything else is happening.

Which timezone do we use? **Preferably the end user's timezone**.

But this is only the beginning, even with this there is opporunity for misunderstanding.

A few examples:

`Friday Nov 27 at 9:00` → is this `9 am` or `9 pm`?

This supposes we used 24h time format which is not perfect where users cannot be sure that this was the case. Besides some users are not familiar with this format and don't know what `15h` or `21h` actually is.

We also cannot use the local system-specified time format because this does not work reliably in browsers.

Next try is what if we used 12h format and always displayed `am` / `pm` attached to time?

`Friday Nov 27 at 9:00 am`

This seems fine but there are two problems:

- some users prefer 24h format
- there are edge cases at `noon`

Edge case is:

`Friday Nov 27 at 12:05 pm`

Most users not readily familiar with 12h format are instantly confused by this. Is this 5 minutes after midnigh or noon? Some browser implementations even report this is `0:05 pm` which is even more confusing.

## Solution

We will show the time in both formats (12h and 24h) in parallel for times after 12:00 and show only 12h format before 12:00. In addition we can clarify what time of day it is (morning, daytime, noon, evening or night). Furthermore we can show an **emoji** as well. This should do the trick.

We also allow users to always see the date/time in `UTC` timezone besides their own.

## API

```js
import weblocaltime from 'weblocaltime';

const datetime = new Date('2020-12-30T20:50:00+0100');

const { date, time, timeClarification, emoji, timezone, parts } = weblocaltime(datetime);

// date: 'Wednesday Dec 30 2020',
// time: '20:50',
// timeClarification: '(8:50 PM) evening',
// emoji: '🌆',
// timezone: 'Central European Standard Time'
// --------
// parts: {
//    day: '30',
//    month: 'December',
//    monthShort: 'Dec',
//    year: '2020',
//    hour: '20',
//    minute: '50',
//    second: '00',
//    weekday: 'Wednesday',
//    weekdayShort: 'Wed',
//    time24: '20:50',
//    time12: '8:50 PM',
//    timezone: 'Central European Standard Time'
//  }
```

To see the representation for the `UTC` time zone do this:

```js
import weblocaltime from 'weblocaltime';

const datetime = new Date('2020-12-30T20:50:00+0100');

const { date, time, timeClarification, emoji, timezone, parts } = weblocaltime(datetime, { utc: true });

// {
//   date: 'Wednesday Dec 30 2020',
//   time: '19:50',
//   timeClarification: '(7:50 PM) evening',
//   emoji: '🌆',
//   timezone: 'Coordinated Universal Time (UTC)',
//   parts: {
//     day: '30',
//     month: 'December',
//     monthShort: 'Dec',
//     year: '2020',
//     hour: '19',
//     minute: '50',
//     second: '00',
//     weekday: 'Wednesday',
//     weekdayShort: 'Wed',
//     time24: '19:50',
//     time12: '7:50 PM',
//     timezone: 'Coordinated Universal Time (UTC)'
//   }
// }
````

### Examples

```
git clone https://github.com/dmtsys/weblocaltime.git

cd weblocaltime

node examples/index.js
```

Please use nodejs version `v14.0.0+`.

### Use in your frontend code

```js
import weblocaltime from 'weblocaltime';

...
```

Library is bundled for browser and node.js, it should work with `rollup` and other module bundlers.

## Building manually

Running `npm run build` will produce `./dist/index.js` (CommonJS) and `./dist/index.mjs` (modern ES6).

## Warnings

⚠️ Browsers do not parse ISO8601 date format reliably, always pass datetime into your frontend as unix timestamp (milliseconds since )

```js
> Date.now()
1606233730482
> new Date(1606233730482)
"2020-11-24T16:02:10.482Z"
```

Parse unix timestamp on the frontend by passing the timestamp into `Date` constructor and then use this object with `weblocaltime` function. This is the most reliable way with no edge cases.