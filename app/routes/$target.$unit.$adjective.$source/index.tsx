import { json, LoaderArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { Params, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";

// This is the page for military time or 24-hour time
// https://theTimeWill.be/122/minutes/before/13:50/
// https://theTimeWill.be/122/minutes/before/1350/


const t = /^(\d{1,2})(:)(\d{1,2})(\ )(AM|PM)$/i
const T = /^(\d{1,2})(:)(\d{1,2})$/i

function getTimeFormat(params: Params) {
  const { target, unit, adjective, source, meridian } = params;

//  console.log( DateTime.fromFormatExplain(`${source} ${meridian}`, "T"))
 console.log( t.test(`${source} ${meridian}`))



}

export const loader = ({ params }: LoaderArgs) => {
  //                       target | unit  | adjective | source | meridian
  //                        ▼▼▼▼▼▼ ▼▼▼▼▼▼▼ ▼▼▼▼▼▼▼▼▼▼▼ ▼▼▼▼▼▼▼▼  ▼▼▼▼▼▼▼▼▼▼
  // https://theTimeWill.be/122   /minutes/before     /7:50    /pm
  const { target, unit, adjective, source } = params;

  getTimeFormat(params)

 /*  
 What types of times can we have?
 24 hour time - 2130
 7/pm
 07/pm
 7:56/pm
 07:56/pm
 */
  // https://moment.github.io/luxon/#/parsing?id=table-of-tokens
  const trueSource = DateTime.fromFormat(`${source}`, "T");



  invariant(unit, "must be existing");

  const plusOrMinus = adjective === "past" ? "plus" : "minus"

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
