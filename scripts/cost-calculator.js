// Cost Calculator for OpenAI API Usage
export class CostCalculator {
    constructor() {
        // GPT-4 Turbo Preview pricing (as of 2024)
        this.pricing = {
            inputCostPer1k: 0.01,   // $0.01 per 1K input tokens
            outputCostPer1k: 0.03,  // $0.03 per 1K output tokens
            model: 'gpt-4-turbo-preview'
        };
        
        // Safety buffer for cost estimates (10% extra)
        this.estimateBuffer = 1.1;
    }

    estimateCost(inputText, temperature = 0.5) {
        const inputTokens = this.estimateTokenCount(inputText);
        const outputTokens = this.estimateOutputTokens(inputText);
        
        const inputCost = (inputTokens / 1000) * this.pricing.inputCostPer1k;
        const outputCost = (outputTokens / 1000) * this.pricing.outputCostPer1k;
        
        const totalCost = (inputCost + outputCost) * this.estimateBuffer;
        
        return Math.max(0.0001, totalCost); // Minimum cost display
    }

    estimateTokenCount(text) {
        if (!text || text.trim().length === 0) {
            return 0;
        }

        // Enhanced token estimation that accounts for:
        // - Average token length in English
        // - Punctuation and special characters
        // - Word boundaries and spacing
        
        const cleanText = text.trim();
        
        // Basic estimation: ~4 characters per token for English
        let baseEstimate = Math.ceil(cleanText.length / 4);
        
        // Adjust for word count (tokens often align with words)
        const wordCount = cleanText.split(/\\s+/).length;
        const wordBasedEstimate = Math.ceil(wordCount * 1.3); // Words + punctuation/subwords
        
        // Use the higher estimate for safety
        const tokenEstimate = Math.max(baseEstimate, wordBasedEstimate);
        
        // Add system message tokens (~50 tokens for our summarization prompt)
        return tokenEstimate + 50;
    }

    estimateOutputTokens(inputText) {
        const inputTokens = this.estimateTokenCount(inputText) - 50; // Subtract system message
        
        // Summary length estimation based on input length
        let outputRatio;
        
        if (inputTokens < 100) {
            outputRatio = 0.8; // Short texts might need proportionally longer summaries
        } else if (inputTokens < 500) {
            outputRatio = 0.4; // Medium texts
        } else if (inputTokens < 1500) {
            outputRatio = 0.25; // Longer texts can be summarized more efficiently
        } else {
            outputRatio = 0.2; // Very long texts
        }
        
        const estimatedOutput = Math.ceil(inputTokens * outputRatio);
        
        // Set reasonable bounds
        return Math.max(50, Math.min(800, estimatedOutput));
    }

    getDetailedCostBreakdown(inputText) {
        const inputTokens = this.estimateTokenCount(inputText);
        const outputTokens = this.estimateOutputTokens(inputText);
        
        const inputCost = (inputTokens / 1000) * this.pricing.inputCostPer1k;
        const outputCost = (outputTokens / 1000) * this.pricing.outputCostPer1k;
        const totalCost = (inputCost + outputCost) * this.estimateBuffer;
        
        return {
            inputTokens,
            outputTokens,
            totalTokens: inputTokens + outputTokens,
            inputCost,
            outputCost,
            totalCost,
            pricing: this.pricing,
            isEstimate: true
        };
    }

    formatCost(cost) {
        if (cost < 0.001) {
            return '<$0.001';
        }
        return `$${cost.toFixed(4)}`;
    }

    updatePricing(newPricing) {
        this.pricing = { ...this.pricing, ...newPricing };
    }

    // Utility methods for cost tracking
    calculateSavings(originalLength, summaryLength) {
        // Estimate how much "reading time" or "processing cost" is saved
        const compressionRatio = summaryLength / originalLength;
        const timeRatio = 1 - compressionRatio;
        
        return {
            compressionRatio: compressionRatio.toFixed(2),
            timeSaved: `${(timeRatio * 100).toFixed(1)}%`,
            originalTokens: this.estimateTokenCount(originalLength.toString()),
            summaryTokens: this.estimateTokenCount(summaryLength.toString())
        };
    }

    // Get cost per word for user understanding
    getCostPerWord(inputText) {
        const wordCount = inputText.trim().split(/\\s+/).length;
        const totalCost = this.estimateCost(inputText);
        
        if (wordCount === 0) return 0;
        
        return totalCost / wordCount;
    }

    // Validate if cost is within reasonable bounds
    validateCost(estimatedCost, actualCost) {
        const ratio = actualCost / estimatedCost;
        
        return {
            isAccurate: ratio >= 0.7 && ratio <= 1.3, // Within 30% is considered accurate
            ratio: ratio.toFixed(2),
            difference: Math.abs(actualCost - estimatedCost),
            percentageOff: Math.abs((ratio - 1) * 100).toFixed(1)
        };
    }
}