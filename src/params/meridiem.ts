import type { ParamMatcher } from '@sveltejs/kit';

const meridiems = [
'am',
"a.m.",
'a.m',
'am.',
'pm',
"p.m.",
'p.m',
'pm.'
] as const;

export type Meridiem = (typeof meridiems)[number];

export const match = ((param: string): param is Meridiem => {
	return meridiems.some((unit) => unit === param);
}) satisfies ParamMatcher;
