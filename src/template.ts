import { readFileSync, writeFileSync } from "node:fs";

// quote format
export interface Quote {
	quote: string;
	author: string;
}

// image format
export interface Image {
	light: string;
	dark: string;
}

export const createSVG = (image: Image, quote: Quote): string => {
	return `<?xml version="1.0" encoding="utf-8"?>
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
    <image class="imageDark" width="160" height="160" href="${image.dark}"/>
    <image class="imageLight" width="160" height="160" href="${image.light}"/>
  </g>

  <!-- Right text area -->
  <g transform="translate(225,36)">

    <!-- Quote block - use tspans for manual line breaks / wrapping -->
    <text class="quote" x="0" y="20">
      ${renderQuoteTspan(quote.quote).join("\n")}
      <!-- Author -->
      <tspan class="author" x="0" dy="2.5em">— ${quote.author}</tspan>
    </text>

  </g>

  <!-- Decorative separator line -->
  <line class="vertLine" x1="200" y1="30" x2="200" y2="170" stroke-width="1" opacity="0.2"/>
</svg>
`;
};

export function renderQuoteTspan(quote: string): string[] {
	const quoteLines: string[] = [];

	const appendLine = (line: string) => {
		const dy: string = quoteLines.length === 0 ? "0" : "1.3em";
		const tspan = `<tspan x="0" dy="${dy}">${line}</tspan>`;
		quoteLines.push(tspan);
	};

	while (quote.length > 80) {
		const spaceIndex: number = quote.indexOf(" ", 80);
		if (spaceIndex !== -1) {
			const line = quote.substring(0, spaceIndex);
			appendLine(line);
			quote = quote.substring(spaceIndex + 1);
		} else {
			break;
		}
	}

	appendLine(quote);
	return quoteLines;
}

export function imageToBase64(filePath: string): string {
	const fileContent = readFileSync(filePath);
	const base64 = fileContent.toString("base64");
	const extension = filePath.split(".").pop();
	return `data:image/${extension};base64,${base64}`;
}

export function loadImage(name: string): Image {
	const imageDark = `./src/assets/${name}_dark.png`;
	const imageLight = `./src/assets/${name}_light.png`;

	// Prepare image data
	const imageDataUriDark = imageToBase64(imageDark);
	const imageDataUriLight = imageToBase64(imageLight);

	return {
		light: imageDataUriLight,
		dark: imageDataUriDark,
	};
}

export function saveSVG(name: string, content: string) {
	try {
		writeFileSync(name, content);
		console.log("Successfully created quote-with-image.svg");
	} catch (error) {
		console.error("Error writing SVG file:", error);
	}
}
