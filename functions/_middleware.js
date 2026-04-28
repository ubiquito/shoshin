// Auth gate — checks every request for a valid license key
// Keys stored in Cloudflare KV (SHOSHIN_KEYS binding)

const PUBLIC_PATHS = ['/enter', '/enter.html', '/api/'];

// Dev/config files that should never be served
const BLOCKED_FILES = [
  '/CLAUDE.md', '/SETUP.md', '/README.md',
  '/dev-init.sh', '/.devcontainer', '/docs',
];

function isBlocked(pathname) {
  return BLOCKED_FILES.some(f => pathname === f || pathname.startsWith(f + '/'));
}

function isPublic(pathname) {
  return PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p));
}

function parseCookie(cookieHeader, name) {
  const match = cookieHeader?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? match[1] : null;
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // Block dev files
  if (isBlocked(url.pathname)) {
    return new Response('Not found', { status: 404 });
  }

  // Let public paths through
  if (isPublic(url.pathname)) {
    return next();
  }

  // Static assets (no extension = HTML page, gated; with extension = check)
  // Allow favicon, robots, etc. through
  const staticExts = ['.ico', '.txt', '.xml', '.webmanifest'];
  if (staticExts.some(ext => url.pathname.endsWith(ext))) {
    return next();
  }

  // Check for key in query param (direct link from purchase email)
  const keyParam = url.searchParams.get('key');
  if (keyParam) {
    const record = await env.SHOSHIN_KEYS.get(`key:${keyParam}`);
    if (record) {
      // Valid key — set cookie, redirect to clean URL
      url.searchParams.delete('key');
      const cleanUrl = url.pathname + (url.search || '');
      const response = new Response(null, {
        status: 302,
        headers: { Location: cleanUrl || '/' },
      });
      response.headers.append(
        'Set-Cookie',
        `shoshin_key=${keyParam}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`
      );
      return response;
    }
  }

  // Check cookie
  const cookieKey = parseCookie(request.headers.get('Cookie'), 'shoshin_key');
  if (cookieKey) {
    const record = await env.SHOSHIN_KEYS.get(`key:${cookieKey}`);
    if (record) {
      return next();
    }
  }

  // Not authenticated — redirect to enter page
  return Response.redirect(new URL('/enter', request.url).toString(), 302);
}
