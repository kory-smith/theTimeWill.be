import { expect, test, describe } from 'bun:test';
import { DateTime } from 'luxon';
import { getOffset } from '$lib/getOffset'; // Update with the correct import path

describe('getOffset', () => {
	// Test case for same calendar day
	test('should return empty string when dates are on the same calendar day', () => {
		const from = DateTime.fromISO('2023-05-10T08:00:00');
		const to = DateTime.fromISO('2023-05-10T16:00:00');

		expect(getOffset(from, to)).toBe('');
	});

	// Test case for one day later
	test("should return '1 calendar day later' when 'to' is the next calendar day", () => {
		const from = DateTime.fromISO('2023-05-10T20:00:00');
		const to = DateTime.fromISO('2023-05-11T10:00:00');

		expect(getOffset(from, to)).toBe('and 1 calendar day later');
	});

	// Test case for one day earlier
	test("should return '1 calendar day earlier' when 'to' is the previous calendar day", () => {
		const from = DateTime.fromISO('2023-05-10T08:00:00');
		const to = DateTime.fromISO('2023-05-09T20:00:00');

		expect(getOffset(from, to)).toBe('and 1 calendar day earlier');
	});

	// Test case for multiple days later
	test("should return 'X calendar days later' when 'to' is multiple calendar days ahead", () => {
		const from = DateTime.fromISO('2023-05-10T14:00:00');
		const to = DateTime.fromISO('2023-05-15T09:00:00');

		expect(getOffset(from, to)).toBe('and 5 calendar days later');
	});

	// Test case for multiple days earlier
	test("should return 'X calendar days earlier' when 'to' is multiple calendar days before", () => {
		const from = DateTime.fromISO('2023-05-15T14:00:00');
		const to = DateTime.fromISO('2023-05-10T09:00:00');

		expect(getOffset(from, to)).toBe('and 5 calendar days earlier');
	});

	// Test case for dates at the boundaries of days (near midnight)
	test('should handle dates near midnight correctly', () => {
		const from = DateTime.fromISO('2023-05-10T23:59:00');
		const to = DateTime.fromISO('2023-05-11T00:01:00');

		expect(getOffset(from, to)).toBe('and 1 calendar day later');
	});

	// Test case for dates across month boundaries
	test('should handle dates across month boundaries', () => {
		const from = DateTime.fromISO('2023-05-30T12:00:00');
		const to = DateTime.fromISO('2023-06-02T12:00:00');

		expect(getOffset(from, to)).toBe('and 3 calendar days later');
	});

	// Test case for dates across year boundaries
	test('should handle dates across year boundaries', () => {
		const from = DateTime.fromISO('2023-12-30T12:00:00');
		const to = DateTime.fromISO('2024-01-02T12:00:00');

		expect(getOffset(from, to)).toBe('and 3 calendar days later');
	});

	// Test case for leap years
	test('should handle leap year dates correctly', () => {
		const from = DateTime.fromISO('2024-02-28T12:00:00');
		const to = DateTime.fromISO('2024-03-01T12:00:00');

		expect(getOffset(from, to)).toBe('and 2 calendar days later');
	});

	// Edge case: Daylight saving time transitions
	test('should handle daylight saving time transitions correctly', () => {
		// This test assumes a DST transition - update the dates based on your timezone
		const beforeDST = DateTime.fromISO('2023-03-12T01:00:00', { zone: 'America/New_York' });
		const afterDST = DateTime.fromISO('2023-03-13T01:00:00', { zone: 'America/New_York' });

		expect(getOffset(beforeDST, afterDST)).toBe('and 1 calendar day later');
	});
});
