import { error, redirect } from '@sveltejs/kit';
import { DateTime } from 'luxon';
import { getTimeFormat } from '$lib/timeFormatting';
import { getPlusOrMinus } from '$lib/getPlusOrMinus';
import { getOffset } from '$lib/getOffset';
import type { LayoutServerLoad } from './$types';
import { generateMeta } from '$lib/generateMeta';

export const load: LayoutServerLoad = async ({ params }) => {
	const { target, unit, adjective, source, meridiem } = params

	// This is guaranteed to be a number because of the target.ts params matcher.
	const targetNumber = Number(target);

	const hasMeridiem = Boolean(meridiem)

	const unitLastLetter = unit[unit.length - 1];
	if (targetNumber === 1 && unitLastLetter === 's') {
		const unitSingular = unit.slice(0, unit.length - 1);
		redirect(308, `/${targetNumber}/${unitSingular}/${adjective}/${source}/${meridiem || ''}`);
	}

	const { parsingKey, formatKey } = getTimeFormat(params);

	const dateTimeText = hasMeridiem ? `${source} ${meridiem}` : source;
	const trueSource = DateTime.fromFormat(dateTimeText, parsingKey);

	if (!trueSource.isValid) {
		error(400, {
			message: 'Invalid time format provided'
		});
	}

	const plusOrMinus = getPlusOrMinus(adjective);

	const solution = trueSource[plusOrMinus]({ [unit]: targetNumber });

	const offset = getOffset(trueSource, solution);

	const { title, description } = generateMeta({
		adjective,
		meridiem,
		solution: solution.toLocaleString(formatKey),
		source,
		target: targetNumber,
		unit
	});

	return {
		source: `What time will it be ${targetNumber} ${unit} ${adjective} ${trueSource.toFormat(
			parsingKey
		)}?`,
		solution: solution.toLocaleString(formatKey),
		offset,
		metadata: {
			title,
			description
		}
	};
};
