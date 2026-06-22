import http from 'node:http';
import { execSync } from 'node:child_process';
import { URL } from 'node:url';

const PORT = parseInt(process.env.PORT || '3002', 10);
const PROJECT_DIR = process.env.PROJECT_DIR || process.cwd();

function runTask(task) {
  const cmd = `npx opencode run "${task.replace(/"/g, '\\"')}"`;
  const result = execSync(cmd, {
    cwd: PROJECT_DIR,
    timeout: 120000,
    maxBuffer: 10 * 1024 * 1024,
    shell: 'powershell.exe',
    env: { ...process.env },
  });
  return result.toString().trim();
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const task = url.searchParams.get('task');

  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      project: PROJECT_DIR,
      usage: 'POST /?task=your+task+here or GET /?task=your+task+here'
    }));
    return;
  }

  if (!task) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing "task" query parameter' }));
    return;
  }

  try {
    const output = runTask(task);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, output }));
  } catch (err) {
    const stdout = err.stdout?.toString().trim() || '';
    const stderr = err.stderr?.toString().trim() || '';
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: stdout.length > 0,
      output: stdout || stderr,
    }));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`OpenCode bridge on http://127.0.0.1:${PORT}`);
  console.log(`Project: ${PROJECT_DIR}`);
});
