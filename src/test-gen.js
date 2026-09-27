import axios from 'axios';

async function testGeneration() {
  console.log('Testing image generation API on http://localhost:5000/api/generate ...');
  try {
    const res = await axios.post('http://localhost:5000/api/generate', {
      prompt: 'A futuristic city at night with flying cars, cinematic lighting, ultra realistic',
      aspect_ratio: '1:1',
      style: 'Cinematic',
      model: 'flux'
    });

    console.log('✅ API Test Success!');
    console.log('Response status:', res.status);
    console.log('Success flag:', res.data.success);
    console.log('Metadata:', res.data.metadata);
    console.log('Image Data URL Length:', res.data.image ? res.data.image.length : 0);
    console.log('Image Header:', res.data.image ? res.data.image.substring(0, 45) + '...' : 'None');
  } catch (err) {
    console.error('❌ API Test Error:', err.response?.data || err.message);
  }
}

testGeneration();
