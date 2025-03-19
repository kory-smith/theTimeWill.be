import { DateTime } from 'luxon';
import invariant from 'tiny-invariant';

const regexes = {
	// 07 pm || 12 pm
	paddedTwelveHourWithMeridiem: /^\d{2}( )(AM|PM)$/i,
	// 7 pm
	twelveHourWithMeridiem: /^\d{1}( )(AM|PM)$/i,
	// 07:22 pm || 12:22 pm
	paddedTwelveHourWithMeridiemAndMinutes: /^(\d{2})(:)(\d{2})( )(AM|PM)$/i,
	// 7:22 pm
	twelveHourWithMeridiemAndMinutes: /^(\d{1})(:)(\d{2})( )(AM|PM)$/i,
	// 13 || 07
	paddedTwentyFourHour: /^(\d{2})$/i,
	// 7
	twentyFourHour: /^(\d{1})$/i,
	// 07:22 || 13:22
	paddedTwentyFourHourWithMinutes: /^(\d{2})(:)(\d{2})$/i,
	// 0722
	paddedTwentyFourHourWithMinutesNoColon: /^(\d{2})(\d{2})$/i,
	// 7:22
	twentyFourHourWithMinutes: /^(\d{1})(:)(\d{2})$/i
};

// https://moment.github.io/luxon/#/parsing?id=table-of-tokens
const parsingKeys = {
	paddedTwelveHourWithMeridiem: 'hh a',
	twelveHourWithMeridiem: 'h a',
	paddedTwelveHourWithMeridiemAndMinutes: 'hh:mm a',
	twelveHourWithMeridiemAndMinutes: 'h:mm a',
	paddedTwentyFourHour: 'HH',
	twentyFourHour: 'H',
	paddedTwentyFourHourWithMinutes: 'HH:mm',
	paddedTwentyFourHourWithMinutesNoColon: 'HHmm',
	twentyFourHourWithMinutes: 'H:mm'
} as const;

export function getTimeFormat({ source, meridiem }: { source: string; meridiem?: string }): {
	parsingKey: (typeof parsingKeys)[keyof typeof parsingKeys];
	formatKey: Intl.DateTimeFormatOptions;
} {
	invariant(source, 'Must provide a source');

	// Trim the source to handle whitespace
	const trimmedSource = source.trim();

	let fullTime;
	if (meridiem) {
		fullTime = `${trimmedSource} ${meridiem}`.trim();
	} else {
		fullTime = trimmedSource;
	}

	// Split time parts safely
	const timeParts = trimmedSource.split(':');
	const hours = parseInt(timeParts[0]);
	const minutes = timeParts.length > 1 ? parseInt(timeParts[1]) : undefined;

	// 12-hour time with meridiem
	if (meridiem) {
		// 07 pm || 12 pm
		if (regexes.paddedTwelveHourWithMeridiem.test(fullTime) && hours <= 12) {
			return {
				parsingKey: parsingKeys.paddedTwelveHourWithMeridiem,
				formatKey: DateTime.TIME_SIMPLE
			};
			// 7 pm
		} else if (regexes.twelveHourWithMeridiem.test(fullTime) && hours <= 12) {
			return {
				parsingKey: parsingKeys.twelveHourWithMeridiem,
				formatKey: DateTime.TIME_SIMPLE
			};
			// 07:22 pm || 12:22 pm
		} else if (
			regexes.paddedTwelveHourWithMeridiemAndMinutes.test(fullTime) &&
			hours <= 12 &&
			minutes !== undefined &&
			minutes <= 59
		) {
			return {
				parsingKey: parsingKeys.paddedTwelveHourWithMeridiemAndMinutes,
				formatKey: DateTime.TIME_SIMPLE
			};
			// 7:22 pm
		} else if (
			regexes.twelveHourWithMeridiemAndMinutes.test(fullTime) &&
			hours <= 12 &&
			minutes !== undefined &&
			minutes <= 59
		) {
			return {
				parsingKey: parsingKeys.twelveHourWithMeridiemAndMinutes,
				formatKey: DateTime.TIME_SIMPLE
			};
		}
	}

	// Handle 24-hour time (military time)

	// 0722 || 1322 (special case for no colon)
	if (regexes.paddedTwentyFourHourWithMinutesNoColon.test(fullTime)) {
		const militaryHours = parseInt(fullTime.slice(0, 2));
		const militaryMinutes = parseInt(fullTime.slice(2, 4));

		if (militaryHours <= 23 && militaryMinutes <= 59) {
			return {
				parsingKey: parsingKeys.paddedTwentyFourHourWithMinutesNoColon,
				formatKey: DateTime.TIME_24_SIMPLE
			};
		}
	}

	// 07 || 13 (hours only, padded)
	if (regexes.paddedTwentyFourHour.test(fullTime) && hours <= 23) {
		return {
			parsingKey: parsingKeys.paddedTwentyFourHour,
			formatKey: DateTime.TIME_24_SIMPLE
		};
		// 7 (hours only, unpadded)
	} else if (regexes.twentyFourHour.test(fullTime) && hours <= 23) {
		return {
			parsingKey: parsingKeys.twentyFourHour,
			formatKey: DateTime.TIME_24_SIMPLE
		};
		// 07:22 || 13:22
	} else if (
		regexes.paddedTwentyFourHourWithMinutes.test(fullTime) &&
		hours <= 23 &&
		minutes !== undefined &&
		minutes <= 59
	) {
		return {
			parsingKey: parsingKeys.paddedTwentyFourHourWithMinutes,
			formatKey: DateTime.TIME_24_SIMPLE
		};
		// 7:22
	} else if (
		regexes.twentyFourHourWithMinutes.test(fullTime) &&
		hours <= 23 &&
		minutes !== undefined &&
		minutes <= 59
	) {
		return {
			parsingKey: parsingKeys.twentyFourHourWithMinutes,
			formatKey: DateTime.TIME_24_SIMPLE
		};
	}

	throw new Error('Time data was not provided ina recognized format');
}
