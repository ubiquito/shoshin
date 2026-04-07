// Verify a license key and set the session cookie
// Called from enter.html form submission

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ valid: false, error: 'Invalid request' }, { status: 400 });
  }

  const key = body.key?.trim();
  if (!key) {
    return Response.json({ valid: false, error: 'No key provided' }, { status: 400 });
  }

  const record = await env.SHOSHIN_KEYS.get(`key:${key}`);
  if (!record) {
    return Response.json({ valid: false, error: 'Key not recognised' }, { status: 401 });
  }

  // Valid — set cookie and confirm
  const response = Response.json({ valid: true, redirect: '/' });
  response.headers.append(
    'Set-Cookie',
    `shoshin_key=${key}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`
  );
  return response;
}
