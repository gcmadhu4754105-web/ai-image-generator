import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper to translate aspect ratios into width and height dimensions
function getDimensions(ratio) {
  switch (ratio) {
    case '16:9':
      return { width: 1280, height: 720 };
    case '9:16':
      return { width: 720, height: 1280 };
    case '4:3':
      return { width: 1024, height: 768 };
    case '3:4':
      return { width: 768, height: 1024 };
    case '1:1':
    default:
      return { width: 1024, height: 1024 };
  }
}

// Clean conversational filler words for diffusion model optimization
function cleanPrompt(rawPrompt) {
  let p = rawPrompt.trim();
  // Strip conversational prefixes
  p = p.replace(/^(please\s+)?(create|generate|draw|make|show|render)(\s+an?|\s+me)?(\s+image|\s+picture|\s+photo|\s+artwork|\s+illustration)?(\s+of)?\s+/i, '');
  p = p.replace(/^(an?\s+)?(image|picture|photo|illustration|drawing)\s+of\s+/i, '');
  return p.trim();
}

// Helper to construct style-augmented prompt
function formatPromptWithStyle(rawPrompt, style) {
  const cleaned = cleanPrompt(rawPrompt);
  if (!style || style === 'None' || style === 'Standard') return cleaned;

  const styleModifiers = {
    'Photorealistic': 'photorealistic, 8k resolution, highly detailed, DSLR camera, sharp focus, realistic lighting',
    'Anime': 'anime masterpiece style, vibrant color grading, detailed line art, Studio Ghibli, 4k digital anime',
    'Cyberpunk': 'cyberpunk aesthetics, neon glow, futuristic city, rainy reflective streets, synthwave ambient lighting',
    'Cinematic': 'cinematic film still, 35mm lens, volumetric lighting, shallow depth of field, movie screenshot, 8k',
    'Fantasy': 'epic fantasy artwork, magical aura, intricate fine details, glowing runes, unreal engine 5 render',
    '3D Render': '3D render, Octane rendering, smooth claymation shading, raytraced studio lighting',
    'Minimalist': 'minimalist vector art, clean geometry, bold contrasting palette, elegant graphic',
    'Vintage': 'vintage 1970s film photograph, retro Kodak color film, gentle grain, nostalgic lighting'
  };

  const modifier = styleModifiers[style] || style;

  if (cleaned.toLowerCase().includes(modifier.toLowerCase().substring(0, 10))) {
    return cleaned;
  }

  return `${cleaned}, ${modifier}`;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    providers: {
      openai: Boolean(process.env.OPENAI_API_KEY),
      huggingface: Boolean(process.env.HF_TOKEN),
      together: Boolean(process.env.TOGETHER_API_KEY),
      stability: Boolean(process.env.STABILITY_API_KEY),
      pollinations: true
    }
  });
});

// Image Generation Endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const {
      prompt,
      aspect_ratio = '1:1',
      style = 'None',
      model = 'flux',
      enhance = true,
      negative_prompt = 'blurry, distorted, low quality, bad anatomy, deformed, ugly, pixelated, watermark',
      seed = Math.floor(Math.random() * 1000000)
    } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({ error: 'Please provide a valid prompt description.' });
    }

    const trimmedPrompt = prompt.trim();
    const cleanedPromptText = cleanPrompt(trimmedPrompt);
    const finalPrompt = formatPromptWithStyle(trimmedPrompt, style);
    const { width, height } = getDimensions(aspect_ratio);

    console.log(`[Generate API] Raw Prompt: "${trimmedPrompt}" -> Cleaned: "${cleanedPromptText}"`);
    console.log(`[Generate API] Options: Style=${style}, Model=${model}, Enhance=${enhance}, Ratio=${aspect_ratio} (${width}x${height}), Seed=${seed}`);

    let imageDataUrl = null;
    let usedProvider = 'pollinations';

    // 1. Try OpenAI DALL-E 3 if API Key exists and requested
    if (process.env.OPENAI_API_KEY && (model === 'dall-e-3' || model === 'openai')) {
      try {
        console.log('[Generate API] Using OpenAI DALL-E 3 API...');
        const openaiRes = await axios.post(
          'https://api.openai.com/v1/images/generations',
          {
            model: 'dall-e-3',
            prompt: finalPrompt,
            n: 1,
            size: aspect_ratio === '16:9' ? '1792x1024' : aspect_ratio === '9:16' ? '1024x1792' : '1024x1024',
            response_format: 'b64_json'
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: 60000
          }
        );

        if (openaiRes.data && openaiRes.data.data && openaiRes.data.data[0]?.b64_json) {
          imageDataUrl = `data:image/png;base64,${openaiRes.data.data[0].b64_json}`;
          usedProvider = 'openai';
        }
      } catch (err) {
        console.warn('[Generate API] OpenAI API call failed, falling back to Pollinations:', err.response?.data || err.message);
      }
    }

    // 2. Try Hugging Face Inference if API Key exists and requested
    if (!imageDataUrl && process.env.HF_TOKEN && (model === 'huggingface' || model === 'flux-hf')) {
      try {
        console.log('[Generate API] Using Hugging Face Inference API (FLUX.1-schnell)...');
        const hfRes = await axios.post(
          'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
          { inputs: finalPrompt },
          {
            headers: {
              'Authorization': `Bearer ${process.env.HF_TOKEN}`,
              'Content-Type': 'application/json'
            },
            responseType: 'arraybuffer',
            timeout: 60000
          }
        );

        const base64Image = Buffer.from(hfRes.data, 'binary').toString('base64');
        imageDataUrl = `data:image/png;base64,${base64Image}`;
        usedProvider = 'huggingface';
      } catch (err) {
        console.warn('[Generate API] Hugging Face call failed, falling back to Pollinations:', err.message);
      }
    }

    // 3. High Precision Generation: Pollinations AI Engine (FLUX.1 & Advanced Models)
    if (!imageDataUrl) {
      console.log('[Generate API] Requesting high-precision render from Pollinations AI...');
      const encodedPrompt = encodeURIComponent(finalPrompt);
      const encodedNegative = encodeURIComponent(negative_prompt);

      // Map requested model to exact engine
      let targetModel = 'flux';
      if (model === 'turbo') targetModel = 'turbo';
      if (model === 'flux-realism') targetModel = 'flux-realism';
      if (model === 'flux-anime') targetModel = 'flux-anime';
      if (model === 'flux-3d') targetModel = 'flux-3d';

      const pollUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=${targetModel}&enhance=${enhance ? 'true' : 'false'}&negative=${encodedNegative}`;

      const imageResponse = await axios.get(pollUrl, {
        responseType: 'arraybuffer',
        timeout: 60000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) VisionAI/2.0'
        }
      });

      const contentType = imageResponse.headers['content-type'] || 'image/jpeg';
      const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');
      imageDataUrl = `data:${contentType};base64,${base64Image}`;
      usedProvider = 'pollinations';
    }

    return res.json({
      success: true,
      image: imageDataUrl,
      metadata: {
        prompt: trimmedPrompt,
        cleanedPrompt: cleanedPromptText,
        finalPrompt,
        aspect_ratio,
        width,
        height,
        style,
        model,
        enhance,
        seed,
        provider: usedProvider,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[Generate API] Server Error:', error.message);
    const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to generate image from AI service.';
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🤖 High-Accuracy AI Image Server running on port ${PORT}`);
  console.log(`🌐 API Endpoint: http://localhost:${PORT}/api/generate`);
  console.log(`==================================================`);
});
