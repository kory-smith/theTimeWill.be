import { json, LoaderArgs, MetaFunction, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { Params, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { getTimeFormat } from "~/helpers/timeFormatting";
import { generateMeta } from "~/helpers/generateMeta";
import { getPlusOrMinus } from "~/helpers/getPlusOrMinus";
export * from "../$target.$unit.$adjective.$source.$meridiem";
export { default } from "../$target.$unit.$adjective.$source.$meridiem";

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
