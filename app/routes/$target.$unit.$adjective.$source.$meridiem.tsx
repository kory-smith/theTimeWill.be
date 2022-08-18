import { json, LoaderArgs, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { useCatch, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { getTimeFormat, is24HourTime } from "~/helpers/timeFormatting";

export const loader = ({ params }: LoaderArgs) => {
  //                       target | unit  | adjective | source | meridiem
  //                        ▼▼▼▼▼▼ ▼▼▼▼▼▼▼ ▼▼▼▼▼▼▼▼▼▼▼ ▼▼▼▼▼▼▼▼  ▼▼▼▼▼▼▼▼▼▼
  // https://theTimeWill.be/122   /minutes/before     /7:50    /pm
  const { target, unit, adjective, source, meridiem } = params;

  invariant(unit, "must be existing");
  invariant(source, "must be existing");
  invariant(target, "must be existing");

  // If the target is 1 and we are using the plural (e.g. 1 minutes) redirect to singular
  if (parseInt(target) === 1 && unit[unit.length - 1] === "s") {
    return redirect(
      `/${target}/${unit.slice(0, unit.length - 1)}/${adjective}/${source}/`
    );
  }

  if (is24HourTime(source)) {
    return redirect(`/${target}/${unit}/${adjective}/${source}/`);
  }

  const { parsingKey, formatKey } = getTimeFormat(params);

  const trueSource = DateTime.fromFormat(
    `${source} ${meridiem}`.trim(),
    parsingKey
  );

  const plusOrMinus = adjective === "past" ? "plus" : "minus";

  const solution = trueSource[plusOrMinus]({ [unit]: target });

  return json({
    source: `What time will it be ${target} ${unit} ${adjective} ${trueSource.toFormat(
      parsingKey
    )}?`,
    solution: solution.toLocaleString(formatKey),
  });
};

export default function Example() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <h1>
        <time>{data.source}</time>
      </h1>
      <h2>
        It will be <time>{data.solution}</time>
      </h2>
    </>
  );
}

export function CatchBoundary() {
  const { data } = useCatch();
  return (
    <p>
      {data.error}. Please provide a valid time. You provided {data.input}
    </p>
  );
}
