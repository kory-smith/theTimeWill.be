import { json, LoaderArgs, redirect, MetaFunction } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { getTimeFormat } from "~/helpers/timeFormatting";
import { generateMeta } from "~/helpers/generateMeta";
import { getPlusOrMinus } from "~/helpers/getPlusOrMinus";
import { getParams } from "remix-params-helper";
import { ParamsSchema } from "~/helpers/paramsSchema";
import { getOffset } from "~/helpers/getOffset";
import { useState } from "react";

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

export const loader = ({ params, request }: LoaderArgs) => {
  //                       target | unit  | adjective | source | meridiem
  //                        ▼▼▼▼▼▼ ▼▼▼▼▼▼▼ ▼▼▼▼▼▼▼▼▼▼▼ ▼▼▼▼▼▼▼▼  ▼▼▼▼▼▼▼▼▼▼
  // https://theTimeWill.be/122   /minutes/before     /7:50    /pm

  const parsedParams = getParams(params, ParamsSchema);

  const currentURL = new URL(request.url);
  const hasMeridiem =
    currentURL.pathname.match(/(am|a\.m\.|pm|p\.m\.)/i)?.length > 0;

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

    const { parsingKey, formatKey } = getTimeFormat(params);

    const dateTimeText = hasMeridiem ? `${source} ${meridiem}` : source;
    const trueSource = DateTime.fromFormat(dateTimeText, parsingKey);

    const plusOrMinus = getPlusOrMinus(adjective);

    const solution = trueSource[plusOrMinus]({ [unit]: target });

    const offset = getOffset(trueSource, solution);

    return json({
      source: `What time will it be ${target} ${unit} ${adjective} ${trueSource.toFormat(
        parsingKey
      )}?`,
      solution: solution.toLocaleString(formatKey),
      offset,
    });
  } else {
    throw json("Invalid URL params");
  }
};

const ClipboardSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-14 h-14 inline mx-auto my-auto"
  >
    <path
      fillRule="evenodd"
      d="M15.988 3.012A2.25 2.25 0 0118 5.25v6.5A2.25 2.25 0 0115.75 14H13.5V7A2.5 2.5 0 0011 4.5H8.128a2.252 2.252 0 011.884-1.488A2.25 2.25 0 0112.25 1h1.5a2.25 2.25 0 012.238 2.012zM11.5 3.25a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v.25h-3v-.25z"
      clipRule="evenodd"
    />
    <path
      fillRule="evenodd"
      d="M2 7a1 1 0 011-1h8a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V7zm2 3.25a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm0 3.5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z"
      clipRule="evenodd"
    />
  </svg>
);

const CopySolution = ({ solution }: { solution: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(solution);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <button
      onClick={copyToClipboard}
    >
      {copied ? 
      <p className="text-5xl mx-auto my-auto">Copied!</p>
      : <ClipboardSVG />}
    </button>
  );
};

export default function Example() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="my-8">
      <h1 className="text-3xl">{data.source}</h1>
      <h2 className="font-kory text-massive inline">
        It'll be <time className="text-blue-500">{data.solution}</time>
        <CopySolution solution={data.solution} />
        {data.offset ? ` ${data.offset}` : null}
      </h2>
    </div>
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
  } else {
    return (
      <p>
        {data.error}. Please provide a valid time. You provided {data.input}
      </p>
    );
  }
}
