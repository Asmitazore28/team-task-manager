const http = require('http');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZjRhNGQ1ODc0MDc1ZWJlODA2MWU0MCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NzY0MDY4NSwiZXhwIjoxNzc4MjQ1NDg1fQ.AOgqnJGJTCC5ZSm54-nJKnB555gpcgV8waOxuZhGqrY";

const data = JSON.stringify({
  name: "Test Project",
  description: "This is a test project for demonstration"
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/projects',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': `Bearer ${token}`
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(body));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
