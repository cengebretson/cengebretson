import { afterAll, beforeAll, describe, expect, mock, test } from "bun:test";
import { writeFileSync } from "node:fs";
import {
	createSVG,
	type Image,
	imageToBase64,
	loadImage,
	type Quote,
	renderQuoteTspan,
	saveSVG,
} from "../src/template.ts";

// Mock file system operations
beforeAll(() => {
	mock.module("node:fs", () => ({
		readFileSync: mock((path: string) => {
			if (path.includes("test.png")) {
				return Buffer.from("test image content");
			}
			throw new Error("File not found");
		}),
		writeFileSync: mock(() => {}),
	}));
});

afterAll(() => {
	mock.restore();
});

describe("template.ts", () => {
	describe("renderQuoteTspan", () => {
		test("should handle short quotes", () => {
			const result = renderQuoteTspan("Short quote");
			expect(result).toHaveLength(1);
			expect(result[0]).toContain("Short quote");
		});

		test("should break long quotes into multiple lines", () => {
			const longQuote =
				"This is a very long quote that should be broken into multiple lines because it exceeds the character limit for a single line in the SVG template";
			const result = renderQuoteTspan(longQuote);
			expect(result.length).toBeGreaterThan(1);
			result.forEach((line) => {
				expect(line).toContain("tspan");
			});
		});

		test("should handle quotes with exact break points", () => {
			const quote = "a".repeat(85);
			const result = renderQuoteTspan(quote);
			expect(result.length).toEqual(1);
		});
	});

	describe("createSVG", () => {
		const testImage: Image = {
			light: "data:image/png;base64,dGVzdCBpbWFnZSBjb250ZW50",
			dark: "data:image/png;base64,dGVzdCBpbWFnZSBjb250ZW50",
		};

		const testQuote: Quote = {
			quote: "Test quote",
			author: "Test Author",
		};

		test("should generate valid SVG content", () => {
			const svg = createSVG(testImage, testQuote);
			expect(svg).toContain("<svg");
			expect(svg).toContain("xmlns");
			expect(svg).toContain("Test quote");
			expect(svg).toContain("Test Author");
		});

		test("should include both light and dark theme images", () => {
			const svg = createSVG(testImage, testQuote);
			expect(svg).toContain("imageDark");
			expect(svg).toContain("imageLight");
		});

		test("should include media query for theme switching", () => {
			const svg = createSVG(testImage, testQuote);
			expect(svg).toContain("prefers-color-scheme");
		});
	});

	describe("imageToBase64", () => {
		test("should convert image to base64 data URI", () => {
			const result = imageToBase64("test.png");
			expect(result).toContain("data:image/png;base64");
			expect(result).toContain("dGVzdCBpbWFnZSBjb250ZW50");
		});
	});

	describe("loadImage", () => {
		test("should load both light and dark variants", () => {
			const image = loadImage("test.png");
			expect(image.light).toContain("data:image/png;base64");
			expect(image.dark).toContain("data:image/png;base64");
		});
	});

	describe("saveSVG", () => {
		test("should call writeFileSync with correct parameters", () => {
			const content = "<svg>test</svg>";
			saveSVG("test.svg", content);
			expect(writeFileSync).toHaveBeenCalledWith("test.svg", content);
		});
	});
});
