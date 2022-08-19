import type { ActionArgs, MetaFunction } from "@remix-run/node";
import {
  Form,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

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
        <Form method="post">
          <p>What time is it...</p>

          <input type="number" name="target" placeholder="122" />

          <input list="units" name="unit" placeholder="minutes" />
          <datalist id="units">
            <option value="second(s)"></option>
            <option value="minute(s)"></option>
            <option value="hour(s)"></option>
          </datalist>

          <input list="adjectives" name="adjective" placeholder="before" />
          <datalist id="adjectives">
            <option value="before"></option>
            <option value="after"></option>
          </datalist>

          <input type="time" name="source" value="19:55" />

          <button type="submit">Go</button>
        </Form>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  return null;
};
