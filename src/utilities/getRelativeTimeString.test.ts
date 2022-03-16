import { getRelativeTimeString } from './getRelativeTimeString';

describe('getRelativeTimeString', () => {
	/**
	 * While the function technically supports localization via the browser's set locale,
	 * the testing environment is expected to be using English by default. Noting this
	 * here in case that assumption changes in the future.
	 */
	const EXPECTED_ENGLISH_TODAY_STRING = 'today';

	/**
	 * @description Expected values for a given time unit (from seconds all the way to year).
	 *
	 * These are separate duplicate definitions to further ensure that tests don't still pass
	 * if the defined values in the implementation significantly change.
	 */
	enum TimeUnitInMilliseconds {
		Second = 1000,
		Minute = TimeUnitInMilliseconds.Second * 60,
		Hour = TimeUnitInMilliseconds.Minute * 60,
		Day = TimeUnitInMilliseconds.Hour * 24,
		Week = TimeUnitInMilliseconds.Day * 7,
		AverageMonth = TimeUnitInMilliseconds.Day * 30, // exact accuracy isn't necessary for a relative time
		AverageYear = TimeUnitInMilliseconds.Day * 365, // exact accuracy isn't necessary for a relative time
	}

	enum TestDatesInMilliseconds {
		Reference = new Date('Jan 23 1945').valueOf(),
		LessThanOneSecond = new Date('Jan 23 1945 00:00:00.567').valueOf(),
		OneSecond = new Date('Jan 23 1945 00:00:01').valueOf(),
		TwoSeconds = new Date('Jan 23 1945 00:00:02').valueOf(),
		BetweenTwoAndThreeSecondsLower = new Date('Jan 23 1945 00:00:02.234').valueOf(),
		BetweenTwoAndThreeSecondsHigher = new Date('Jan 23 1945 00:00:02.567').valueOf(),
		FiftyNineSeconds = new Date('Jan 23 1945 00:00:59').valueOf(),
		FiftyNineSecondsHigher = new Date('Jan 23 1945 00:00:59.789').valueOf(),

		OneMinute = new Date('Jan 23 1945 00:01:00').valueOf(),
		TwoMinutes = new Date('Jan 23 1945 00:02:00').valueOf(),
		BetweenTwoAndThreeMinutesLower = new Date('Jan 23 1945 00:02:15').valueOf(),
		BetweenTwoAndThreeMinutesHigher = new Date('Jan 23 1945 00:02:45').valueOf(),
		FiftyNineMinutes = new Date('Jan 23 1945 00:59:00').valueOf(),
		FiftyNineMinutesHigher = new Date('Jan 23 1945 00:59:45').valueOf(),

		OneHour = new Date('Jan 23 1945 01:00:00').valueOf(),
		TwoHours = new Date('Jan 23 1945 02:00:00').valueOf(),
		BetweenTwoAndThreeHoursLower = new Date('Jan 23 1945 02:12:34').valueOf(),
		BetweenTwoAndThreeHoursHigher = new Date('Jan 23 1945 02:56:07').valueOf(),
		TwentyThreeHours = new Date('Jan 23 1945 23:00:00').valueOf(),
		TwentyThreeHoursHigher = new Date('Jan 23 1945 23:45:06').valueOf(),

		OneDay = new Date('Jan 24 1945').valueOf(),
		TwoDays = new Date('Jan 25 1945').valueOf(),
		BetweenTwoAndThreeDaysLower = new Date('Jan 25 1945 01:23:45').valueOf(),
		BetweenTwoAndThreeDaysHigher = new Date('Jan 25 1945 18:56:07').valueOf(),
		SixDays = new Date('Jan 29 1945').valueOf(),
		SixDaysHigher = new Date('Jan 29 1945 20:22:23').valueOf(),

		OneWeek = new Date('Jan 30 1945').valueOf(),
		TwoWeeks = new Date('Feb 6 1945').valueOf(),
		BetweenTwoAndThreeWeeksLower = new Date('Feb 9 1945').valueOf(),
		BetweenTwoAndThreeWeeksHigher = new Date('Feb 12 1945').valueOf(),
		TwoDaysBeforeOneMonth = new Date('Feb 21 1945').valueOf(),
		OneDayBeforeOneMonth = new Date('Feb 22 1945').valueOf(),
		OneDayBeforeOneMonthHigher = new Date('Feb 22 1945 12:34:56').valueOf(),

		OneMonth = new Date('Feb 23 1945').valueOf(),
		AboutTwoMonths = TestDatesInMilliseconds.OneMonth + TimeUnitInMilliseconds.AverageMonth,

		OneYear = new Date('Jan 23 1946').valueOf(),
		TwoYears = new Date('Jan 23 1947').valueOf(),
		AboutTenYears = new Date('Jan 23 1955').valueOf(),
	}

	test('returns a local equivalent to today given the current time as the first argument', () => {
		const result = getRelativeTimeString(new Date());
		expect(result).toBe(EXPECTED_ENGLISH_TODAY_STRING);
	});

	test('returns a local equivalent to today given the the same start and end time', () => {
		const result = getRelativeTimeString(new Date(TestDatesInMilliseconds.Reference), new Date(TestDatesInMilliseconds.Reference));
		expect(result).toBe(EXPECTED_ENGLISH_TODAY_STRING);
	});

	const makeRelativeDateTestCase = (endTimePointInMs: number, expectedPositiveResult: string, expectedNegativeResult: string, scenario: string) => ({
		endTimePointInMs,
		expectedPositiveResult,
		expectedNegativeResult,
		scenario,
	});

	[
		makeRelativeDateTestCase(TestDatesInMilliseconds.LessThanOneSecond, EXPECTED_ENGLISH_TODAY_STRING, EXPECTED_ENGLISH_TODAY_STRING, 'times resulting in less than a millisecond time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.OneSecond, 'in 1 second', '1 second ago', 'times resulting in a one second time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.TwoSeconds, 'in 2 seconds', '2 seconds ago', 'times resulting in a two second time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.BetweenTwoAndThreeSecondsLower, 'in 2 seconds', '2 seconds ago', 'times resulting in just over a two second time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.BetweenTwoAndThreeSecondsHigher, 'in 2 seconds', '2 seconds ago', 'times resulting in just under a three second time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.FiftyNineSeconds, 'in 59 seconds', '59 seconds ago', 'times resulting in a fifty-nine second time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.FiftyNineSecondsHigher, 'in 59 seconds', '59 seconds ago', 'times resulting in just under a one minute time difference'),

		makeRelativeDateTestCase(TestDatesInMilliseconds.OneMinute, 'in 1 minute', '1 minute ago', 'times resulting in a one minute time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.TwoMinutes, 'in 2 minutes', '2 minutes ago', 'times resulting in a two minute time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.BetweenTwoAndThreeMinutesLower, 'in 2 minutes', '2 minutes ago', 'times resulting in just over a two minute time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.BetweenTwoAndThreeMinutesHigher, 'in 2 minutes', '2 minutes ago', 'times resulting in just under a three minute time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.FiftyNineMinutes, 'in 59 minutes', '59 minutes ago', 'times resulting in a fifty-nine minute time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.FiftyNineMinutesHigher, 'in 59 minutes', '59 minutes ago', 'times resulting in just under a one hour time difference'),

		makeRelativeDateTestCase(TestDatesInMilliseconds.OneHour, 'in 1 hour', '1 hour ago', 'times resulting in a one hour time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.TwoHours, 'in 2 hours', '2 hours ago', 'times resulting in a two hour time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.BetweenTwoAndThreeHoursLower, 'in 2 hours', '2 hours ago', 'times resulting in just over a two hour time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.BetweenTwoAndThreeHoursHigher, 'in 2 hours', '2 hours ago', 'times resulting in just under a three hour time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.TwentyThreeHours, 'in 23 hours', '23 hours ago', 'times resulting in a twenty-three hour time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.TwentyThreeHoursHigher, 'in 23 hours', '23 hours ago', 'times resulting in just under a one day time difference'),

		makeRelativeDateTestCase(TestDatesInMilliseconds.OneDay, 'in 1 day', '1 day ago', 'times resulting in a one day time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.TwoDays, 'in 2 days', '2 days ago', 'times resulting in a two day time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.BetweenTwoAndThreeDaysLower, 'in 2 days', '2 days ago', 'times resulting in just over a two day time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.BetweenTwoAndThreeDaysHigher, 'in 2 days', '2 days ago', 'times resulting in just under a three day time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.SixDays, 'in 6 days', '6 days ago', 'times resulting in a six day time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.SixDaysHigher, 'in 6 days', '6 days ago', 'times resulting in just under a one week time difference'),

		makeRelativeDateTestCase(TestDatesInMilliseconds.OneWeek, 'in 1 week', '1 week ago', 'times resulting in a one week time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.TwoWeeks, 'in 2 weeks', '2 weeks ago', 'times resulting in a two week time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.BetweenTwoAndThreeWeeksLower, 'in 2 weeks', '2 weeks ago', 'times resulting in just over a two week time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.BetweenTwoAndThreeWeeksHigher, 'in 2 weeks', '2 weeks ago', 'times resulting in just under a three week time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.TwoDaysBeforeOneMonth, 'in 4 weeks', '4 weeks ago', 'times resulting in just two days before a one month time difference'),

		makeRelativeDateTestCase(TestDatesInMilliseconds.OneDayBeforeOneMonth, 'in 1 month', '1 month ago', 'times resulting in just under a one month time difference'), // this particular case can be odd since one month is not a uniform number
		makeRelativeDateTestCase(TestDatesInMilliseconds.OneMonth, 'in 1 month', '1 month ago', 'times resulting in a one month time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.AboutTwoMonths, 'in 2 months', '2 months ago', 'times resulting in roughly a two month difference (60 days)'),

		makeRelativeDateTestCase(TestDatesInMilliseconds.OneYear, 'in 1 year', '1 year ago', 'times resulting in a one year time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.TwoYears, 'in 2 years', '2 years ago', 'times resulting in a two year time difference'),
		makeRelativeDateTestCase(TestDatesInMilliseconds.AboutTenYears, 'in 10 years', '10 years ago', 'times resulting in about a ten year time difference (3650 days)'), // not 100% accurate for leap yeers but good enough for the intended purpose
	].forEach((testCase) => {
		test(`returns [${testCase.expectedPositiveResult}] when given ${testCase.scenario}`, () => {
			const result = getRelativeTimeString(new Date(testCase.endTimePointInMs), new Date(TestDatesInMilliseconds.Reference));
			expect(result).toBe(testCase.expectedPositiveResult);
		});

		test(`returns [${testCase.expectedNegativeResult}] when given ${testCase.scenario} and the resulting difference is negative`, () => {
			const result = getRelativeTimeString(new Date(TestDatesInMilliseconds.Reference), new Date(testCase.endTimePointInMs));
			expect(result).toBe(testCase.expectedNegativeResult);
		});
	});
});
