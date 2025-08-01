#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment variables...\n');

// Check if .env already exists
if (fs.existsSync('.env')) {
    console.log('⚠️  .env file already exists. Skipping creation.');
    process.exit(0);
}

// Create .env file with template
const envContent = `# OpenAI API Configuration
# Add your OpenAI API key here
OPENAI_API_KEY=your-openai-api-key-here

# Optional: Override default settings
MODEL=gpt-4-turbo-preview
MAX_TOKENS=1000

# Cost settings (update if OpenAI changes pricing)
INPUT_COST_PER_1K=0.01
OUTPUT_COST_PER_1K=0.03
`;

try {
    fs.writeFileSync('.env', envContent);
    console.log('✅ Created .env file successfully!');
    console.log('📝 Please edit .env file and add your actual OpenAI API key');
    console.log('🔒 The .env file is already in .gitignore for security');
} catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    process.exit(1);
} 