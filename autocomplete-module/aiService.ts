import { processSuggestion } from './suggestionProcessor';
import { Configuration, OpenAIApi } from 'openai-edge';

interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export const modelMaxLengths: { [key: string]: number } = {
    'anthropic/claude-3-haiku-20240307': 8192,
    'openai/gpt-4o-mini': 8192,
    'lmstudio': 8192, // Default value for LMStudio models
};

const LMSTUDIO_BASE_URL = 'http://localhost:1234/v1';

// Configure OpenAI
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export type RoleType = 
    "General AI Writer" | 
    "Content Marketing Expert" | 
    "Genius Highschool Student" | 
    "Worldclass Scientist" | 
    "Famous Journalist" | 
    "Great Writer";

export const roles: Record<RoleType, string> = {
    "General AI Writer": "You are a versatile AI writer capable of producing high-quality content across diverse topics. Your writing is clear, engaging, and seamlessly adaptable to different tones, formats, and audiences, ensuring the message is both informative and impactful.",
    "Content Marketing Expert": "You are a seasoned content marketing expert with a deep understanding of audience engagement, SEO strategies, and persuasive storytelling. You excel at crafting content that drives conversions and brand awareness across various platforms, from social media to blogs and email campaigns.",
    "Genius Highschool Student": "You are an exceptionally gifted high school student, with deep knowledge across multiple subjects. Your explanations are clear, concise, and approachable, making complex concepts easy to understand for both peers and adults alike.",
    "Worldclass Scientist": "You are a world-class scientist with expertise spanning multiple disciplines. Your writing is rigorously analytical, grounded in the latest research, and presented with precision. You excel at communicating complex scientific concepts in a clear, data-driven manner, suitable for both academic and public audiences.",
    "Famous Journalist": "You are a celebrated journalist, acclaimed for your investigative depth and compelling storytelling. Your writing is both objective and insightful, uncovering nuanced perspectives and capturing the essence of complex issues with clarity and authority.",
    "Great Writer": "You are a literary virtuoso, with an unparalleled mastery of language and narrative craft. Your writing is eloquent, evocative, and filled with rich imagery and deep emotion, leaving a lasting impression on readers through its beauty and profound insight."
};

export const defaultRole: RoleType = "General AI Writer";

export async function generateSuggestion(input: string, model: string, role: RoleType = defaultRole): Promise<string> {
    let modelType: string, modelName: string;

    if (model.startsWith('openai/')) {
        modelType = 'openai';
        modelName = model.split('/')[1];
        if (modelName === 'gpt-4o-mini') {
            modelName = 'gpt-4o-mini';  // Don't change this to 'gpt-4'
        }
    } else if (model.startsWith('lmstudio:')) {
        modelType = 'lmstudio';
        modelName = model.split(':')[1];
    } else {
        modelType = 'anthropic';
        modelName = model;
    }

    // System prompt is included in the messages array for OpenAI and LMStudio
    const messages: Message[] = [
        { 
            role: 'system', 
            content: roles[role]
        },
        { 
            role: 'user', 
            content: `Continue this text with a few words or up to 2 sentences: ${input}` 
        }
    ];

    let suggestion: string;

    try {
        switch (modelType) {
            case 'openai':
                suggestion = await handleOpenAIRequest(modelName, messages);
                break;
            case 'lmstudio':
                suggestion = await handleLMStudioRequest(modelName, messages);
                break;
            case 'anthropic':
                suggestion = await handleAnthropicRequest(modelName, messages, role);
                break;
            default:
                throw new Error(`Unknown model type: ${modelType}`);
        }

        return processSuggestion(input, suggestion);
    } catch (error) {
        throw error;
    }
}

async function handleOpenAIRequest(modelName: string, messages: Message[]): Promise<string> {
    // OpenAI receives the system prompt as part of the messages array
    const openAIMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
    }));

    try {
        const response = await openai.createChatCompletion({
            model: modelName,
            messages: openAIMessages,
            max_tokens: 50,
            stream: false,
        });

        const completion = await response.json();
        const content = completion.choices[0].message.content;

        return content.trim();
    } catch (error) {
        throw new Error(`Failed to generate suggestion: ${error}`);
    }
}

async function handleLMStudioRequest(modelName: string, messages: Message[]): Promise<string> {
    // LMStudio receives the system prompt as part of the messages array
    const response = await fetch(`${LMSTUDIO_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages: messages,
            model: modelName,
            max_tokens: 50,
        }),
    });

    if (!response.ok) {
        throw new Error(`LMStudio server error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

async function handleAnthropicRequest(modelName: string, messages: Message[], role: RoleType): Promise<string> {
    // For Anthropic, we separate the system prompt from the messages
    const userMessages = messages.filter(msg => msg.role !== 'system');

    const response = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages: userMessages,
            model: modelName,
            max_tokens: 50,
            system: roles[role], // System prompt is sent as a separate parameter for Anthropic
        }),
    });

    if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    return await response.text();
}
