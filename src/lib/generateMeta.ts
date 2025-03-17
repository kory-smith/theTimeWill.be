import type { AppData } from "@remix-run/node";
import type { Params } from "@remix-run/react";

export function generateMeta({
	data,
	params,
}: {
	data: AppData;
	params: Params;
}) {
	return {
    title: `It'll be ${data.solution} | ${params.target} ${params.unit} ${ params.adjective } ${params.source} ${params.meridiem ? params.meridiem.toUpperCase() : ""}`,
		description: `It'll be ${data.solution} ${params.target} ${params.unit} ${params.adjective} ${params.source}`,
	};
}
