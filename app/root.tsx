import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";
import { ActionArgs, MetaFunction, redirect } from "@remix-run/node";
import {
  Form,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { DateTime } from "luxon";

export const validator = withZod(
  z.object({
    target: z.string(),
    unit: z.string(),
    adjective: z.string(),
    source: z.string(),
  })
);

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ValidatedForm validator={validator} method="post">
          <p>What time will it be...</p>

          <input type="number" name="target" placeholder="122" />

          <input list="units" name="unit" placeholder="minutes" />
          <datalist id="units">
            <option value="seconds"></option>
            <option value="minutes"></option>
            <option value="hours"></option>
          </datalist>

          <input list="adjectives" name="adjective" placeholder="before" />
          <datalist id="adjectives">
            <option value="before"></option>
            <option value="after"></option>
          </datalist>

          <input type="time" name="source" />

          <button type="submit">Go</button>
        </ValidatedForm>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await validator.validate(await request.formData());

  if (formData.error) return validationError(formData.error);

  const { adjective, source, target, unit } = formData.data

  const sourceDT = DateTime.fromFormat(source, "HH:mm")

  const [twelveHourTime, meridiem] = sourceDT.toLocaleString(DateTime.TIME_SIMPLE).split(" ")

  return redirect(`/${target}/${unit}/${adjective}/${twelveHourTime}/${meridiem}`);
};
