import { ValidatedForm } from "remix-validated-form";
import type { Validator } from "remix-validated-form";

export function TimeForm({ validator }: { validator: Validator<any> }) {
  return (
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
  );
}
