import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";
import { ActionArgs, MetaFunction, redirect } from "@remix-run/node";
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
	title: "New Remix App",
	viewport: "width=device-width,initial-scale=1",
});

export const links = () => {
	return [{ rel: "stylesheet", href: styles }];
};

function Footer() {
	return (
		<footer className="bg-black text-white text-center py-4">
			Made with ❤️️ by{" "}
			<a
				href="https://github.com/kory-smith"
				className="underline"
			>
				Kory Smith
			</a>
		</footer>
	);
}

export default function App() {
	return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="font-avenir flex flex-col min-h-screen">
        <main className="m-16 flex-grow">
          <ValidatedForm validator={validator} resetAfterSubmit method="post">
            <h2 className="text-3xl">What time will it be...</h2>

            <div className="my-4">
              <input
                type="number"
                name="target"
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm inline-block text-sm font-medium text-gray-700 mx-8"
                placeholder="122"
              />

              <input
                list="units"
                autoComplete="on"
                name="unit"
                placeholder="minute(s)"
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm inline-block text-sm font-medium text-gray-700 mx-8"
              />
              <datalist id="units">
                <option value="second(s)" />
                <option value="minute(s)" />
                <option value="hour(s)" />
              </datalist>

              <input
                list="adjectives"
                name="adjective"
                placeholder="before"
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm inline-block text-sm font-medium text-gray-700"
              />
              <datalist id="adjectives">
                <option value="before" />
                <option value="after" />
              </datalist>

              <input
                type="time"
                name="source"
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm inline-block text-sm font-medium text-gray-700 mx-8"
              />

              <button
                type="submit"
                className="inline-flex items-center rounded-md border border-gray-300 bg-blue-500 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Go
              </button>
            </div>
          </ValidatedForm>
          <hr className="m-2" />
          <Outlet />
        </div>
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
