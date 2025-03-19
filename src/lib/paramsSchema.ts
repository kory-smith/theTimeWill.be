import { z } from 'zod';

export const ParamsSchema = z.object({
	target: z.string().transform((val) => parseFloat(val)),
	unit: z.enum(['second', 'seconds', 'minute', 'minutes', 'hour', 'hours']),
	adjective: z.enum([
		'after',
		'past',
		'later',
		'subsequent',
		'following',
		'past',
		'before',
		'earlier',
		'previous',
		'prior',
		'prior to',
		'up to'
	]),
	source: z.string(),
	meridiem: z.enum(['am', 'pm']).optional()
});
