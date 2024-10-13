import { OpenAIStream, StreamingTextResponse, streamText } from 'ai';
import { Configuration, OpenAIApi } from 'openai-edge';
import { createOllama } from "ollama-ai-provider";

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Configure Ollama
const ollama = createOllama();

const LMSTUDIO_BASE_URL = 'http://localhost:1234/v1';

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();
    console.log(`Received request for model: ${model}`);

    let modelType, modelName;

    if (model.startsWith('gpt-')) {
      modelType = 'openai';
      modelName = model;
    } else if (model.startsWith('lmstudio:')) {
      modelType = 'lmstudio';
      modelName = model.split(':')[1];
    } else {
      modelType = 'ollama';
      modelName = model;
    }

    console.log(`Parsed model type: ${modelType}, model name: ${modelName}`);

    const systemMessage = `You are a helpful AI assistant`;

    const allMessages = [
      { role: "assistant", content: systemMessage },
      ...messages
    ];

    let stream;

    switch (modelType) {
      case 'openai':
        console.log('Using OpenAI model');
        const response = await openai.createChatCompletion({
          model: modelName,
          stream: true,
          messages: allMessages,
        });
        stream = OpenAIStream(response);
        break;

      case 'ollama':
        console.log('Using Ollama model');
        const result = await streamText({
          model: ollama(modelName),
          messages: messages,
        });
        stream = result.toDataStreamResponse().body;
        break;

      case 'lmstudio':
        console.log('Using LMStudio model');
        console.log(modelName);
        const lmStudioResponse = await fetch(`${LMSTUDIO_BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: allMessages,
            model: modelName,
            stream: true, // Change this to true
          }),
        });

        if (!lmStudioResponse.ok) {
          throw new Error(`LMStudio server error: ${lmStudioResponse.statusText}`);
        }

        // Use the OpenAIStream to handle the streaming response
        stream = OpenAIStream(lmStudioResponse);
        break;

      default:
        throw new Error(`Unknown model type: ${modelType}`);
    }

    console.log('Sending StreamingTextResponse');
    return new StreamingTextResponse(stream as ReadableStream);
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  if (action === 'models') {
    return getLMStudioModels();
  }

  return new Response('Invalid action', { status: 400 });
}

async function getLMStudioModels() {
  try {
    const response = await fetch(`${LMSTUDIO_BASE_URL}/models`);
    if (!response.ok) {
      throw new Error(`LMStudio server error: ${response.statusText}`);
    }
    const data = await response.json();
    
    // Transform the data to match the expected format
    const transformedData = data.data.map((model: any) => ({
      value: `lmstudio:${model.id}`,
      label: model.id,
      type: 'lmstudio'
    }));
    
    console.log('LMStudio models:', transformedData);
    
    return new Response(JSON.stringify(transformedData), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching LMStudio models:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch models' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


