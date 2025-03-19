export function generateMeta({
	solution,
	target,
	unit,
	adjective,
	source,
	meridiem
}: {
	solution: string;
	target: number;
	unit: string;
	adjective: string;
	source: string;
	meridiem?: string;
}): {
	title: string;
	description: string;
} {
	return {
		title: `${solution} | ${target} ${unit} ${adjective} ${source} ${meridiem ? meridiem.toUpperCase() : ''}`,
		description: `It'll be ${solution} ${target} ${unit} ${adjective} ${source}`
	};
}
