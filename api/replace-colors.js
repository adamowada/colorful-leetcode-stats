export default async function handler(req, res) {
  // Fetch the SVG from the Leetcode Stats API
  try {
    const svgResponse = await fetch(
      `https://leetcard.jacoblin.cool/${req.query.username}?border=2&radius=5`
    );
    let svgContent = await svgResponse.text();

    // Define the color keys in the query string for backgrounds, texts, and colors
    const colorMapping = {
      'bg-0': req.query['bg-0'],
      'bg-1': req.query['bg-1'],
      'bg-2': req.query['bg-2'],
      'bg-3': req.query['bg-3'],
      'text-0': req.query['text-0'],
      'text-1': req.query['text-1'],
      'text-2': req.query['text-2'],
      'text-3': req.query['text-3'],
      'color-0': req.query['color-0'],
      'color-1': req.query['color-1'],
      'color-2': req.query['color-2'],
      'color-3': req.query['color-3'],
    };

    // Modify the SVG colors by replacing the specific color codes
    const modifiedSvgContent = svgContent.replace(
      /--(bg|text|color)-\d:#[0-9a-fA-F]{3,6}/g,
      (match) => {
        const colorKey = match.match(/--(bg|text|color)-\d/)[0];
        const newColor = colorMapping[colorKey.replace('--', '')]; // Get the new color from query
        return newColor ? `${colorKey}:#${newColor}` : match; // If color is passed, replace it, else keep the original
      }
    );

    // Set the content type as SVG and send the modified SVG back
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(modifiedSvgContent);
  } catch (error) {
    console.error("Error fetching SVG:", error);
    res.status(500).send('There was an error.');
  }
}
