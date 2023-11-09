const express = require('express');
const { createServer } = require('http');
const { Server } = require('ws');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;
const OPENAI_API_KEY = 'your-openai-api-key'; // Replace with your actual OpenAI API key
const OPENAI_API_URL = 'https://api.openai.com/v1/engines/gpt-4-1106-preview/completions';

app.use(express.json());

const server = createServer(app);
const wss = new Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    const requestData = JSON.parse(message);
    const config = {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      responseType: 'stream'
    };

    try {
      const responseStream = await axios.post(OPENAI_API_URL, {
        prompt: requestData.prompt,
        max_tokens: 150,
        stream: true
      }, config);

      // Handling the stream
      responseStream.data.on('data', (chunk) => {
        // Assuming the chunks are JSON strings that need to be parsed.
        try {
          const parsedChunk = JSON.parse(chunk.toString());
          ws.send(JSON.stringify(parsedChunk));
        } catch (error) {
          // Handle JSON parsing error
          console.error('Error parsing chunk:', error);
        }
      });

      responseStream.data.on('end', () => {
        ws.send('Stream ended');
      });

    } catch (error) {
      ws.send(JSON.stringify({ error: error.message }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
