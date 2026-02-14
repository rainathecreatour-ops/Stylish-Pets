export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { style, description, background } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Create a detailed text description for generating ${style} style pet artwork. The pet is: ${description}. Background: ${background}. Make it vivid and specific to this art style. Return ONLY the image generation prompt, no other text.`
        }]
      })
    });

    const data = await response.json();
    
    if (data.content && data.content[0]) {
      return res.status(200).json({
        success: true,
        prompt: data.content[0].text
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate artwork'
      });
    }
  } catch (error) {
    console.error('Art generation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate artwork'
    });
  }
}
