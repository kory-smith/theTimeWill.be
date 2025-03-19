import { expect, test, describe } from 'bun:test';
import { DateTime } from 'luxon';
import { getTimeFormat } from '$lib/timeFormatting';

describe('getTimeFormat', () => {
	// 12-hour format tests
	describe('12-hour formats', () => {
		// Padded 12-hour with meridiem (no minutes)
		test('should recognize padded 12-hour format with meridiem (07 pm)', () => {
			const result = getTimeFormat({ source: '07', meridiem: 'pm' });
			expect(result.parsingKey).toBe('hh a');
			expect(result.formatKey).toEqual(DateTime.TIME_SIMPLE);
		});

		test('should recognize padded 12-hour format with meridiem (12 am)', () => {
			const result = getTimeFormat({ source: '12', meridiem: 'am' });
			expect(result.parsingKey).toBe('hh a');
			expect(result.formatKey).toEqual(DateTime.TIME_SIMPLE);
		});

		// Unpadded 12-hour with meridiem (no minutes)
		test('should recognize unpadded 12-hour format with meridiem (7 pm)', () => {
			const result = getTimeFormat({ source: '7', meridiem: 'pm' });
			expect(result.parsingKey).toBe('h a');
			expect(result.formatKey).toEqual(DateTime.TIME_SIMPLE);
		});

		// Padded 12-hour with meridiem and minutes
		test('should recognize padded 12-hour format with meridiem and minutes (07:22 pm)', () => {
			const result = getTimeFormat({ source: '07:22', meridiem: 'pm' });
			expect(result.parsingKey).toBe('hh:mm a');
			expect(result.formatKey).toEqual(DateTime.TIME_SIMPLE);
		});

		test('should recognize padded 12-hour format with meridiem and minutes (12:30 am)', () => {
			const result = getTimeFormat({ source: '12:30', meridiem: 'am' });
			expect(result.parsingKey).toBe('hh:mm a');
			expect(result.formatKey).toEqual(DateTime.TIME_SIMPLE);
		});

		// Unpadded 12-hour with meridiem and minutes
		test('should recognize unpadded 12-hour format with meridiem and minutes (7:22 pm)', () => {
			const result = getTimeFormat({ source: '7:22', meridiem: 'pm' });
			expect(result.parsingKey).toBe('h:mm a');
			expect(result.formatKey).toEqual(DateTime.TIME_SIMPLE);
		});

		// Case insensitivity for AM/PM
		test('should handle lowercase meridiem (07:22 am)', () => {
			const result = getTimeFormat({ source: '07:22', meridiem: 'am' });
			expect(result.parsingKey).toBe('hh:mm a');
			expect(result.formatKey).toEqual(DateTime.TIME_SIMPLE);
		});
	});

	// 24-hour format tests
	describe('24-hour formats', () => {
		// Padded 24-hour with no minutes
		test('should recognize padded 24-hour format (07)', () => {
			const result = getTimeFormat({ source: '07' });
			expect(result.parsingKey).toBe('HH');
			expect(result.formatKey).toEqual(DateTime.TIME_24_SIMPLE);
		});

		test('should recognize padded 24-hour format (13)', () => {
			const result = getTimeFormat({ source: '13' });
			expect(result.parsingKey).toBe('HH');
			expect(result.formatKey).toEqual(DateTime.TIME_24_SIMPLE);
		});

		// Unpadded 24-hour with no minutes
		test('should recognize unpadded 24-hour format (7)', () => {
			const result = getTimeFormat({ source: '7' });
			expect(result.parsingKey).toBe('H');
			expect(result.formatKey).toEqual(DateTime.TIME_24_SIMPLE);
		});

		// Padded 24-hour with minutes
		test('should recognize padded 24-hour format with minutes (07:22)', () => {
			const result = getTimeFormat({ source: '07:22' });
			expect(result.parsingKey).toBe('HH:mm');
			expect(result.formatKey).toEqual(DateTime.TIME_24_SIMPLE);
		});

		test('should recognize padded 24-hour format with minutes (13:45)', () => {
			const result = getTimeFormat({ source: '13:45' });
			expect(result.parsingKey).toBe('HH:mm');
			expect(result.formatKey).toEqual(DateTime.TIME_24_SIMPLE);
		});

		// 24-hour format with no colons
		test('should recognize padded 24-hour format with minutes and no colon (0722)', () => {
			const result = getTimeFormat({ source: '0722' });
			expect(result.parsingKey).toBe('HHmm');
			expect(result.formatKey).toEqual(DateTime.TIME_24_SIMPLE);
		});

		test('should recognize padded 24-hour format with minutes and no colon (1345)', () => {
			const result = getTimeFormat({ source: '1345' });
			expect(result.parsingKey).toBe('HHmm');
			expect(result.formatKey).toEqual(DateTime.TIME_24_SIMPLE);
		});

		// Unpadded 24-hour with minutes
		test('should recognize unpadded 24-hour format with minutes (7:22)', () => {
			const result = getTimeFormat({ source: '7:22' });
			expect(result.parsingKey).toBe('H:mm');
			expect(result.formatKey).toEqual(DateTime.TIME_24_SIMPLE);
		});
	});

	// Edge case and error tests
	describe('edge cases and errors', () => {
		// Whitespace handling
		test('should handle whitespace in source', () => {
			const result = getTimeFormat({ source: ' 07:22 ', meridiem: 'pm' });
			expect(result.parsingKey).toBe('hh:mm a');
			expect(result.formatKey).toEqual(DateTime.TIME_SIMPLE);
		});

		// Invalid inputs
		test('should throw for invalid time (25:00)', () => {
			expect(() => getTimeFormat({ source: '25:00' })).toThrow();
		});

		test('should throw for invalid time (12:75 pm)', () => {
			expect(() => getTimeFormat({ source: '12:75', meridiem: 'pm' })).toThrow();
		});

		test('should throw for invalid format', () => {
			expect(() => getTimeFormat({ source: 'not-a-time' })).toThrow();
		});

		test('should throw for missing source', () => {
			expect(() => getTimeFormat({ source: '' })).toThrow();
		});
	});
});
