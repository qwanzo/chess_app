const express = require('express');
const path = require('path');

const app = express();
const PORT = 5500;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Chess app server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Chess app server is running on http://localhost:${PORT}`);
  console.log(`Press Ctrl+C to stop the server`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Error: Port ${PORT} is already in use.`);
    console.error('Please close the other application or choose a different port.');
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
