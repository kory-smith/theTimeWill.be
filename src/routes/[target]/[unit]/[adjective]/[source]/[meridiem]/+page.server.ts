import { error, redirect } from '@sveltejs/kit';
import { DateTime } from 'luxon';
import { getTimeFormat } from '$lib/timeFormatting';
import { generateMeta } from '$lib/generateMeta';
import { getPlusOrMinus } from '$lib/getPlusOrMinus';
import { getOffset } from '$lib/getOffset';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

// This would need to be defined in a separate file
const ParamsSchema = z.object({
  target: z.coerce.number(),
  unit: z.string(),
  adjective: z.string(),
  source: z.string(),
  meridiem: z.string().optional()
});

export const load: PageServerLoad = async ({ params, url }) => {
  try {
    // Validate params
    const parsedParams = ParamsSchema.parse(params);
    const { target, unit, adjective, source, meridiem } = parsedParams;

    // Check if URL has meridiem
		const match = url.pathname.match(/(am|a\.m\.|pm|p\.m\.)/i);
		const hasMeridiem = match ? match.length > 0 : false;

    // If the target is 1 and we are using the plural (e.g. 1 minutes) redirect to singular
    const unitLastLetter = unit[unit.length - 1];
    if (target === 1 && unitLastLetter === "s") {
      const unitSingular = unit.slice(0, unit.length - 1);
      throw redirect(
        308,
        `/${target}/${unitSingular}/${adjective}/${source}/${meridiem || ''}`
      );
    }

    const { parsingKey, formatKey } = getTimeFormat(params);

    const dateTimeText = hasMeridiem ? `${source} ${meridiem}` : source;
    const trueSource = DateTime.fromFormat(dateTimeText, parsingKey);
    
    if (!trueSource.isValid) {
      throw error(400, {
        message: 'Invalid time format provided',
      });
    }

    const plusOrMinus = getPlusOrMinus(adjective);

    const solution = trueSource[plusOrMinus]({ [unit]: target });

    const offset = getOffset(trueSource, solution);

    return {
      source: `What time will it be ${target} ${unit} ${adjective} ${trueSource.toFormat(
        parsingKey
      )}?`,
      solution: solution.toLocaleString(formatKey),
      offset,
    };
  } catch (e) {
    
    // Handle validation errors
    error(400, {
      message: 'Invalid URL params',
    });
  }
};