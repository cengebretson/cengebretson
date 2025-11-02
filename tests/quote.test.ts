import { afterAll, beforeAll, describe, expect, mock, test } from "bun:test";
import { defaultQuote, loadQuote, readJsonFile } from "../src/quote.ts";

beforeAll(() => {
	mock.module("node:fs", () => ({
		readFileSync: mock((path: string) => {
			if (path.includes("quotes.json")) {
				return Buffer.from(
					JSON.stringify([
						{ quote: "Test quote 1", author: "Author 1" },
						{ quote: "Test quote 2", author: "Author 2" },
					]),
				);
			}
			throw new Error("File not found");
		}),
	}));
});

afterAll(() => {
	mock.restore();
});

describe("readme.ts", () => {
	describe("readJsonFile", () => {
		test("should read and parse JSON file", () => {
			const result = readJsonFile("quotes.json");
			expect(result).toBeArray();
			expect(result).toHaveLength(2);
			expect(result[0]?.quote).toBe("Test quote 1");
			expect(result[0]?.author).toBe("Author 1");
		});

		test("should throw error for invalid file", () => {
			expect(() => readJsonFile("invalid.json")).toThrow("File not found");
		});
	});

	describe("loadQuote", () => {
		test("should return random quote from file", () => {
			const result = loadQuote("quotes.json");
			expect(result).toBeObject();
			expect(result).toContainKeys(["quote", "author"]);
			const quotes = ["Test quote 1", "Test quote 2"];
			expect(quotes).toContain(result.quote);
		});

		test("should return default quote on error", () => {
			const result = loadQuote("invalid.json");
			expect(result).toEqual(defaultQuote);
		});

		test("should return default quote for empty array", () => {
			mock.module("node:fs", () => ({
				readFileSync: mock(() => Buffer.from(JSON.stringify([]))),
			}));

			const result = loadQuote("empty.json");
			expect(result).toEqual(defaultQuote);
		});
	});

	describe("defaultQuote", () => {
		test("should have correct structure", () => {
			expect(defaultQuote).toEqual({
				quote: "Where ever you go, there you are",
				author: "me",
			});
		});
	});
});
