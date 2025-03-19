import { DateTime, Interval } from 'luxon';

// Gives us how many calendar days have passed between from and to. E.g., 10 minutes after 11:59 p.m. is 12:09 a.m., and it's also the next calendar day
export function getOffset(from: DateTime, to: DateTime) {
	const sooner = from.startOf('day') > to.startOf('day') ? to : from;
	const later = from.startOf('day') > to.startOf('day') ? from : to;

	const adjective = from.startOf('day') > to.startOf('day') ? 'earlier' : 'later';

	const rawOffset = Interval.fromDateTimes(sooner.startOf('day'), later.startOf('day')).length(
		'days'
	);
	const leftOfDecimal = parseInt(rawOffset.toString().split('.')[0]);
	// We are in the same calendar day
	if (leftOfDecimal === 0) {
		return '';
	} else if (Math.abs(leftOfDecimal) === 1) {
		return `and ${Math.abs(leftOfDecimal)} calendar day ${adjective}`;
	} else {
		return `and ${Math.abs(leftOfDecimal)} calendar days ${adjective}`;
	}
}
