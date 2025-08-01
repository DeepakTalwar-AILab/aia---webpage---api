// Configuration file template
// Copy this file to 'config.js' and add your actual OpenAI API key

export const CONFIG = {
    OPENAI_API_KEY: 'your-openai-api-key-here',
    
    // Optional: Override default settings
    MODEL: 'gpt-4-turbo-preview',
    MAX_TOKENS: 1000,
    
    // Cost settings (update if OpenAI changes pricing)
    PRICING: {
        INPUT_COST_PER_1K: 0.01,   // $0.01 per 1K input tokens
        OUTPUT_COST_PER_1K: 0.03   // $0.03 per 1K output tokens
    }
};

// Instructions:
// 1. Copy this file to 'config.js'
// 2. Replace 'your-openai-api-key-here' with your actual OpenAI API key
// 3. Get your API key from: https://platform.openai.com/api-keys
// 4. Make sure your key has GPT-4 access and sufficient credits
// 5. Save the file and refresh your browser