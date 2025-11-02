import { loadQuote } from "./quote.ts";
import {
	createSVG,
	type Image,
	loadImage,
	type Quote,
	saveSVG,
} from "./template.ts";

// get random quote
const quote: Quote = loadQuote("./src/assets/quotes.json");

// images to use
const image: Image = loadImage("iroh");

// The SVG content as a template literal
const svgContent = createSVG(image, quote);

// Write the SVG content to a file
saveSVG("quote-with-image.svg", svgContent);
