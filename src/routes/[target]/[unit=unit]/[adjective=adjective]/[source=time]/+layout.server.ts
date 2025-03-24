import { error, redirect } from '@sveltejs/kit';
import { DateTime } from 'luxon';
import { getTimeFormat } from '$lib/timeFormatting';
import { getPlusOrMinus } from '$lib/getPlusOrMinus';
import { getOffset } from '$lib/getOffset';
import type { LayoutServerLoad } from './$types';
import { generateMeta } from '$lib/generateMeta';
import { ParamsSchema } from '$lib/paramsSchema';

export const load: LayoutServerLoad = async ({ params, url }) => {
	// This is guaranteed to be a number because of the param matcher
	// const targetNumber = Number(params.target);

	const parsedParams = ParamsSchema.safeParse(params);

	if (!parsedParams.success) {
		error(400, {
			message: 'Invalid parameters provided'
		});
	}

	const { target, unit, adjective, source, meridiem } = parsedParams.data;

	const match = url.pathname.match(/(am|a\.m\.|pm|p\.m\.)/i);
	const hasMeridiem = match ? match.length > 0 : false;

	const unitLastLetter = unit[unit.length - 1];
	if (target === 1 && unitLastLetter === 's') {
		const unitSingular = unit.slice(0, unit.length - 1);
		redirect(308, `/${target}/${unitSingular}/${adjective}/${source}/${meridiem || ''}`);
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

	const solution = trueSource[plusOrMinus]({ [unit]: target });

	const offset = getOffset(trueSource, solution);

	const { title, description } = generateMeta({
		adjective,
		meridiem,
		solution: solution.toLocaleString(formatKey),
		source,
		target,
		unit
	});

	return {
		source: `What time will it be ${target} ${unit} ${adjective} ${trueSource.toFormat(
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
