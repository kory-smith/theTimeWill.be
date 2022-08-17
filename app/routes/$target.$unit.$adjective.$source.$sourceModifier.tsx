import { json, LoaderArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { useCatch, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { getTimeFormat } from "~/helpers/getTimeFormat";

export const loader = ({ params }: LoaderArgs) => {
  //                       target | unit  | adjective | source | sourceModifier
  //                        ▼▼▼▼▼▼ ▼▼▼▼▼▼▼ ▼▼▼▼▼▼▼▼▼▼▼ ▼▼▼▼▼▼▼▼  ▼▼▼▼▼▼▼▼▼▼
  // https://theTimeWill.be/122   /minutes/before     /7:50    /pm
  const { target, unit, adjective, source, sourceModifier } = params;

  const { parsingKey, formatKey } = getTimeFormat(params);

  
  const trueSource = DateTime.fromFormat(`${source} ${sourceModifier}`.trim(), parsingKey);

  invariant(unit, "must be existing");

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
      <h1
        style={{
          font: "18px/26px 'Times New Roman',Times,FreeSerif,serif",
          fontFamily: "Montserrat,Arial,Helvetica,sans-serif",
          margin: 0,
          padding: 0,
          border: 0,
          outline: 0,
          clear: "both",
          lineHeight: "40px",
          fontStyle: "normal",
          letterSpacing: 0,
          paddingBottom: 0,
          marginRight: "30px",
          fontWeight: 900,
          float: "left",
        }}
      >
        <time>{data.source}</time>
      </h1>
      <h2
        style={{
          font: "18px/26px 'Times New Roman',Times,FreeSerif,serif",
          color: "#333",
          letterSpacing: 0,
          margin: 0,
          padding: 0,
          border: 0,
          outline: 0,
          clear: "both",
          direction: "ltr",
          zIndex: -1,
          float: "left",
          whiteSpace: "nowrap",
          position: "relative",
          fontFamily: "TimeTraveler,Arial,Helvetica,sans-serif",
          fontWeight: 400,
          fontSize: "131px",
          lineHeight: "91px",
          marginLeft: "67.5px",
        }}
      >
        It will be <time>{data.solution}</time>
      </h2>
    </>
  );
}

export function CatchBoundary() {
  const { data } = useCatch();
  return <p>{data.error}. Please provide a valid time. You provided {data.input}</p>
}