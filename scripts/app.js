// OpenAI Text Summarizer - Main Application
import { OpenAIAPI } from './api.js';
import { CostCalculator } from './cost-calculator.js';
import { CONFIG } from '../config.js';
import { envLoader } from './env-loader.js';

class TextSummarizer {
    constructor() {
        this.api = new OpenAIAPI();
        this.costCalculator = new CostCalculator();
        this.sessionTotal = 0;
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadSessionData();
        this.checkAPIKey().catch(console.error);
    }

    initializeElements() {
        // Input elements
        this.textInput = document.getElementById('text-input');
        this.temperatureSlider = document.getElementById('temperature-slider');
        this.temperatureValue = document.getElementById('temperature-value');
        this.summarizeBtn = document.getElementById('summarize-btn');
        
        // Output elements
        this.summaryOutput = document.getElementById('summary-output');
        this.costEstimate = document.getElementById('cost-estimate');
        this.actualCost = document.getElementById('actual-cost');
        this.sessionTotalElement = document.getElementById('session-total');
        
        // UI elements
        this.loading = document.getElementById('loading');
        this.errorMessage = document.getElementById('error-message');
    }

    attachEventListeners() {
        // Temperature slider
        this.temperatureSlider.addEventListener('input', (e) => {
            this.temperatureValue.textContent = e.target.value;
        });

        // Text input for cost estimation
        this.textInput.addEventListener('input', () => {
            this.updateCostEstimate();
        });

        // Summarize button
        this.summarizeBtn.addEventListener('click', () => {
            this.handleSummarize();
        });

        // Enter key in text area (Ctrl+Enter to summarize)
        this.textInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.handleSummarize();
            }
        });
    }

    loadSessionData() {
        const saved = localStorage.getItem('summarizer_session');
        if (saved) {
            const data = JSON.parse(saved);
            this.sessionTotal = data.total || 0;
            this.updateSessionTotal();
        }
    }

    saveSessionData() {
        localStorage.setItem('summarizer_session', JSON.stringify({
            total: this.sessionTotal,
            timestamp: Date.now()
        }));
    }

    async checkAPIKey() {
        // Wait for environment variables to load
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Try to get API key from .env file first
        const envApiKey = envLoader.get('OPENAI_API_KEY');
        if (envApiKey && envApiKey !== 'your-openai-api-key-here') {
            this.api.setApiKey(envApiKey);
            console.log('✅ API key loaded from .env file');
            return;
        }

        // Try to get API key from config.js as fallback
        if (CONFIG.OPENAI_API_KEY && CONFIG.OPENAI_API_KEY !== 'your-openai-api-key-here') {
            this.api.setApiKey(CONFIG.OPENAI_API_KEY);
            console.log('✅ API key loaded from config.js');
            return;
        }

        // Fallback to localStorage if config not set
        const savedKey = localStorage.getItem('openai_api_key');
        if (savedKey) {
            this.api.setApiKey(savedKey);
            console.log('✅ API key loaded from browser storage');
            return;
        }

        // Show helpful error if no key found
        this.showError(
            'Please add your OpenAI API key to .env file or config.js file. ' +
            'Run "node setup-env.js" to create .env file template.'
        );
        this.summarizeBtn.disabled = true;
    }

    updateCostEstimate() {
        const text = this.textInput.value.trim();
        if (text) {
            const estimate = this.costCalculator.estimateCost(text);
            this.costEstimate.textContent = `$${estimate.toFixed(4)}`;
        } else {
            this.costEstimate.textContent = '$0.00';
        }
    }

    async handleSummarize() {
        const text = this.textInput.value.trim();
        
        if (!text) {
            this.showError('Please enter some text to summarize.');
            return;
        }

        if (!this.api.hasApiKey()) {
            this.showError('API key not configured. Please check config.js file.');
            return;
        }

        try {
            this.showLoading(true);
            this.summarizeBtn.disabled = true;

            const temperature = parseInt(this.temperatureSlider.value);
            const mappedTemperature = this.mapTemperature(temperature);

            const result = await this.api.summarizeText(text, mappedTemperature);
            
            this.displaySummary(result.summary);
            this.updateActualCost(result.cost);
            this.addToSessionTotal(result.cost);
            
        } catch (error) {
            console.error('Summarization error:', error);
            this.showError(this.getErrorMessage(error));
        } finally {
            this.showLoading(false);
            this.summarizeBtn.disabled = false;
        }
    }

    mapTemperature(sliderValue) {
        // Map 1-10 slider to 0.1-1.0 temperature
        return Math.max(0.1, Math.min(1.0, sliderValue / 10));
    }

    displaySummary(summary) {
        this.summaryOutput.innerHTML = `<div class="content">${summary}</div>`;
    }

    updateActualCost(cost) {
        this.actualCost.textContent = `Actual cost: $${cost.toFixed(4)}`;
    }

    addToSessionTotal(cost) {
        this.sessionTotal += cost;
        this.updateSessionTotal();
        this.saveSessionData();
    }

    updateSessionTotal() {
        this.sessionTotalElement.textContent = `$${this.sessionTotal.toFixed(4)}`;
    }

    showLoading(show) {
        this.loading.classList.toggle('hidden', !show);
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.remove('hidden');
        
        setTimeout(() => {
            this.errorMessage.classList.add('hidden');
        }, 5000);
    }

    showSuccess(message) {
        // Temporarily use error message styling for success
        this.errorMessage.style.background = 'var(--success)';
        this.errorMessage.textContent = message;
        this.errorMessage.classList.remove('hidden');
        
        setTimeout(() => {
            this.errorMessage.classList.add('hidden');
            this.errorMessage.style.background = 'var(--error)';
        }, 3000);
    }

    getErrorMessage(error) {
        if (error.message.includes('API key')) {
            return 'Invalid API key. Please check your OpenAI API key.';
        } else if (error.message.includes('quota')) {
            return 'API quota exceeded. Please check your OpenAI account billing.';
        } else if (error.message.includes('rate limit')) {
            return 'Rate limit exceeded. Please wait a moment and try again.';
        } else if (error.message.includes('network')) {
            return 'Network error. Please check your internet connection.';
        } else {
            return `Error: ${error.message}`;
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TextSummarizer();
});

// Add option to clear session data (for development/testing)
window.clearSessionData = () => {
    localStorage.removeItem('summarizer_session');
    location.reload();
};