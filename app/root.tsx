import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import { ActionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Footer } from "./components/Footer";
import { TimeForm } from "./components/TimeForm";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import { DateTime } from "luxon";
import styles from "./styles/app.css";

export const validator = withZod(
	z.object({
		target: z.string(),
		unit: z.enum([
			"second(s)",
			"minute(s)",
			"hour(s)",
			"seconds",
			"minutes",
			"hours",
			"second",
			"minute",
			"hour",
		]),
		adjective: z.enum(["before", "after"]),
		source: z.string(),
	}),
);

export const meta: MetaFunction = () => ({
	charset: "utf-8",
	title: "theTimeWill.be",
	description: "Find out what time it will be a certain number of minutes or hours in the past or future!",
	viewport: "width=device-width,initial-scale=1",
});

export const links = () => {
	return [{ rel: "stylesheet", href: styles }];
};

export default function App() {
	return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="font-avenir flex flex-col min-h-screen">
        <main className="m-16 flex-grow">
          <TimeForm validator={validator} />
          <hr className="m-2" />
          <Outlet />
        </main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export const action = async ({ request }: ActionArgs) => {
	const formData = await validator.validate(await request.formData());

	if (formData.error) {
		return validationError(formData.error);
	}

	const { adjective, source, target, unit } = formData.data;

	const unitWithoutParens = unit.replace(/(\(|\))/g, "");

	const sourceDT = DateTime.fromFormat(source, "HH:mm");

	const [twelveHourTime, meridiem] = sourceDT
		.toLocaleString(DateTime.TIME_SIMPLE)
		.split(" ");

	return redirect(
		`/${target}/${unitWithoutParens}/${adjective}/${twelveHourTime}/${meridiem.toLowerCase()}`,
	);
};
