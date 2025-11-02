import { readFileSync } from "node:fs";
import type { Quote } from "./template.ts";

// Function to read file and convert to json object
export function readJsonFile(filePath: string): Quote[] {
	const fileContent = readFileSync(filePath);
	return JSON.parse(fileContent.toString());
}

// default quote in case loading fails
export const defaultQuote: Quote = {
	quote: "Where ever you go, there you are",
	author: "me",
};

// Function to load quotes from file
export function loadQuote(filePath: string): Quote {
	try {
		const quotes: Quote[] = readJsonFile(filePath);
		const randomIndex = Math.floor(Math.random() * quotes.length);
		return quotes[randomIndex] ? quotes[randomIndex] : defaultQuote;
	} catch (error) {
		console.error("Error reading or parsing quotes.json:", error);
		return defaultQuote;
	}
}
