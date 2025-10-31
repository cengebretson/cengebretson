import { readFileSync, writeFileSync } from "node:fs";

// quote format
interface Quote {
	quote: string;
	author: string;
}

// Function to convert an image to a Base64 data URI
function imageToBase64(filePath: string): string {
	const fileContent = readFileSync(filePath);
	const base64 = fileContent.toString("base64");
	const extension = filePath.split(".").pop();
	return `data:image/${extension};base64,${base64}`;
}

// Function to read file and convert to json object
function readJsonFile(filePath: string): Quote[] {
	const fileContent = readFileSync(filePath);
	const quotes: Quote[] = JSON.parse(fileContent.toString());
	return quotes;
}

// Function to load quotes from file
function loadQuotes(filePath: string): Quote[] {
	try {
		return readJsonFile(filePath);
	} catch (error) {
		console.error("Error reading or parsing quotes.json:", error);
	}
	return [{ quote: "Where ever you go, there you are", author: "me" }];
}

function renderQuoteTspan(quote: string): string {
	const quoteLines: string[] = [];

	const appendLine = (line: string) => {
		const dy: string = quoteLines.length === 0 ? "0" : "1.3em";
		const tspan = `<tspan x="0" dy="${dy}">${line}</tspan>\n`;
		quoteLines.push(tspan);
	};

	while (quote.length > 80) {
		const spaceIndex: number = quoteText.indexOf(" ", 80);
		if (spaceIndex !== -1) {
			const line = quote.substring(0, spaceIndex);
			appendLine(line);
			quote = quote.substring(spaceIndex + 1);
		} else {
			break;
		}
	}

	appendLine(quote);
	return quoteLines.join("");
}

// get random quote
const quotes = loadQuotes("./src/assets/quotes.json");
const randomIndex = Math.floor(Math.random() * quotes.length);
const quoteText = quotes[randomIndex]?.quote ?? "";
const authorText = quotes[randomIndex]?.author;

// images to use
const imageDark = "./src/assets/iroh_dark.png";
const imageLight = "./src/assets/iroh_light.png";

// Prepare image data
const imageDataUriDark = imageToBase64(imageDark);
const imageDataUriLight = imageToBase64(imageLight);

// The SVG content as a template literal
const svgContent = `
<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="900" height="200" viewBox="0 0 900 200" role="img" aria-label="Banner with image and quote">
  <defs>
    <style>
      .imageDa6rk { display: inline }
      .imageLight { display: none }
      .bg { fill: none; }
      .card { rx: 14; ry: 14; }
      .quote { white-space: "pre", font-family: "Helvetica Neue", Arial, sans-serif; font-size: 20px; fill: #cccccc; font-weight: 500; }
      .author { font-family: "Helvetica Neue", Arial, sans-serif; font-size: 14px; fill: #aaaaaa; font-weight: 600; }
      .vertLine { stroke: #e6eef6 } 

      @media (prefers-color-scheme: light) {
        .imageDark { display: none }
        .imageLight { display: inline }
        .quote { fill: #555555 }
        .author { fill: #333333 }
        .vertLine { stroke: #232323 } 
      }
    </style>
  </defs>

  <!-- Background card -->
  <rect class="bg card" x="8" y="8" width="884" height="184" stroke="transparent" />

  <!-- Left image area (embedded base64 image) -->
  <g transform="translate(30,20)">
    <!-- Base64-embedded SVG image (example avatar) -->
    <image class="imageDark" width="160" height="160" href="${imageDataUriDark}"/>
    <image class="imageLight" width="160" height="160" href="${imageDataUriLight}"/>
  </g>

  <!-- Right text area -->
  <g transform="translate(225,36)">

    <!-- Quote block - use tspans for manual line breaks / wrapping -->
    <text class="quote" x="0" y="20">
      ${renderQuoteTspan(quoteText)}
      <!-- Author -->
      <tspan class="author" x="0" dy="2.5em">— ${authorText}</tspan>
    </text>

  </g>

  <!-- Decorative separator line -->
  <line class="vertLine" x1="200" y1="30" x2="200" y2="170" stroke-width="1" opacity="0.2"/>

</svg>
`;

// Write the SVG content to a file
try {
	writeFileSync("quote-with-image.svg", svgContent.trim());
	console.log("Successfully created quote-with-image.svg");
} catch (error) {
	console.error("Error writing SVG file:", error);
}
