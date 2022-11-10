export function getPlusOrMinus(adjective: string) {
	const beforeSynonyms = [
		"before",
		"earlier",
		"previous",
		"prior",
		"prior to",
		"up to",
	];
	if (beforeSynonyms.includes(adjective)) {
		return "minus";
	} else {
		return "plus";
	}
}
