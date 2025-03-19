import { expect, test, describe } from "bun:test";
import { generateMeta } from "$lib/generateMeta"; 

describe("generateMeta", () => {
  // Test basic functionality without meridiem
  test("should generate correct title and description without meridiem", () => {
    const meta = generateMeta({
      solution: "Lunch Time",
      target: 2,
      unit: "hours",
      adjective: "after",
      source: "breakfast"
    });

    expect(meta.title).toBe("Lunch Time | 2 hours after breakfast ");
    expect(meta.description).toBe("It'll be Lunch Time 2 hours after breakfast");
  });

  // Test with meridiem included
  test("should include uppercase meridiem in title when provided", () => {
    const meta = generateMeta({
      solution: "8:00",
      target: 30,
      unit: "minutes",
      adjective: "before",
      source: "meeting",
      meridiem: "am"
    });

    expect(meta.title).toBe("8:00 | 30 minutes before meeting AM");
    expect(meta.description).toBe("It'll be 8:00 30 minutes before meeting");
  });

  // Test with different units
  test("should work with different time units", () => {
    const meta = generateMeta({
      solution: "Dinner",
      target: 1,
      unit: "day",
      adjective: "from",
      source: "now"
    });

    expect(meta.title).toBe("Dinner | 1 day from now ");
    expect(meta.description).toBe("It'll be Dinner 1 day from now");
  });

  // Test with single character meridiem
  test("should handle single character meridiem correctly", () => {
    const meta = generateMeta({
      solution: "5:45",
      target: 15,
      unit: "minutes",
      adjective: "until",
      source: "class",
      meridiem: "p"
    });

    expect(meta.title).toBe("5:45 | 15 minutes until class P");
    expect(meta.description).toBe("It'll be 5:45 15 minutes until class");
  });

  // Test with numeric values for solution
  test("should handle numeric values for solution", () => {
    const meta = generateMeta({
      solution: "12:30",
      target: 90,
      unit: "minutes",
      adjective: "after",
      source: "start",
      meridiem: "pm"
    });

    expect(meta.title).toBe("12:30 | 90 minutes after start PM");
    expect(meta.description).toBe("It'll be 12:30 90 minutes after start");
  });
});