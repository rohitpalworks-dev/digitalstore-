"use strict";

const { createHash, randomBytes, scrypt, timingSafeEqual } = require("node:crypto");
const { createServer } = require("node:http");
const { mkdir, readFile, stat } = require("node:fs/promises");
const path = require("node:path");
const { promisify } = require("node:util");
const { DatabaseSync } = require("node:sqlite");

const scryptAsync = promisify(scrypt);
const rootDirectory = __dirname;
const sessionLifetimeMs = 7 * 24 * 60 * 60 * 1000;
const maxRequestBytes = 8 * 1024;
const passwordBytes = 64;
const passwordCost = { N: 1 << 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const cookieName = "rohitx_session";
const dummySalt = randomBytes(16);
const dummyHash = randomBytes(passwordBytes);
const staticFiles = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/style.css", ["style.css", "text/css; charset=utf-8"]],
  ["/script.js", ["script.js", "text/javascript; charset=utf-8"]]
]);

class HttpError extends Error {
  constructor(status, message, headers = {}) {
    super(message);
    this.status = status;
    this.headers = headers;
  }
}

function sendJson(response, status, body, headers = {}) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers
  });
  response.end(JSON.stringify(body));
}

function setSecurityHeaders(response) {
  response.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
}

function parseCookies(header = "") {
  const cookies = new Map();
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    cookies.set(part.slice(0, separator).trim(), part.slice(separator + 1).trim());
  }
  return cookies;
}

function createSessionToken() {
  return randomBytes(32).toString("base64url");
}

function hashSessionToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function sessionCookie(request, token, maxAge) {
  const parts = [
    `${cookieName}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`
  ];
  if (request.socket.encrypted) parts.push("Secure");
  return parts.join("; ");
}

function assertSameOrigin(request) {
  const origin = request.headers.origin;
  const protocol = request.socket.encrypted ? "https" : "http";
  if (!origin || origin !== `${protocol}://${request.headers.host}`) {
    throw new HttpError(403, "This request could not be verified. Reload the page and try again.");
  }
}

async function readJson(request) {
  if (!request.headers["content-type"]?.toLowerCase().startsWith("application/json")) {
    throw new HttpError(415, "Send the account details as JSON.");
  }

  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxRequestBytes) throw new HttpError(413, "The submitted details are too large.");
    chunks.push(chunk);
  }

  let value;
  try {
    value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError(400, "The submitted details could not be read.");
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new HttpError(400, "Check the submitted details and try again.");
  }
  return value;
}

function normalizeEmail(value) {
  if (typeof value !== "string") throw new HttpError(400, "Enter a valid email address.");
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, "Enter a valid email address.");
  }
  return email;
}

function validatePassword(value) {
  if (typeof value !== "string") throw new HttpError(400, "Enter a password.");
  const length = Buffer.byteLength(value, "utf8");
  if (length < 12) throw new HttpError(400, "Use a password with at least 12 characters.");
  if (length > 128) throw new HttpError(400, "Use a password no longer than 128 bytes.");
  return value;
}

async function hashPassword(password, salt = randomBytes(16)) {
  const hash = await scryptAsync(password, salt, passwordBytes, passwordCost);
  return {
    salt: Buffer.from(salt).toString("base64url"),
    hash: Buffer.from(hash).toString("base64url")
  };
}

async function passwordMatches(password, saltValue, hashValue) {
  const validSalt = typeof saltValue === "string" ? Buffer.from(saltValue, "base64url") : dummySalt;
  const validHash = typeof hashValue === "string" ? Buffer.from(hashValue, "base64url") : dummyHash;
  const salt = validSalt.length === 16 ? validSalt : dummySalt;
  const expectedHash = validHash.length === passwordBytes ? validHash : dummyHash;
  const actualHash = Buffer.from(await scryptAsync(password, salt, passwordBytes, passwordCost));
  return timingSafeEqual(actualHash, expectedHash) && salt === validSalt && expectedHash === validHash;
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

function createStoreServer({ dataDirectory = process.env.STORE_DATA_DIR || path.join(rootDirectory, "data") } = {}) {
  const resolvedDataDirectory = path.resolve(dataDirectory);
  const databasePath = path.join(resolvedDataDirectory, "rohitx-store.sqlite");
  const rateLimits = new Map();
  let database;

  function prepareDatabase() {
    database = new DatabaseSync(databasePath);
    database.exec(`
      PRAGMA foreign_keys = ON;
      PRAGMA busy_timeout = 5000;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE COLLATE NOCASE,
        password_salt TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS auth_sessions (
        token_hash TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS auth_sessions_expiry ON auth_sessions(expires_at);
    `);
  }

  function authRateLimitKey(request, action) {
    const address = request.socket.remoteAddress || "unknown";
    return `${address}:${action}`;
  }

  function checkAuthLimit(request, action) {
    const now = Date.now();
    const bucket = rateLimits.get(authRateLimitKey(request, action));
    if (!bucket || bucket.resetAt <= now || bucket.count < 10) return;
    throw new HttpError(429, "Too many account attempts. Wait a few minutes and try again.", {
      "Retry-After": String(Math.ceil((bucket.resetAt - now) / 1000))
    });
  }

  function recordAuthAttempt(request, action) {
    const now = Date.now();
    const key = authRateLimitKey(request, action);
    const current = rateLimits.get(key);
    const bucket = !current || current.resetAt <= now
      ? { count: 0, resetAt: now + 15 * 60 * 1000 }
      : current;
    bucket.count += 1;
    rateLimits.set(key, bucket);
    if (rateLimits.size > 1000) {
      for (const [key, value] of rateLimits) {
        if (value.resetAt <= now) rateLimits.delete(key);
      }
    }
  }

  function findCurrentUser(request) {
    const token = parseCookies(request.headers.cookie).get(cookieName);
    if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;

    const now = Date.now();
    database.prepare("DELETE FROM auth_sessions WHERE expires_at <= ?").run(now);
    return database.prepare(`
      SELECT users.id, users.name, users.email
      FROM auth_sessions
      JOIN users ON users.id = auth_sessions.user_id
      WHERE auth_sessions.token_hash = ? AND auth_sessions.expires_at > ?
    `).get(hashSessionToken(token), now) || null;
  }

  function issueSession(request, response, user) {
    const token = createSessionToken();
    const expiresAt = Date.now() + sessionLifetimeMs;
    database.prepare("INSERT INTO auth_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)")
      .run(hashSessionToken(token), user.id, expiresAt);
    response.setHeader("Set-Cookie", sessionCookie(request, token, Math.floor(sessionLifetimeMs / 1000)));
  }

  async function handleAuth(request, response, pathname) {
    if (request.method === "GET" && pathname === "/api/auth/me") {
      const user = findCurrentUser(request);
      sendJson(response, 200, { user: user ? publicUser(user) : null });
      return;
    }

    if (request.method !== "POST") {
      throw new HttpError(405, "This account action is not available.", { Allow: "GET, POST" });
    }
    assertSameOrigin(request);
    assertSameOrigin(request);

    if (pathname === "/api/auth/logout") {
      const token = parseCookies(request.headers.cookie).get(cookieName);
      if (token && /^[A-Za-z0-9_-]{43}$/.test(token)) {
        database.prepare("DELETE FROM auth_sessions WHERE token_hash = ?").run(hashSessionToken(token));
      }
      sendJson(response, 200, { user: null }, {
        "Set-Cookie": sessionCookie(request, "", 0)
      });
      return;
    }

    if (pathname !== "/api/auth/login" && pathname !== "/api/auth/register") {
      throw new HttpError(404, "That account action could not be found.");
    }

    if (pathname === "/api/auth/register") {
      checkAuthLimit(request, "register");
      recordAuthAttempt(request, "register");
    } else {
      checkAuthLimit(request, "login");
    }

    const payload = await readJson(request);
    const email = normalizeEmail(payload.email);
    const password = validatePassword(payload.password);

    if (pathname === "/api/auth/register") {
      if (typeof payload.name !== "string") throw new HttpError(400, "Enter your name.");
      const name = payload.name.trim();
      if (!name || [...name].length > 60 || /[\u0000-\u001f\u007f]/.test(name)) {
        throw new HttpError(400, "Your name must be between 1 and 60 characters.");
      }

      const credentials = await hashPassword(password);
      const user = database.prepare(`
        INSERT INTO users (name, email, password_salt, password_hash, created_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(email) DO NOTHING
        RETURNING id, name, email
      `).get(name, email, credentials.salt, credentials.hash, Date.now());

      if (!user) throw new HttpError(409, "An account with this email may already exist. Try signing in.");
      issueSession(request, response, user);
      sendJson(response, 201, { user: publicUser(user) });
      return;
    }

    if (pathname === "/api/auth/login") {
      const user = database.prepare(`
        SELECT id, name, email, password_salt, password_hash
        FROM users
        WHERE email = ? COLLATE NOCASE
      `).get(email);
      const passwordIsValid = await passwordMatches(password, user?.password_salt, user?.password_hash);
      if (!user || !passwordIsValid) {
        recordAuthAttempt(request, "login");
        throw new HttpError(401, "Email or password is incorrect.");
      }

      issueSession(request, response, user);
      sendJson(response, 200, { user: publicUser(user) });
      return;
    }
  }

  async function serveStatic(response, pathname) {
    let filePath;
    let contentType;

    if (staticFiles.has(pathname)) {
      const [fileName, mimeType] = staticFiles.get(pathname);
      filePath = path.join(rootDirectory, fileName);
      contentType = mimeType;
    } else if (pathname.startsWith("/logo.png/")) {
      let decodedPath;
      try {
        decodedPath = decodeURIComponent(pathname);
      } catch {
        throw new HttpError(400, "This file path is invalid.");
      }

      const imageDirectory = path.join(rootDirectory, "logo.png");
      filePath = path.resolve(rootDirectory, `.${decodedPath}`);
      const relativePath = path.relative(imageDirectory, filePath);
      if (!relativePath || relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
        throw new HttpError(404, "This file could not be found.");
      }
      const extension = path.extname(filePath).toLowerCase();
      const mimeTypes = new Map([
        [".png", "image/png"],
        [".jpg", "image/jpeg"],
        [".jpeg", "image/jpeg"],
        [".webp", "image/webp"],
        [".gif", "image/gif"]
      ]);
      contentType = mimeTypes.get(extension);
      if (!contentType) throw new HttpError(404, "This file could not be found.");
    } else {
      throw new HttpError(404, "This page could not be found.");
    }

    let file;
    try {
      const metadata = await stat(filePath);
      if (!metadata.isFile()) throw new HttpError(404, "This file could not be found.");
      file = await readFile(filePath);
    } catch (error) {
      if (error instanceof HttpError) throw error;
      if (error.code === "ENOENT" || error.code === "ENOTDIR") {
        throw new HttpError(404, "This file could not be found.");
      }
      throw error;
    }

    response.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-store"
    });
    response.end(file);
  }

  async function handleRequest(request, response) {
    setSecurityHeaders(response);
    let url;
    try {
      url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    } catch {
      throw new HttpError(400, "This request URL is invalid.");
    }

    if (url.pathname.startsWith("/api/")) {
      await handleAuth(request, response, url.pathname);
      return;
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      throw new HttpError(405, "This request method is not available.", { Allow: "GET, HEAD" });
    }
    await serveStatic(response, url.pathname);
  }

  const server = createServer((request, response) => {
    handleRequest(request, response).catch((error) => {
      if (error instanceof HttpError) {
        sendJson(response, error.status, { error: error.message }, error.headers);
        return;
      }

      console.error("Local store request failed.", error);
      if (response.headersSent) {
        response.destroy(error);
        return;
      }
      sendJson(response, 500, { error: "The local server could not complete this request. Check the server terminal for details." });
    });
  });

  server.on("close", () => database.close());
  server.initialize = async () => {
    await mkdir(resolvedDataDirectory, { recursive: true });
    prepareDatabase();
  };
  return server;
}

async function main() {
  const port = Number(process.env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be a valid port number between 1 and 65535.");
  }

  const server = createStoreServer();
  await server.initialize();
  server.on("error", (error) => {
    console.error("The local store server could not start.", error);
    process.exitCode = 1;
  });
  server.listen(port, "127.0.0.1", () => {
    console.log(`RohitX Store is running at http://127.0.0.1:${port}`);
    console.log("This server listens only on this computer. Press Ctrl+C to stop it.");
  });
}

if (require.main === module) {
  main().catch((error) => {
    console.error("The local store server could not start.", error);
    process.exitCode = 1;
  });
}

module.exports = { createStoreServer };
