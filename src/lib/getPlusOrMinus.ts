export function getPlusOrMinus(adjective: string) {
	const beforeSynonyms = [
		'before',
		'earlier',
		'previous',
		'prior',
		'prior to',
		'up to',
		'ahead of',
		'afore'
	];
	if (beforeSynonyms.includes(adjective)) {
		return 'minus';
	} else {
		return 'plus';
	}
}
