import type { ParamMatcher } from '@sveltejs/kit';

const adjectives = [
	'before',
	'earlier',
	'prior to',
	'earlier than',
	'preceding',
	'in advance of',
	'ahead of',
	'previous to',
	'antecedent to',
	'leading up to',
	'until',
	'till',
	'after',
	'following',
	'subsequent to',
	'later than',
	'post',
	'succeeding',
	'in the wake of',
	'beyond',
	'past',
	'ensuing',
	'posterior to',
	'thereafter'
] as const;

export type Adjective = (typeof adjectives)[number];

export const match = ((param: string): param is Adjective => {
	return adjectives.some((unit) => unit === param);
}) satisfies ParamMatcher;
