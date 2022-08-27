import { json, LoaderArgs, MetaFunction, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { Params, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { getTimeFormat } from "~/helpers/timeFormatting";
import { generateMeta } from "~/helpers/generateMeta";
import { getPlusOrMinus } from "~/helpers/getPlusOrMinus";

// This is the page for military time or 24-hour time
// https://theTimeWill.be/122/minutes/before/13:50/
// https://theTimeWill.be/122/minutes/before/1350/

export const meta: MetaFunction = ({ params, data }) => {
  const { title, description } = generateMeta({ params, data });
  return {
    title,
    description,
  };
};

export const loader = ({ params }: LoaderArgs) => {
  //                       target | unit  | adjective | source | meridiem
  //                        ▼▼▼▼▼▼ ▼▼▼▼▼▼▼ ▼▼▼▼▼▼▼▼▼▼▼ ▼▼▼▼▼▼▼▼  ▼▼▼▼▼▼▼▼▼▼
  // https://theTimeWill.be/122   /minutes/before     /7:50    /pm
  const { target, unit, adjective, source } = params;

  invariant(unit, "must be existing");
  invariant(source, "must be existing");
  invariant(target, "must be existing");
  invariant(adjective, "must exist")

  const { parsingKey, formatKey } = getTimeFormat(params);

  // If the target is 1 and we are using the plural (e.g. 1 minutes) redirect to singular
  if (parseInt(target) === 1 && unit[unit.length - 1] === "s") {
    return redirect(
      `/${target}/${unit.slice(0, unit.length - 1)}/${adjective}/${source}/`
    );
  }

  const trueSource = DateTime.fromFormat(source.trim(), parsingKey);

  const plusOrMinus = getPlusOrMinus(adjective)

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
      <h1>{data.source}</h1>
      <h2>
        It will be <time>{data.solution}</time>
      </h2>
    </>
  );
}
