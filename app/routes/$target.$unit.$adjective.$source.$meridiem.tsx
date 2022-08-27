import { json, LoaderArgs, redirect, MetaFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { useCatch, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { getTimeFormat, is24HourTime } from "~/helpers/timeFormatting";
import { generateMeta } from "~/helpers/generateMeta";
import { getPlusOrMinus } from "~/helpers/getPlusOrMinus";
import { getParams } from "remix-params-helper";
import { ParamsSchema } from "~/helpers/paramsSchema";
import { getOffset } from "~/helpers/getOffset";

export const meta: MetaFunction = ({ params, data }) => {
  if (!data) {
    return {
      title: "Invalid",
      description: "Invalid",
    };
  }
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
    const unitLastLetter = unit[unit.length - 1];
    if (target === 1 && unitLastLetter === "s") {
      const unitSingular = unit.slice(0, unit.length - 1);
      return redirect(
        `/${target}/${unitSingular}/${adjective}/${source}/${meridiem}`
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

    const offset = getOffset(trueSource, solution)


    return json({
      source: `What time will it be ${target} ${unit} ${adjective} ${trueSource.toFormat(
        parsingKey
      )}?`,
      solution: solution.toLocaleString(formatKey),
      offset
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
        {data.offset ? ` ${data.offset}` : null}
      </h2>
    </>
  );
}

export function CatchBoundary() {
  const { data } = useCatch();
  // this means the error came from the url search params
  if (data === "Invalid URL params") {
    return (
      <p>
        The params are wrong. Please input valid params. An example of a valid
        URL is https://theTimeWill.be/12/minutes/after/1:20/pm
      </p>
    );
    // This means the error came from the form
  } else
    return (
      <p>
        {data.error}. Please provide a valid time. You provided {data.input}
      </p>
    );
}
