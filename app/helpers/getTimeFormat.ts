import { json } from "@remix-run/node";
import { Params } from "@remix-run/react";
import { DateTime } from "luxon";
import invariant from "tiny-invariant";

// 07:30 pm || 7:30 PM
const localized = /^(\d{1,2})(:)(\d{1,2})(\ )(AM|PM)$/i;
// 19:30
const localized24 = /^(\d{1,2})(:)(\d{1,2})$/i;
// 1900 || 0730
const localized24NoColon = /^\d{4}$/i;
// 7 pm
const hoursOnlyOneDigit = /^\d{1}(\ )(AM|PM)$/i;
// 11 pm or 07 pm
const hoursOnlyTwoDigit = /^\d{2}(\ )(AM|PM)$/i;

// https://moment.github.io/luxon/#/parsing?id=table-of-tokens
const localizedTimeKey = "t";
const localized24HourTimeKey = "T";

// Are we in the correct format, or and if not, what do we do about it?
export function getTimeFormat({ source, meridian }: Params) {
  // trim so that if there's no meridian, we don't get random whitespace.
  const fullTime = `${source} ${meridian}`.trim();

  invariant(source, "Must provide a source");

  const [hours, minutes] = source.split(":").map((num) => parseInt(num));
  // This is all 12 hour time
  if (localized.test(fullTime) && hours <= 12 && minutes <= 59) {
    return { parsingKey: localizedTimeKey, formatKey: DateTime.TIME_SIMPLE };
  } else if (hoursOnlyTwoDigit.test(fullTime) && hours <= 12) {
    return { parsingKey: "hh a", formatKey: DateTime.TIME_SIMPLE };
  } else if (hoursOnlyOneDigit.test(fullTime) && hours <= 12) {
    return { parsingKey: "h a", formatKey: DateTime.TIME_SIMPLE };
  }

  const militaryHours = parseInt(fullTime.slice(0, 2));
  const militaryMinutes = parseInt(fullTime.slice(2, fullTime.length));
  // This is for 24-hour
  if (localized24.test(fullTime) && hours <= 23 && minutes <= 59) {
    return { parsingKey: "T", formatKey: DateTime.TIME_24_SIMPLE };
  } else if (
    localized24NoColon.test(fullTime) &&
    militaryHours <= 23 &&
    militaryMinutes <= 59
  ) {
    return { parsingKey: "HHmm", formatKey: DateTime.TIME_24_SIMPLE };
  }
  throw json(
    {
      error: "Your data wasn't in a recognized format",
      input: fullTime,
    },
    { status: 406 }
  );
}
