export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { license_key, product_id } = req.body;

  try {
    // Validate with Gumroad License API
    const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        product_id: product_id,
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
