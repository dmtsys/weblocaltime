# weblocaltime
> Reliably convert time to local timezone in user browser.

Recently everyone is organizing a lot of online events and conferences and a lot of them show dates in ways that are very easy to misinterpret.

Hopefully this library / approach can solve this problem in a clear way. 

**weblocaltime library** solves the issue in two steps:

- 1) correctly applies the modern browser [Intl Date Format API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) to convert dates to web browser local timezone

- 2) adds additional clarification to date/time presentation to cover all possibilities for misunderstanding

Library works in environments besides web browser that also support the Intl API, for example [Node.js](https://nodejs.org/) and [Deno](https://deno.land/).

## Demo of actual use case

![demo](img/dmt_meetup_example.png)

You can see the demo of the library in action at [dmt-system](https://dmt-system.com).

Check out the demo and you are also invited to join one of our meetings. Welcome to provide ideas or just listen — anonymously or not.

<hr>

[**dmt-system**](https://dmt-system.com) is about _easy to use performant fully-contained networked local-first apps_ that integrate well with other modern platforms and technologies and are under end users' total control.

- _easy to use:_ fast and reliable
- _fully-contained:_ each computer or server has 1) full server ('backend') logic and 2) full GUI ('frontend') code
- _networked:_ app instances talk to each other over fast websocket ([connectome](https://github.com/uniqpath/connectome)) connections
- [_local-first_](https://www.inkandswitch.com/local-first.html): GUI is usually served from local instance on particular machine. Data is also local to the instance as much as possible.

**weblocaltime** was implemented to solve the practical problem of online meetup coordination for our R&D purposes and since it worked well, we are sharing the code / approach.

## Definition of the problem that weblocaltime library solves

There are many hidden issues and edge cases when trying to make clear exactly what time an event is happening.

Which timezone do we use? Preferably the end user's timezone. In modern browsers we can do that well now ✓

But this is only the beginning, even with this **there are many opporunities for misunderstanding**.

Examples:

`Friday Nov 27 at 9:00` 

This supposes we used 24h time format (0h-23h) because we don't see explicit am/pm tags. We cannot be really sure though because perhaps am/pm denotation was omitted by mistake → So is this event at `9 am` or `9 pm`? If we usually don't even use the 24h format in our country and are not familiar with it, then we actually assume that am/pm tags are missing and we are confused.

What if we used 12h format and always displayed `am` / `pm` attached to time?

`Friday Nov 27 at 9:00 am`

This seems fine but there are two problems:

- some users prefer the 24h format and it is additional mental overhead to convert `8 pm` into `20h` etc.
- there are edge cases at `noon`

Edge case is:

`Friday Nov 27 at 12:05 pm`

Most users not readily familiar with 12h format are instantly confused by this. Is this 5 minutes after midnight or noon? The default `Intl` browser implementation even reports this is as `0:05 pm` which is extremely confusing. This does mean `noon` (midnight is `0:00 am`) but we shouldn't be expected to know that if we are not native users of 12h time format.

## Solution specification

- For times just after midnight (= 0:xx / 12:xx am) we will show time in both formats with additional `midnight` tag. Example: `0:50 (12:50 am) midnight`
- For times before `noon` (< 12:00) (excluding midnight) we will show time in 12h format - attaching `am` to time. This is always clear. Example: `10:00 am`
- For `noon` (= 12:xx) we will show this: `12:15 (noon)`. If we also show emoji, this is represented with ☀️.
- For times after `noon` (>= 13:00) we will show the time in **both formats** (24h and 12h). Example: `19:50 (7:50 pm)`
- In addition we always clarify what time of day it is (`morning`, `daytime`, `noon`, ` evening` or `night` / `midnight`). Example: `19:50 (7:50 pm) evening`
- Furthermore we can show an **emoji** as well. 
- We also allow users to always see the date/time in `UTC` timezone besides their local timezone.

This should do the trick. [Solution](https://github.com/dmtsys/weblocaltime/blob/main/src/index.js) is under 70 LOC _(lines-of-code)_.

## API

```js
import weblocaltime from 'weblocaltime';

const datetime = new Date('2020-12-30T20:50:00+0200');

const { date, time, timeClarification, emoji, timezone, parts } = weblocaltime(datetime);

// =>

{
  date: 'Wednesday Dec 30 2020',
  time: '19:50',
  timeClarification: '(7:50 pm) evening',
  emoji: '🌆',
  timezone: 'Central European Standard Time',
  parts: {
    day: '30',    
    month: 'December',
    monthShort: 'Dec',
    monthNumeric: '12',
    year: '2020',
    hour24: '19',
    minute: '50',
    second: '00',
    weekday: 'Wednesday',
    weekdayShort: 'Wed',
    time24: '19:50',
    time12: '7:50 pm',
    timezone: 'Central European Standard Time'
  }
}
```

Notice that the [ISO8601 date](https://en.wikipedia.org/wiki/ISO_8601) (`'2020-12-30T20:50:00+0200'`) we pass in can be specified in any timezone (`+0200` in this example). It will get converted from any timezone to our local timezone (`Central European Standard Time` in this test case in that particular user browser).

`timeClarification` is separate so we can style it a bit deemphasized (see the demo example ↑).

<hr>

**To see the representation for the `UTC` time zone do this:**

```js
import weblocaltime from 'weblocaltime';

const datetime = new Date('2020-12-05T14:20:00+0500');

const { date, time, timeClarification, emoji, timezone, parts } = weblocaltime(datetime, { utc: true });

// =>

{
  date: 'Saturday Dec 5 2020',
  time: '9:20 am',
  timeClarification: 'morning',
  emoji: '🌅',
  timezone: 'Coordinated Universal Time (UTC)',
  parts: {
    day: '5',
    month: 'December',
    monthShort: 'Dec',
    monthNumeric: '12',
    year: '2020',
    hour24: '09',
    minute: '20',
    second: '00',
    weekday: 'Saturday',
    weekdayShort: 'Sat',
    time24: '09:20',
    time12: '9:20 am',
    timezone: 'Coordinated Universal Time (UTC)'
  }
}
````

ISO8601 date we passed in was specified in `+0500` timezone offset this time. 

We asked for the representation in `UTC` instead of browser local timezone in this example. 

This representation can be used to show your users the time in `UTC` (on request) in addition to their local timezone so that there is absolutely no confusion.

<hr>

**To omit the year because the event is in current year:**

```js
const { date, time, timeClarification, emoji, timezone, parts } = weblocaltime(datetime, { showYear: false });

// =>

{
  date: 'Saturday Dec 5',
  time: '9:20 am',
  …
}
```

### More examples

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

⚠️ Browsers do not parse ISO8601 date format reliably, always pass datetime into your frontend as [unix timestamp](https://en.wikipedia.org/wiki/Unix_time) _(milliseconds since  00:00:00 UTC) on 1 January 1970 - an arbitrary date; leap seconds are ignored)_. 

```js
> Date.now()
1606233730482
> new Date(1606233730482)
"2020-11-24T16:02:10.482Z"
```

Parse unix timestamp on the frontend by passing the timestamp into `Date` constructor and then use this object with `weblocaltime` function. This is the most reliable way with no edge cases.

Use this [great utility](https://www.epochconverter.com/) as a handy helper when you need to make sure you are working with correct dates and to prevent bugs.