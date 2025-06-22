import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3001;

// Serve static HTML files from public directory
app.get('/preview-genspark', (req, res) => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'test-genspark-design.html');
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
  } catch (error) {
    res.status(404).send('<h1>Test file not found</h1><p>Make sure test-genspark-design.html exists in the public folder.</p>');
  }
});

app.listen(port, () => {
  console.log(`Preview server running at http://localhost:${port}`);
});