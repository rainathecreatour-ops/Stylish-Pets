import React, { useState, useEffect } from 'react';
import { Upload, Download, Sparkles, ChevronLeft, Settings, Palette, Heart } from 'lucide-react';

const STYLES = [
  { name: 'Watercolor', emoji: '🎨', description: 'Soft, flowing brushstrokes' },
  { name: 'Minimalist', emoji: '⚪', description: 'Clean, simple lines' },
  { name: 'Cartoonish', emoji: '🎭', description: 'Fun, playful style' },
  { name: 'Anime', emoji: '🌸', description: 'Japanese animation style' },
  { name: 'Boho', emoji: '🌿', description: 'Earthy, artistic vibes' },
  { name: 'Classical', emoji: '🖼️', description: 'Renaissance portrait' },
  { name: 'Gladiator', emoji: '⚔️', description: 'Epic warrior theme' },
  { name: 'Realistic', emoji: '📷', description: 'Photorealistic detail' },
  { name: 'Pixel Art', emoji: '🎮', description: 'Retro gaming style' },
  { name: 'Pop Art', emoji: '💥', description: 'Bold, vibrant colors' },
  { name: 'Oil Painting', emoji: '🖌️', description: 'Classic brushwork' }
];

const PRINT_SIZES = [
  { name: '8×10"', width: 2400, height: 3000, price: '$19.99' },
  { name: '11×14"', width: 3300, height: 4200, price: '$29.99' },
  { name: '16×20"', width: 4800, height: 6000, price: '$39.99' },
  { name: '18×24"', width: 5400, height: 7200, price: '$49.99' }
];

const FONTS = [
  'Brush Script MT', 'Georgia', 'Impact', 'Courier New', 'Arial', 'Comic Sans MS'
];

const BACKGROUNDS = {
  Watercolor: ['Soft Blue', 'Pastel Pink', 'Mint Green', 'Lavender'],
  Minimalist: ['Pure White', 'Warm Beige', 'Cool Gray', 'Off White'],
  Cartoonish: ['Bright Yellow', 'Sky Blue', 'Candy Pink', 'Lime Green'],
  Anime: ['Sakura Pink', 'Ocean Blue', 'Sunset Orange', 'Night Purple'],
  Boho: ['Terracotta', 'Sage Green', 'Dusty Rose', 'Cream'],
  Classical: ['Renaissance Gold', 'Royal Blue', 'Deep Burgundy', 'Ivory'],
  Gladiator: ['Stone Gray', 'Bronze', 'Battle Red', 'Ancient Marble'],
  Realistic: ['Natural Wood', 'Soft Focus', 'Studio White', 'Dark Backdrop'],
  'Pixel Art': ['Retro Grid', 'Arcade Black', 'Neon Purple', 'Game Boy Green'],
  'Pop Art': ['Comic Dots', 'Bold Yellow', 'Hot Pink', 'Electric Blue'],
  'Oil Painting': ['Canvas Texture', 'Museum White', 'Gallery Gray', 'Vintage Cream']
};

export default function StylishPets() {
  const [licenseKey, setLicenseKey] = useState('');
  const [isLicensed, setIsLicensed] = useState(false);
  const [step, setStep] = useState('upload');
  const [petImage, setPetImage] = useState(null);
  const [petDescription, setPetDescription] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Watercolor');
  const [selectedSize, setSelectedSize] = useState(PRINT_SIZES[1]);
  const [text, setText] = useState('');
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [selectedBackground, setSelectedBackground] = useState(BACKGROUNDS.Watercolor[0]);
  const [generatedArt, setGeneratedArt] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('stylishPetsLicense');
    if (stored) {
      setLicenseKey(stored);
      setIsLicensed(true);
    }
  }, []);

  const validateLicense = () => {
    setError('');
    if (!licenseKey.trim()) {
      setError('Please enter a license key');
      return;
    }
    localStorage.setItem('stylishPetsLicense', licenseKey);
    setIsLicensed(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPetImage(event.target.result);
        setStep('customize');
      };
      reader.readAsDataURL(file);
    }
  };

  const generateArt = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: `You are an expert art director creating a detailed visual description for a ${selectedStyle} style pet portrait.

Pet description: ${petDescription || 'the uploaded pet photo'}
Background: ${selectedBackground}
${text ? `Text overlay: "${text}"` : ''}

Create a vivid, detailed description of how this pet portrait would look in ${selectedStyle} style with ${selectedBackground} background. Focus on:
- Color palette and mood
- Artistic techniques specific to ${selectedStyle}
- Composition and framing
- Texture and detail level
- How the background complements the pet

Return ONLY the artistic description, no preamble.`
          }]
        })
      });

      const data = await response.json();
      
      if (data.content && data.content[0]) {
        setGeneratedArt({
          description: data.content[0].text,
          style: selectedStyle,
          background: selectedBackground,
          size: selectedSize,
          petImage: petImage
        });
        setStep('preview');
      } else {
        setError('Failed to generate artwork. Please try again.');
      }
    } catch (err) {
      setError('Failed to generate artwork. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadArt = () => {
    const canvas = document.createElement('canvas');
    canvas.width = selectedSize.width;
    canvas.height = selectedSize.height;
    const ctx = canvas.getContext('2d');

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f0f0f0');
    gradient.addColorStop(1, '#e0e0e0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pet image if available
    if (petImage) {
      const img = new window.Image();
      img.onload = () => {
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.7;
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        
        // Add style label
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, 100);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${selectedStyle} Style`, canvas.width / 2, 65);

        // Add text overlay if provided
        if (text) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(0, canvas.height - 150, canvas.width, 150);
          ctx.fillStyle = '#333';
          ctx.font = `bold 64px ${selectedFont}`;
          ctx.fillText(text, canvas.width / 2, canvas.height - 70);
        }

        // Download
        const link = document.createElement('a');
        link.download = `stylish-pet-${selectedStyle.toLowerCase()}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
      img.src = petImage;
    } else {
      // Fallback if no image
      ctx.fillStyle = '#333';
      ctx.font = 'bold 72px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${selectedStyle} Pet Art`, canvas.width / 2, canvas.height / 2);
      
      if (text) {
        ctx.font = `64px ${selectedFont}`;
        ctx.fillText(text, canvas.width / 2, canvas.height - 100);
      }

      const link = document.createElement('a');
      link.download = `stylish-pet-${selectedStyle.toLowerCase()}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  if (!isLicensed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full transform hover:scale-105 transition-transform">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black text-gray-800 mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Stylish Pets
            </h1>
            <p className="text-gray-600 text-lg">Transform your furry friend into art</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your license key"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && validateLicense()}
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg transition-all"
            />
            
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              onClick={validateLicense}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-bold text-lg shadow-lg transform hover:scale-105"
            >
              Unlock Now ✨
            </button>

            <p className="text-sm text-gray-500 text-center pt-4">
              Don't have a license?{' '}
              <a href="https://gumroad.com" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                Get Stylish Pets →
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        <header className="text-center mb-12 pt-8">
          <div className="inline-block">
            <h1 className="text-6xl font-black mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              🐾 Stylish Pets
            </h1>
            <p className="text-xl text-gray-600">Create museum-quality art from your pet photos</p>
          </div>
        </header>

        {step === 'upload' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-10 mb-6">
              <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Let's Get Started!
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="group relative overflow-hidden border-4 border-dashed border-purple-300 rounded-2xl p-10 text-center hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <Upload className="w-16 h-16 mx-auto mb-4 text-purple-600 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-bold mb-2">Upload Photo</h3>
                    <p className="text-gray-600 mb-6">Got a pic? Let's make it art!</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl cursor-pointer hover:shadow-lg transition-all font-bold"
                    >
                      Choose File
                    </label>
                  </div>
                </div>

                <div className="group relative overflow-hidden border-4 border-dashed border-pink-300 rounded-2xl p-10 hover:border-pink-500 hover:bg-pink-50 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-pink-600 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-bold mb-2">Describe Your Pet</h3>
                    <p className="text-gray-600 mb-4">No photo? No problem!</p>
                    <textarea
                      value={petDescription}
                      onChange={(e) => setPetDescription(e.target.value)}
                      placeholder="A majestic orange tabby cat with green eyes..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:outline-none mb-4 transition-all"
                      rows="4"
                    />
                    <button
                      onClick={() => petDescription && setStep('customize')}
                      disabled={!petDescription}
                      className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold"
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'customize' && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-10">
              <button
                onClick={() => setStep('upload')}
                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-8 transition-colors font-semibold"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              {petImage && (
                <div className="mb-8 text-center">
                  <img src={petImage} alt="Your pet" className="max-h-64 mx-auto rounded-2xl shadow-lg" />
                </div>
              )}

              <div className="space-y-10">
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Palette className="w-7 h-7 text-purple-600" />
                    Choose Your Style
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {STYLES.map(style => (
                      <button
                        key={style.name}
                        onClick={() => {
                          setSelectedStyle(style.name);
                          setSelectedBackground(BACKGROUNDS[style.name][0]);
                        }}
                        className={`p-4 rounded-2xl border-3 transition-all transform hover:scale-105 ${
                          selectedStyle === style.name
                            ? 'border-purple-600 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-105'
                            : 'border-gray-200 hover:border-purple-300 bg-white'
                        }`}
                      >
                        <div className="text-4xl mb-2">{style.emoji}</div>
                        <div className="font-bold text-sm">{style.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{style.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-6">Background Theme</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {BACKGROUNDS[selectedStyle].map(bg => (
                      <button
                        key={bg}
                        onClick={() => setSelectedBackground(bg)}
                        className={`px-6 py-4 rounded-xl border-2 transition-all font-semibold ${
                          selectedBackground === bg
                            ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-md'
                            : 'border-gray-300 hover:border-purple-400'
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-6">Print Size</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {PRINT_SIZES.map(size => (
                      <button
                        key={size.name}
                        onClick={() => setSelectedSize(size)}
                        className={`p-5 rounded-xl border-2 transition-all ${
                          selectedSize.name === size.name
                            ? 'border-purple-600 bg-purple-50 shadow-md'
                            : 'border-gray-300 hover:border-purple-400'
                        }`}
                      >
                        <div className="font-bold text-lg">{size.name}</div>
                        <div className="text-sm text-gray-600">{size.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-6">Add Text (Optional)</h3>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g., Max • Best Friend Forever"
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg mb-4 transition-all"
                  />
                  
                  {text && (
                    <div>
                      <label className="block font-semibold mb-4 text-lg">Font Style</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {FONTS.map(font => (
                          <button
                            key={font}
                            onClick={() => setSelectedFont(font)}
                            className={`px-6 py-3 rounded-xl border-2 transition-all ${
                              selectedFont === font
                                ? 'border-purple-600 bg-purple-50 text-purple-700'
                                : 'border-gray-300 hover:border-purple-400'
                            }`}
                            style={{ fontFamily: font }}
                          >
                            {font}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                    <p className="text-red-600 font-medium">{error}</p>
                  </div>
                )}

                <button
                  onClick={generateArt}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-6 rounded-2xl hover:shadow-2xl disabled:opacity-50 transition-all font-bold text-xl flex items-center justify-center gap-3"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Creating Magic...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      Generate Artwork
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'preview' && generatedArt && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-10">
              <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your Masterpiece Awaits! 🎨
              </h2>

              <div className="mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8">
                <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl mx-auto">
                  {generatedArt.petImage ? (
                    <div className="relative">
                      <img src={generatedArt.petImage} alt="Pet artwork" className="w-full rounded-lg shadow-lg" />
                      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
                        <p className="font-bold">{generatedArt.style} Style</p>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg">
                        <p className="font-bold">{selectedSize.name}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-32 h-32 text-purple-600" />
                    </div>
                  )}
                  
                  {text && (
                    <div className="mt-6 text-center">
                      <p className="text-3xl font-bold" style={{ fontFamily: selectedFont }}>{text}</p>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-700 leading-relaxed">{generatedArt.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep('customize')}
                  className="px-8 py-4 border-2 border-gray-300 rounded-xl hover:border-purple-400 transition-all font-bold text-lg"
                >
                  ← Customize More
                </button>
                <button
                  onClick={downloadArt}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all font-bold text-lg flex items-center justify-center gap-3"
                >
                  <Download className="w-6 h-6" />
                  Download High-Res ({selectedSize.name})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
