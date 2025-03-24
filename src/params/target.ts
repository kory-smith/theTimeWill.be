import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string) => {
	const isNumber = !isNaN(Number(param));

	return isNumber;
}) satisfies ParamMatcher;
