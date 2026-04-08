// Gumroad ping handler
// Receives POST when a purchase (or refund) occurs
// Verifies license key against Gumroad API, then stores in KV
//
// Required env vars:
//   SHOSHIN_KEYS        — KV binding
//   GUMROAD_PRODUCT_ID  — your Gumroad product permalink/ID
// Optional env vars:
//   GUMROAD_SELLER_ID   — early rejection of spoofed pings

// Verify a license key is real by calling Gumroad's API
async function verifyWithGumroad(productId, licenseKey) {
  const res = await fetch('https://api.gumroad.com/v2/licenses/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      product_id: productId,
      license_key: licenseKey,
    }),
  });

  if (!res.ok) return { valid: false };

  const data = await res.json();
  return { valid: data.success === true, purchase: data.purchase };
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  const sellerId = formData.get('seller_id');
  const email = formData.get('email');
  const saleId = formData.get('sale_id');
  const licenseKey = formData.get('license_key');
  const refunded = formData.get('refunded');

  // Quick check — reject if seller ID doesn't match
  if (env.GUMROAD_SELLER_ID && sellerId !== env.GUMROAD_SELLER_ID) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Handle refund — revoke access and clean up email index
  if (refunded === 'true') {
    if (licenseKey) {
      // Remove key from email index before deleting
      const record = await env.SHOSHIN_KEYS.get(`key:${licenseKey}`, 'json');
      if (record?.email) {
        const index = await env.SHOSHIN_KEYS.get(`email:${record.email}`, 'json') || { keys: [] };
        index.keys = index.keys.filter(k => k !== licenseKey);
        if (index.keys.length > 0) {
          await env.SHOSHIN_KEYS.put(`email:${record.email}`, JSON.stringify(index));
        } else {
          await env.SHOSHIN_KEYS.delete(`email:${record.email}`);
        }
      }
      await env.SHOSHIN_KEYS.delete(`key:${licenseKey}`);
    }
    return new Response('Revoked', { status: 200 });
  }

  if (!licenseKey) {
    return new Response('No license key in payload', { status: 400 });
  }

  // Verify the key is real with Gumroad before storing
  const productId = env.GUMROAD_PRODUCT_ID;
  if (!productId) {
    console.error('GUMROAD_PRODUCT_ID not set');
    return new Response('Server misconfigured', { status: 500 });
  }

  const verification = await verifyWithGumroad(productId, licenseKey);
  if (!verification.valid) {
    return new Response('Key verification failed', { status: 403 });
  }

  // Verified — store the key with purchase metadata
  const record = {
    email,
    saleId,
    productId,
    createdAt: new Date().toISOString(),
    verifiedAt: new Date().toISOString(),
  };

  await env.SHOSHIN_KEYS.put(`key:${licenseKey}`, JSON.stringify(record));

  // Update email reverse index
  if (email) {
    const index = await env.SHOSHIN_KEYS.get(`email:${email}`, 'json') || { keys: [] };
    if (!index.keys.includes(licenseKey)) {
      index.keys.push(licenseKey);
    }
    await env.SHOSHIN_KEYS.put(`email:${email}`, JSON.stringify(index));
  }

  return new Response('OK', { status: 200 });
}

// Reject non-POST
export async function onRequestGet() {
  return new Response('Method not allowed', { status: 405 });
}
