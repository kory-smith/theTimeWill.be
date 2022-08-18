import { json } from "@remix-run/node";
import { Params } from "@remix-run/react";
import { DateTime } from "luxon";
import invariant from "tiny-invariant";

const regexes = {
  // 07 pm || 12 pm
  paddedTwelveHourWithMeridiem: /^\d{2}(\ )(AM|PM)$/i,
  // 7 pm
  twelveHourWithMeridiem: /^\d{1}(\ )(AM|PM)$/i,
  // 07:22 pm || 12:22 pm
  paddedTwelveHourWithMeridiemAndMinutes: /^(\d{2})(:)(\d{2})(\ )(AM|PM)$/i,
  // 7:22 pm
  twelveHourWithMeridiemAndMinutes: /^(\d{1})(:)(\d{2})(\ )(AM|PM)$/i,
  // 13 || 07
  paddedTwentyFourHour: /^(\d{2})$/i,
  // 7
  twentyFourHour: /^(\d{1})$/i,
  // 07:22 || 13:22
  paddedTwentyFourHourWithMinutes: /^(\d{2})(:)(\d{2})$/i,
  // 0722
  paddedTwentyFourHourWithMinutesNoColon: /^(\d{2})(\d{2})$/i,
  // 7:22
  twentyFourHourWithMinutes: /^(\d{1})(:)(\d{2})$/i,
};

// https://moment.github.io/luxon/#/parsing?id=table-of-tokens
const parsingKeys = {
  paddedTwelveHourWithMeridiem: "hh a",
  twelveHourWithMeridiem: "h a",
  paddedTwelveHourWithMeridiemAndMinutes: "hh:mm a",
  twelveHourWithMeridiemAndMinutes: "h:mm a",
  paddedTwentyFourHour: "HH",
  twentyFourHour: "H",
  paddedTwentyFourHourWithMinutes: "HH:mm",
  paddedTwentyFourHourWithMinutesNoColon: "HHmm",
  twentyFourHourWithMinutes: "H:mm",
};

export function isTwelveHourFormat(parsingKey: string) {
  return (
    parsingKey === parsingKeys.paddedTwelveHourWithMeridiem ||
    parsingKey === parsingKeys.twelveHourWithMeridiem ||
    parsingKey === parsingKeys.paddedTwelveHourWithMeridiemAndMinutes ||
    parsingKey === parsingKeys.twelveHourWithMeridiemAndMinutes
  );
}

export function getTimeFormat({ source, meridiem }: Params) {
  // trim so that if there's no meridiem, we don't get random whitespace.
  invariant(source, "Must provide a source");
  let fullTime;
  if (meridiem) {
    fullTime = `${source} ${meridiem}`.trim();
  } else fullTime = source.trim();

  // 12-hour time
  const [hours, minutes] = source.split(":").map((num) => parseInt(num));
  // 07 pm || 12 pm
  if (
    regexes.paddedTwelveHourWithMeridiem.test(fullTime) &&
    hours <= 12 &&
    minutes <= 59
  ) {
    return {
      parsingKey: parsingKeys.paddedTwelveHourWithMeridiem,
      formatKey: DateTime.TIME_SIMPLE,
    };
    // 7 pm
  } else if (
    regexes.twelveHourWithMeridiem.test(fullTime) &&
    hours <= 12 &&
    minutes <= 59
  ) {
    return {
      parsingKey: parsingKeys.twelveHourWithMeridiem,
      formatKey: DateTime.TIME_SIMPLE,
    };
    // 07:22 pm || 12:22 pm
  } else if (
    regexes.paddedTwelveHourWithMeridiemAndMinutes.test(fullTime) &&
    hours <= 12 &&
    minutes <= 59
  ) {
    return {
      parsingKey: parsingKeys.paddedTwelveHourWithMeridiemAndMinutes,
      formatKey: DateTime.TIME_SIMPLE,
    };
    // 7:22 pm
  } else if (
    regexes.twelveHourWithMeridiemAndMinutes.test(fullTime) &&
    hours <= 12 &&
    minutes <= 59
  ) {
    return {
      parsingKey: parsingKeys.twelveHourWithMeridiemAndMinutes,
      formatKey: DateTime.TIME_SIMPLE,
    };
  }

  // 24-hour time (aka military time)
  const militaryHours = parseInt(fullTime.slice(0, 2));
  const militaryMinutes = parseInt(fullTime.slice(2, fullTime.length));
  // 07 || 13
  if (
    regexes.paddedTwentyFourHour.test(fullTime) &&
    militaryHours <= 23 &&
    militaryMinutes <= 59
  ) {
    return {
      parsingKey: parsingKeys.paddedTwentyFourHour,
      formatKey: DateTime.TIME_24_SIMPLE,
    };
    // 7
  } else if (
    regexes.twentyFourHour.test(fullTime) &&
    militaryHours <= 23 &&
    militaryMinutes <= 59
  ) {
    return {
      parsingKey: parsingKeys.twentyFourHour,
      formatKey: DateTime.TIME_24_SIMPLE,
    };
    // 07:22 || 13:22
  } else if (
    regexes.paddedTwentyFourHourWithMinutes.test(fullTime) &&
    militaryHours <= 23 &&
    militaryMinutes <= 59
  ) {
    return {
      parsingKey: parsingKeys.paddedTwentyFourHourWithMinutes,
      formatKey: DateTime.TIME_24_SIMPLE,
    };
    // 0722 || 1322
  } else if (
    regexes.paddedTwentyFourHourWithMinutesNoColon.test(fullTime) &&
    militaryHours <= 23 &&
    militaryMinutes <= 59
  ) {
    return {
      parsingKey: parsingKeys.paddedTwentyFourHourWithMinutesNoColon,
      formatKey: DateTime.TIME_24_SIMPLE,
    };
    // 7:22
  } else if (
    regexes.twentyFourHourWithMinutes.test(fullTime) &&
    militaryHours <= 23 &&
    militaryMinutes <= 59
  ) {
    return {
      parsingKey: parsingKeys.twentyFourHourWithMinutes,
      formatKey: DateTime.TIME_24_SIMPLE,
    };
  }

  throw json(
    {
      error: "Your data wasn't in a recognized format",
      input: fullTime,
    },
    { status: 406 }
  );
}
