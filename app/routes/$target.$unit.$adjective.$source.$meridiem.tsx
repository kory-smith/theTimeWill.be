import { json, LoaderArgs, redirect, MetaFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { useCatch, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { getTimeFormat, is24HourTime } from "~/helpers/timeFormatting";
import { generateMeta } from "~/helpers/generateMeta";
import { getPlusOrMinus } from "~/helpers/getPlusOrMinus";
import { getParams } from "remix-params-helper";
import { ParamsSchema } from "~/helpers/paramsSchema";

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

  const parsedParams = getParams(params, ParamsSchema);

  if (parsedParams.success) {
    const { target, unit, adjective, source, meridiem } = parsedParams.data;
    // If the target is 1 and we are using the plural (e.g. 1 minutes) redirect to singular
    if (target === 1 && unit[unit.length - 1] === "s") {
      return redirect(
        `/${target}/${unit.slice(0, unit.length - 1)}/${adjective}/${source}/${meridiem}`
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

    const plusOrMinus = getPlusOrMinus(adjective);

    const solution = trueSource[plusOrMinus]({ [unit]: target });

    return json({
      source: `What time will it be ${target} ${unit} ${adjective} ${trueSource.toFormat(
        parsingKey
      )}?`,
      solution: solution.toLocaleString(formatKey),
    });
  } else {
    throw json("Invalid URL params");
  }
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

export function CatchBoundary() {
  const { data } = useCatch();
  return (
    <p>
      {data.error}. Please provide a valid time. You provided {data.input}
    </p>
  );
}
