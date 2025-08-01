// OpenAI API Integration
export class OpenAIAPI {
    constructor() {
        this.apiKey = null;
        this.baseUrl = 'https://api.openai.com/v1';
        this.model = 'gpt-4-turbo-preview';
    }

    setApiKey(key) {
        this.apiKey = key;
    }

    hasApiKey() {
        return this.apiKey && this.apiKey.length > 0;
    }

    async summarizeText(text, temperature = 0.5) {
        if (!this.hasApiKey()) {
            throw new Error('API key not set');
        }

        const prompt = this.buildSummarizationPrompt(text, temperature);
        
        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a professional text summarizer. Create clear, concise summaries that capture the key points and main ideas of the provided text.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: temperature,
                    max_tokens: this.calculateMaxTokens(text),
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0
                })
            });

            if (!response.ok) {
                await this.handleAPIError(response);
            }

            const data = await response.json();
            
            return {
                summary: data.choices[0].message.content.trim(),
                cost: this.calculateActualCost(data.usage),
                usage: data.usage
            };

        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error: Unable to connect to OpenAI API');
            }
            throw error;
        }
    }

    buildSummarizationPrompt(text, temperature) {
        const style = temperature < 0.3 ? 'factual and objective' : 
                     temperature < 0.7 ? 'balanced and informative' : 
                     'creative and engaging';

        return `Please provide a ${style} summary of the following text. Focus on the main points and key insights:\\n\\n${text}\\n\\nSummary:`;
    }

    calculateMaxTokens(inputText) {
        // Estimate input tokens (roughly 1 token per 4 characters)
        const estimatedInputTokens = Math.ceil(inputText.length / 4);
        
        // Set max output tokens to be 25-30% of input length, with reasonable bounds
        const outputTokens = Math.max(
            100,  // minimum
            Math.min(
                1000,  // maximum for summaries
                Math.ceil(estimatedInputTokens * 0.3)
            )
        );
        
        return outputTokens;
    }

    calculateActualCost(usage) {
        // GPT-4 Turbo Preview pricing (as of 2024)
        const inputCostPer1k = 0.01;   // $0.01 per 1K input tokens
        const outputCostPer1k = 0.03;  // $0.03 per 1K output tokens

        const inputCost = (usage.prompt_tokens / 1000) * inputCostPer1k;
        const outputCost = (usage.completion_tokens / 1000) * outputCostPer1k;

        return inputCost + outputCost;
    }

    async handleAPIError(response) {
        let errorMessage = 'Unknown API error';
        
        try {
            const errorData = await response.json();
            
            switch (response.status) {
                case 401:
                    errorMessage = 'Invalid API key. Please check your OpenAI API key.';
                    break;
                case 403:
                    errorMessage = 'Access forbidden. Your API key may not have GPT-4 access.';
                    break;
                case 429:
                    if (errorData.error?.message?.includes('quota')) {
                        errorMessage = 'API quota exceeded. Please check your OpenAI account billing.';
                    } else {
                        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
                    }
                    break;
                case 400:
                    errorMessage = `Bad request: ${errorData.error?.message || 'Invalid request parameters'}`;
                    break;
                case 500:
                case 502:
                case 503:
                    errorMessage = 'OpenAI server error. Please try again in a moment.';
                    break;
                default:
                    errorMessage = `API error (${response.status}): ${errorData.error?.message || 'Unknown error'}`;
            }
        } catch (parseError) {
            errorMessage = `API error (${response.status}): Unable to parse error response`;
        }

        throw new Error(errorMessage);
    }

    // Utility method to count tokens (rough estimation)
    estimateTokenCount(text) {
        // Rough estimation: 1 token ≈ 4 characters for English text
        // This is not perfectly accurate but good enough for cost estimation
        return Math.ceil(text.length / 4);
    }

    // Get current model pricing
    getPricing() {
        return {
            model: this.model,
            inputCostPer1k: 0.01,
            outputCostPer1k: 0.03,
            currency: 'USD'
        };
    }
}