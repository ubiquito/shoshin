// GDPR deletion — remove all data for an email address
// POST /api/admin/gdpr-delete { email: "..." }
// Requires ADMIN_SECRET env var to be set
//
// KV layout:
//   key:<license_key>  → { email, saleId, ... }
//   email:<email>      → { keys: ["key1", "key2"] }

export async function onRequestPost(context) {
  const { request, env } = context;

  // Auth — simple shared secret
  const auth = request.headers.get('Authorization');
  if (!env.ADMIN_SECRET || auth !== `Bearer ${env.ADMIN_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email) {
    return Response.json({ error: 'No email provided' }, { status: 400 });
  }

  // Look up the email index
  const index = await env.SHOSHIN_KEYS.get(`email:${email}`, 'json');
  if (!index || !index.keys.length) {
    return Response.json({ deleted: 0, message: 'No records found for this email' });
  }

  // Delete each license key
  const deleted = [];
  for (const licenseKey of index.keys) {
    await env.SHOSHIN_KEYS.delete(`key:${licenseKey}`);
    deleted.push(licenseKey);
  }

  // Delete the email index itself
  await env.SHOSHIN_KEYS.delete(`email:${email}`);

  return Response.json({
    deleted: deleted.length,
    keys: deleted,
    message: `All data for ${email} has been removed`,
  });
}
