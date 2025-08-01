// Simple environment variable loader for browser-based apps
// This reads from a .env file if available, otherwise falls back to config.js

class EnvLoader {
    constructor() {
        this.envVars = {};
        this.loadEnvVars();
    }

    async loadEnvVars() {
        try {
            // Try to load .env file if it exists
            const response = await fetch('.env');
            if (response.ok) {
                const envContent = await response.text();
                this.parseEnvContent(envContent);
                console.log('✅ Environment variables loaded from .env file');
            } else {
                console.log('ℹ️  No .env file found, using config.js fallback');
            }
        } catch (error) {
            console.log('ℹ️  Using config.js fallback for configuration');
        }
    }

    parseEnvContent(content) {
        const lines = content.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split('=');
                if (key && valueParts.length > 0) {
                    this.envVars[key.trim()] = valueParts.join('=').trim();
                }
            }
        }
    }

    get(key, defaultValue = null) {
        return this.envVars[key] || defaultValue;
    }

    has(key) {
        return key in this.envVars;
    }
}

// Export for use in other modules
export const envLoader = new EnvLoader(); 