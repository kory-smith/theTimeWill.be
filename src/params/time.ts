// src/params/number.js
import { type ParamMatcher } from '@sveltejs/kit';

// Single digits
type Digit0To9 = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type Digit0To5 = '0' | '1' | '2' | '3' | '4' | '5';

// Hours (00-23)
type Hour00To09 = `0${Digit0To9}`;
type Hour10To19 = `1${Digit0To9}`;
type Hour20To23 = `2${'0' | '1' | '2' | '3'}`;
type HourWith0 = Hour00To09 | Hour10To19 | Hour20To23;

// Hours (0-23) - no leading zero
type Hour0To9 = Digit0To9;
type Hour10To23 = Hour10To19 | Hour20To23;
type HourWithout0 = Hour0To9 | Hour10To23;

// Minutes (00-59)
type Minute00To09 = `0${Digit0To9}`;
type Minute10To59 = `${Digit0To5}${Digit0To9}`;
type MinuteAny = Minute00To09 | Minute10To59;

// Standard time with colon (HH:MM)
type StandardTimeWithLeadingZero = `${HourWith0}:${MinuteAny}`;
type StandardTimeWithoutLeadingZero = `${HourWithout0}:${MinuteAny}`;
type StandardTime = StandardTimeWithLeadingZero | StandardTimeWithoutLeadingZero;

// Military time (HHMM)
type MilitaryTimeWith4Digits = `${HourWith0}${MinuteAny}`;

// Military time (HMM) - only 3 digits, like 130 for 1:30
type MilitaryTimeWith3Digits = `${Hour0To9}${MinuteAny}`;

// Combining all time formats into one union type
type AnyTime = StandardTime | MilitaryTimeWith4Digits | MilitaryTimeWith3Digits;

export const match = ((param): param is AnyTime => {
  // Check for standard time format (HH:MM)
  if (param.includes(':')) {
    return /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(param);
  }
  
  // Check for military time format (0500 or 500)
  const militaryTime = param.padStart(4, '0'); // Pad to 4 digits if needed
  const hours = parseInt(militaryTime.substring(0, 2));
  const minutes = parseInt(militaryTime.substring(2, 4));
  
  return /^\d+$/.test(param) && hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}) satisfies ParamMatcher;