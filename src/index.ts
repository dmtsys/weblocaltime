// we parse the timezone out of our date manually -> something (timezone)
function getTimezone(date: Date) {
	return date.toString().match(new RegExp('\\((.*?)\\)'))[1]
}

function replace24HWithZero(time: string) {
	return time.replace(new RegExp(/^24/), '0')
}

export interface LocalTimeOptions {
	/**
	 * @default false
	 */
	utc?: boolean
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
export function localTime(date: Date, options: LocalTimeOptions = {}) {
	const utc = options.utc || false
	const timeZone = utc ? 'UTC' : undefined

	return {
		day: date.toLocaleString('default', { day: 'numeric', timeZone }),
		month: date.toLocaleString('default', { month: 'long', timeZone }),
		monthShort: date.toLocaleString('default', { month: 'short', timeZone }),
		monthNumeric: date.toLocaleString('default', { month: 'numeric', timeZone }),
		year: date.toLocaleString('default', { year: 'numeric', timeZone }),
		hour24: replace24HWithZero(date.toLocaleString('default', { hour: 'numeric', hour12: false, timeZone })),
		minute: date.toLocaleString('default', { minute: 'numeric', timeZone }).padStart(2, '0'), // 2-digit didn't work reliably here, so we pad ourselves!!
		second: date.toLocaleString('default', { second: 'numeric', timeZone }).padStart(2, '0'), // likewise to above, we have to pad manually
		weekday: date.toLocaleString('default', { weekday: 'long', timeZone }),
		weekdayShort: date.toLocaleString('default', { weekday: 'short', timeZone }),
		time24: replace24HWithZero(date.toLocaleString('default', { hour: 'numeric', hour12: false, minute: '2-digit', timeZone })),
		time12: date
			.toLocaleString('default', { hour: 'numeric', hour12: true, minute: '2-digit', timeZone })
			.replace(new RegExp(/^0:(\d+) pm/i), '12:$1 pm') // 0:40 pm is just wrong! --> 12:40 pm -- hourCycle: 'h12' ==> didn't affect 0:12 pm problem
			.replace(new RegExp(/^0:(\d+) am/i), '12:$1 am') // 0:40 am is also wrong! --> 12:40 am
			.replace('PM', 'pm')
			.replace('AM', 'am'),
		timezone: utc ? 'Coordinated Universal Time (UTC)' : getTimezone(date),
	}
}

export interface WebLocalTimeOptions extends LocalTimeOptions {
	/**
	 * If `true`,
	 * @default true
	 */
	showYear?: true
}

export function weblocaltime(date: Date, options: WebLocalTimeOptions = {}) {
	const showYear = options.showYear || true
	const parts = localTime(date, { utc: options.utc })

	const { weekday, monthShort, day, hour24, time24, time12, year } = parts
	const hour = Number(hour24)

	const displayTime = hour > 0 && hour < 12 ? time12 : time24 // 10 am

	let timeClarification = ''

	if (hour == 0 || hour > 12) {
		timeClarification = `(${time12})`
	}

	let emoji: string

	if (hour == 0) {
		timeClarification += ' midnight'
		emoji = '🌚'
	} else if ((hour > 0 && hour < 5) || hour == 23) {
		timeClarification += ' night'
		emoji = '🌙'
	} else if (hour >= 5 && hour < 10) {
		timeClarification += ' morning'
		emoji = '🌅'
	} else if (hour == 12) {
		timeClarification += ' noon' // 12:30 pm (noon)
		emoji = '☀️'
	} else if (hour >= 10 && hour < 17) {
		timeClarification += ' daytime'
		emoji = '🏙️'
	} else if (hour >= 17) {
		timeClarification += ' evening'
		emoji = '🌆'
	}

	const displayDate = `${weekday} ${monthShort} ${day} ${showYear ? year : ''}`.trim()

	return { date: displayDate, time: displayTime, timeClarification: timeClarification.trim(), emoji, timezone: parts.timezone, parts }
}