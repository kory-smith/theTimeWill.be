import type { ParamMatcher } from '@sveltejs/kit';

const units = ['second', 'seconds', 'minute', 'minutes', 'hour', 'hours'] as const;

type Unit = (typeof units)[number];

export const match = ((param: string): param is Unit => {
	return units.some((unit) => unit === param);
}) satisfies ParamMatcher;
