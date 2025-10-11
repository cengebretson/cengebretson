import { writeFileSync, readFileSync } from "node:fs";

const imagePath = "./my-image.png"; // Make sure this file exists
const quoteText = "The only way to do great work is to love what you do.";
const authorText = "— Steve Jobs";

// Function to convert an image to a Base64 data URI
function imageToBase64(filePath: string): string {
  const fileContent = readFileSync(filePath);
  const base64 = fileContent.toString("base64");
  const extension = filePath.split(".").pop();
  return `data:image/${extension};base64,${base64}`;
}

// Prepare image data
const imageDataUri = imageToBase64(imagePath);

// The SVG content as a template literal
const svgContent = `
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <!-- Define a pattern for the background image -->
  <defs>
    <pattern id="image" x="0" y="0" width="100%" height="100%" patternContentUnits="objectBoundingBox">
      <image x="0" y="0" width="1" height="1" preserveAspectRatio="xMidYMid slice" href="${imageDataUri}"/>
    </pattern>
  </defs>

  <!-- Create a full-size rectangle using the image pattern -->
  <rect width="100%" height="100%" fill="url(#image)"/>

  <!-- Apply a semi-transparent overlay to make the text more readable -->
  <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0.5)"/>

  <!-- The quote text -->
  <text x="50%" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="white" font-style="italic">
    <tspan x="50%" dy="-1.2em">${quoteText}</tspan>
    <tspan x="50%" dy="2em" font-size="18">${authorText}</tspan>
  </text>
</svg>
`;

// Write the SVG content to a file
try {
  writeFileSync("quote-with-image.svg", svgContent.trim());
  console.log("Successfully created quote-with-image.svg");
} catch (error) {
  console.error("Error writing SVG file:", error);
}
