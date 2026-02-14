import React, { useState, useEffect } from 'react';
import { Upload, Download, Type, Palette, Image, Key } from 'lucide-react';

const STYLES = [
  'Watercolor', 'Minimalist', 'Cartoonish', 'Anime', 'Boho', 
  'Classical', 'Gladiator', 'Realistic', 'Pixel Art', 'Pop Art', 'Oil Painting'
];

const PRINT_SIZES = [
  { name: '8x10"', width: 2400, height: 3000 },
  { name: '11x14"', width: 3300, height: 4200 },
  { name: '16x20"', width: 4800, height: 6000 },
  { name: '18x24"', width: 5400, height: 7200 }
];

const FONTS = ['Arial', 'Georgia', 'Courier New', 'Brush Script MT', 'Impact', 'Comic Sans MS'];

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
  const [selectedSize, setSelectedSize] = useState(PRINT_SIZES[0]);
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

  const validateLicense = async () => {
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

    // Mock generation - simulates AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create mock generated art
    setGeneratedArt({
      prompt: `A beautiful ${selectedStyle} style portrait of ${petDescription || 'your beloved pet'} with ${selectedBackground} background, featuring intricate details and professional composition`,
      style: selectedStyle,
      background: selectedBackground,
      size: selectedSize
    });
    setStep('preview');
    setIsGenerating(false);
  };

  const downloadArt = () => {
    const canvas = document.createElement('canvas');
    canvas.width = selectedSize.width;
    canvas.height = selectedSize.height;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Placeholder art
    ctx.fillStyle = '#333';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${selectedStyle} Pet Art`, canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '24px Arial';
    ctx.fillText(selectedBackground, canvas.width / 2, canvas.height / 2);

    // Add user text if provided
    if (text) {
      ctx.font = `64px ${selectedFont}`;
      ctx.fillText(text, canvas.width / 2, canvas.height - 100);
    }

    // Download
    const link = document.createElement('a');
    link.download = `stylish-pet-${selectedStyle.toLowerCase()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (!isLicensed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Key className="w-16 h-16 mx-auto mb-4 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Stylish Pets</h1>
            <p className="text-gray-600">Enter your license key to continue</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter any license key to test"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
            
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              onClick={validateLicense}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Activate License
            </button>

            <p className="text-sm text-gray-500 text-center">
              Don't have a license? <a href="https://gumroad.com" className="text-purple-600 hover:underline">Purchase on Gumroad</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🐾 Stylish Pets</h1>
          <p className="text-gray-600">Transform your pet into stunning artwork</p>
        </header>

        {step === 'upload' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Upload Your Pet</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-500 transition-colors">
                <Upload className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold mb-2">Upload Photo</h3>
                <p className="text-sm text-gray-600 mb-4">Upload a photo of your pet</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-purple-700 transition-colors"
                >
                  Choose File
                </label>
              </div>

              <div className="border-2 border-dashed border-pink-300 rounded-xl p-8 hover:border-pink-500 transition-colors">
                <Type className="w-12 h-12 mx-auto mb-4 text-pink-600" />
                <h3 className="font-semibold mb-2">Describe Your Pet</h3>
                <p className="text-sm text-gray-600 mb-4">Or describe the pet you want</p>
                <textarea
                  value={petDescription}
                  onChange={(e) => setPetDescription(e.target.value)}
                  placeholder="e.g., A fluffy golden retriever with a red collar"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none mb-4"
                  rows="3"
                />
                <button
                  onClick={() => petDescription && setStep('customize')}
                  disabled={!petDescription}
                  className="w-full bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'customize' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Customize Your Art</h2>

            <div className="space-y-6">
              <div>
                <label className="block font-semibold mb-3">Art Style</label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {STYLES.map(style => (
                    <button
                      key={style}
                      onClick={() => {
                        setSelectedStyle(style);
                        setSelectedBackground(BACKGROUNDS[style][0]);
                      }}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedStyle === style
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-3">Background</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {BACKGROUNDS[selectedStyle].map(bg => (
                    <button
                      key={bg}
                      onClick={() => setSelectedBackground(bg)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedBackground === bg
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-3">Print Size</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {PRINT_SIZES.map(size => (
                    <button
                      key={size.name}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedSize.name === size.name
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-3">Add Text (Optional)</label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g., Max, Best Friend, 2024"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none mb-3"
                />
                
                {text && (
                  <div>
                    <label className="block font-semibold mb-3">Font Style</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {FONTS.map(font => (
                        <button
                          key={font}
                          onClick={() => setSelectedFont(font)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
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
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep('upload')}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={generateArt}
                  disabled={isGenerating}
                  className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors font-semibold"
                >
                  {isGenerating ? 'Generating...' : 'Generate Artwork'}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'preview' && generatedArt && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Your Stylish Pet Art</h2>

            <div className="mb-6 bg-gray-100 rounded-xl p-8 text-center">
              <div className="bg-white rounded-lg shadow-lg p-8 inline-block">
                <Image className="w-32 h-32 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Style: {generatedArt.style}</p>
                <p className="text-gray-600 mb-2">Background: {generatedArt.background}</p>
                <p className="text-gray-600 mb-2">Size: {selectedSize.name}</p>
                {text && (
                  <p className="text-xl mt-4" style={{ fontFamily: selectedFont }}>{text}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('customize')}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                Customize More
              </button>
              <button
                onClick={downloadArt}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Print-Ready File
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-4 text-center">
              Note: This is a demo preview. In production, actual AI-generated artwork will be displayed here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
