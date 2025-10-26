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

// get random quote
const quotes = loadQuotes("./assets/quotes.json");
const randomIndex = Math.floor(Math.random() * quotes.length);
const quoteText = quotes[randomIndex]?.quote;
const authorText = quotes[randomIndex]?.author;

// images to use
const imageDark = "./assets/iroh_dark.png";
const imageLight = "./assets/iroh_light.png";

// Prepare image data
const imageDataUriDark = imageToBase64(imageDark);
const imageDataUriLight = imageToBase64(imageLight);

// The SVG content as a template literal
const svgContent = `
<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="900" height="200" viewBox="0 0 900 200" role="img" aria-label="Banner with image and quote">
  <defs>
    <stcle>
      .bg { fill: #ffffff; }
      .card { rx: 14; ry: 14; }
      .quote { font-family: "Helvetica Neue", Arial, sans-serif; font-size: 20px; fill: #111827; font-weight: 500; }
      .author { font-family: "Helvetica Neue", Arial, sans-serif; font-size: 14px; fill: #6b7280; font-weight: 600; }
      .kicker { font-family: "Helvetica Neue", Arial, sans-serif; font-size: 12px; fill: #9ca3af; text-transform: uppercase; letter-spacing: 0.08em; }
    </style>
  </defs>

  <!-- Background card -->
  <rect class="bg card" x="8" y="8" width="884" height="184" fill="#f8fafc" stroke="#e6eef6" stroke-width="1" />

  <!-- Left image area (embedded base64 image) -->
  <!-- Replace the data URI below with your own base64 image if desired -->
  <g transform="translate(30,20)">
    <!-- Base64-embedded SVG image (example avatar) -->
    <image width="160" height="160" href="${imageDataUriLight}"/>
  </g>

  <!-- Right text area -->
  <g transform="translate(210,36)">
    <!-- optional small label / kicker -->
    <text class="kicker" x="0" y="0">Featured quote</text>

    <!-- Quote block - use tspans for manual line breaks / wrapping -->
    <text class="quote" x="0" y="34">
      <tspan x="0" dy="0">${quoteText}</tspan>
    </text>

    <!-- Author -->
    <text class="author" x="0" y="100">— ${authorText}</text>
  </g>

  <!-- Decorative separator line -->
  <line x1="200" y1="30" x2="200" y2="170" stroke="#e6eef6" stroke-width="2" opacity="0.9"/>

</svg>
`;

// Write the SVG content to a file
try {
	writeFileSync("quote-with-image.svg", svgContent.trim());
	console.log("Successfully created quote-with-image.svg");
} catch (error) {
	console.error("Error writing SVG file:", error);
}
