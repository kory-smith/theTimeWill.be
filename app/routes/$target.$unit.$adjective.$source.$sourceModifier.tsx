import { json, LoaderArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";

// 07:30 pm || 7:30 PM
const localized = /^(\d{1,2})(:)(\d{1,2})(\ )(AM|PM)$/i;
// 19:30
const localized24 = /^(\d{1,2})(:)(\d{1,2})$/i;
// 1900 || 0730
const localized24NoColon = /^\d{4}$/i;
// 07 pm
const hoursOnly = /^\d{1,2}(\ )(AM|PM)$/i;

const localizedTimeKey = "t";
const localized24HourTimeKey = "T";

function getTimeFormat({ source, sourceModifier }: Params) {
  const combinedSource = `${source} ${sourceModifier}`;

  if (localized.test(combinedSource)) {
    return localizedTimeKey;
  } else if (localized24.test(combinedSource)) {
    return localized24HourTimeKey;
  }
}

export const loader = ({ params }: LoaderArgs) => {
  //                       target | unit  | adjective | source | sourceModifier
  //                        ▼▼▼▼▼▼ ▼▼▼▼▼▼▼ ▼▼▼▼▼▼▼▼▼▼▼ ▼▼▼▼▼▼▼▼  ▼▼▼▼▼▼▼▼▼▼
  // https://theTimeWill.be/122   /minutes/before     /7:50    /pm
  const { target, unit, adjective, source, sourceModifier } = params;

  const trueSource = DateTime.fromFormat(`${source} ${sourceModifier}`, "t");

  invariant(unit, "must be existing");

  const plusOrMinus = "plus";

  const solution = trueSource[plusOrMinus]({ [unit]: target });

  return json({
    source: `What time will it be ${target} ${unit} ${adjective} ${trueSource.toLocaleString(
      DateTime.TIME_SIMPLE
    )}?`,
    solution: solution.toLocaleString(DateTime.TIME_SIMPLE),
  });
};

export default function Example() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <h1>{data.source}</h1>
      <br />
      <h2>It will be {data.solution}</h2>
    </>
  );
}
