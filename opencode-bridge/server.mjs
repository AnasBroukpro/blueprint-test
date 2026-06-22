import http from 'node:http';
import { execSync } from 'node:child_process';
import { URL } from 'node:url';

const PORT = parseInt(process.env.PORT || '3002', 10);
const PROJECT_DIR = process.env.PROJECT_DIR || process.cwd();
const GITHUB_OWNER = 'AnasBroukpro';
const GITHUB_REPO = 'blueprint-test';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

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

async function githubApi(method, path, body) {
  const url = `https://api.github.com${path}`;
  const opts = {
    method,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'blueprint-test-bridge',
    },
  };
  if (body) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(url, opts);
  const data = await res.json();
  return { status: res.status, data };
}

async function githubPush(filePath, fileContent, commitMessage) {
  const branch = 'master';

  const refRes = await githubApi('GET', `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/ref/heads/${branch}`);
  if (refRes.status !== 200) throw new Error(`get ref: ${refRes.data.message || refRes.status}`);
  const baseSha = refRes.data.object.sha;

  const commitRes = await githubApi('GET', `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/commits/${baseSha}`);
  const baseTreeSha = commitRes.data.tree.sha;

  const blobRes = await githubApi('POST', `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/blobs`, {
    content: fileContent,
    encoding: 'utf-8',
  });
  const blobSha = blobRes.data.sha;

  const treeRes = await githubApi('POST', `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees`, {
    base_tree: baseTreeSha,
    tree: [{ path: filePath, mode: '100644', type: 'blob', sha: blobSha }],
  });
  const newTreeSha = treeRes.data.sha;

  const newCommitRes = await githubApi('POST', `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/commits`, {
    message: commitMessage,
    tree: newTreeSha,
    parents: [baseSha],
  });
  const commitSha = newCommitRes.data.sha;

  await githubApi('PATCH', `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs/heads/${branch}`, {
    sha: commitSha,
    force: false,
  });

  return {
    commitSha,
    url: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/commit/${commitSha}`,
    fileUrl: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/blob/${branch}/${filePath}`,
  };
}

function jsonResponse(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function collectBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => resolve(body));
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const q = (name) => url.searchParams.get(name);

  // Health
  if (pathname === '/health' || pathname === '/') {
    jsonResponse(res, 200, {
      status: 'ok',
      endpoints: {
        opencode: 'GET /?task=...',
        githubPush: 'GET /github-push?path=...&content=...&message=... | POST /github-push json body',
      },
    });
    return;
  }

  // GitHub push
  if (pathname === '/github-push') {
    let filePath, content, message;

    if (req.method === 'POST') {
      const body = await collectBody(req);
      try {
        const parsed = JSON.parse(body);
        // n8n sends [{name: 'path', value: '...'}, {name: 'content', value: '...'}]
        if (Array.isArray(parsed)) {
          const map = {};
          parsed.forEach(p => { map[p.name] = p.value; });
          filePath = map.path;
          content = map.content;
          message = map.message || 'Update via n8n bridge';
        } else {
          filePath = parsed.path;
          content = parsed.content;
          message = parsed.message || 'Update via n8n bridge';
        }
      } catch {
        jsonResponse(res, 400, { error: 'Invalid JSON body' });
        return;
      }
    } else {
      filePath = q('path');
      content = q('content');
      message = q('message') || 'Update via n8n bridge';
    }

    if (!filePath || !content) {
      jsonResponse(res, 400, { error: 'Missing "path" or "content"' });
      return;
    }

    try {
      const result = await githubPush(filePath, content, message);
      jsonResponse(res, 200, { success: true, ...result });
    } catch (err) {
      jsonResponse(res, 500, { success: false, error: err.message });
    }
    return;
  }

  // OpenCode task
  const task = q('task');
  if (!task) {
    jsonResponse(res, 400, { error: 'Missing "task" query parameter' });
    return;
  }

  try {
    const output = runTask(task);
    jsonResponse(res, 200, { success: true, output });
  } catch (err) {
    const stdout = err.stdout?.toString().trim() || '';
    const stderr = err.stderr?.toString().trim() || '';
    jsonResponse(res, 200, { success: stdout.length > 0, output: stdout || stderr });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`OpenCode bridge on http://127.0.0.1:${PORT}`);
  console.log(`Token loaded: ${GITHUB_TOKEN ? 'yes' : 'NO'}`);
});
