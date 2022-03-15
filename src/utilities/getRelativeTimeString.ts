enum TimeUnitInMilliseconds {
	Second = 1000,
	Minute = TimeUnitInMilliseconds.Second * 60,
	Hour = TimeUnitInMilliseconds.Minute * 60,
	Day = TimeUnitInMilliseconds.Hour * 24,
	Week = TimeUnitInMilliseconds.Day * 7,
	AverageMonth = TimeUnitInMilliseconds.Day * 30, // exact accuracy isn't necessary for a relative time
	AverageYear = TimeUnitInMilliseconds.Day * 365,
}

enum TimeUnit {
	Second = 'second',
	Minute = 'minute',
	Hour = 'hour',
	Day = 'day',
	Week = 'week',
	Month = 'month',
	Year = 'year',
}

const TIME_VALUE_UNIT_TUPLES = [
	{ minValue: TimeUnitInMilliseconds.AverageYear, timeUnit: TimeUnit.Year },
	{ minValue: TimeUnitInMilliseconds.AverageMonth, timeUnit: TimeUnit.Month },
	{ minValue: TimeUnitInMilliseconds.Week, timeUnit: TimeUnit.Week },
	{ minValue: TimeUnitInMilliseconds.Day, timeUnit: TimeUnit.Day },
	{ minValue: TimeUnitInMilliseconds.Hour, timeUnit: TimeUnit.Hour },
	{ minValue: TimeUnitInMilliseconds.Second, timeUnit: TimeUnit.Second },
];

let relativeTimeFormatterForTuple: Intl.RelativeTimeFormat;
let timeFormatForToday: string;

export function getRelativeTimeString(endTimePoint: Date, startTimePoint = new Date()): string {
	const timeDifference = endTimePoint.valueOf() - startTimePoint.valueOf();
	const absoluteTimeDifference = timeDifference < 0 ? -timeDifference : timeDifference;

	let timeString: string;
	const matchingTuple = TIME_VALUE_UNIT_TUPLES.find((tuple) => absoluteTimeDifference >= tuple.minValue);
	if (matchingTuple) {
		const timeDifferenceAtTuple = (timeDifference) / matchingTuple.minValue;
		const normalizedTimeDifferenceAtTuple = timeDifference > 0
			? Math.max(Math.floor(timeDifferenceAtTuple), 1)
			: Math.min(Math.ceil(timeDifferenceAtTuple), -1);

		if (!relativeTimeFormatterForTuple) {
			relativeTimeFormatterForTuple = new Intl.RelativeTimeFormat();
		}
		timeString = relativeTimeFormatterForTuple.format(normalizedTimeDifferenceAtTuple, matchingTuple.timeUnit);
	} else {
		if (!timeFormatForToday) {
			timeFormatForToday = (new Intl.RelativeTimeFormat(navigator.language, { numeric: 'auto' })).format(0, TimeUnit.Day);
		}
		timeString = timeFormatForToday;
	}
	return timeString;
}
