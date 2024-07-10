const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const fs = require('fs');

// Configure axios-retry
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

const basePrompt = fs.readFileSync('prompt.md', 'utf-8');

const app = express();
const port = 3000;

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY is not set in the environment variables.');
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/generate-campaign', async (req, res) => {
  try {
    console.log('Received request body:', req.body);

    const userInputs = req.body;
    console.log('Processed user inputs:', userInputs);

    const userMessage = `As an experienced marketing strategist, create a comprehensive marketing campaign based on the provided information. Begin by outlining the key components of the campaign, including target audience, campaign objectives, key messaging, chosen marketing channels, and budget allocation. Develop a creative concept that aligns with the brand's values and resonates with the target audience. Provide specific ideas for content across various platforms (e.g., social media, email, print, digital ads) and suggest a timeline for implementation. Include metrics for measuring the campaign's success and propose methods for tracking and analyzing these metrics. Ensure that the campaign is cohesive, innovative, and tailored to achieve the stated marketing goals. Generate a marketing campaign based on the provided information:
    Product Name: ${userInputs['product-name'] || 'N/A'}
    Product Description: ${userInputs['product-description'] || 'N/A'}
    Company Branding: ${userInputs['company-branding'] || 'N/A'}
    Target Audience: ${userInputs['target-audience'] || 'N/A'}
    Marketing Trends: ${userInputs['marketing-trends'] || 'N/A'}
    Company Data: ${userInputs['company-data'] || 'N/A'}
    Creative Direction: ${userInputs['creative-direction'] || 'N/A'}`;

    console.log('Constructed user message:', userMessage);

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      messages: [
        { role: "user", content: userMessage }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      timeout: 30000 // 30 seconds timeout
    });

    console.log('Anthropic API response:', response.data);

    res.json({ campaign: response.data.content[0].text });
  } catch (error) {
    console.error('Detailed error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      res.status(error.response.status || 500).json({
        error: 'Error from Anthropic API',
        details: error.response.data
      });
    } else if (error.code === 'ECONNABORTED') {
      res.status(504).json({
        error: 'Request to Anthropic API timed out',
        details: 'The request took too long to complete. Please try again.'
      });
    } else {
      console.error('Error message:', error.message);
      res.status(500).json({
        error: 'An error occurred while generating the campaign',
        details: error.message
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? 'Set' : 'Not set');
});