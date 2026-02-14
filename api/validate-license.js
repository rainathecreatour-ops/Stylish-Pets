export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { license_key, product_id } = req.body;

  if (!license_key) {
    return res.status(400).json({ success: false, message: 'License key required' });
  }

  try {
    // Validate with Gumroad License API
    const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        product_id: product_id || process.env.GUMROAD_PRODUCT_ID,
        license_key: license_key,
        increment_uses_count: 'false'
      })
    });

    const data = await response.json();

    if (data.success && data.purchase) {
      return res.status(200).json({
        success: true,
        purchase: data.purchase
      });
    } else {
      return res.status(200).json({
        success: false,
        message: 'Invalid license key'
      });
    }
  } catch (error) {
    console.error('License validation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Validation failed'
    });
  }
}
