const fs = require('fs');
const path = require('path');

app.get('/api/file', (req, res) => {
  const filePath = path.join(process.cwd(), 'files', 'myfile.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  res.json(JSON.parse(content));
});
