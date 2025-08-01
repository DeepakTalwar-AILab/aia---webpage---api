# OpenAI Text Summarizer

A simple, elegant webpage for summarizing text using OpenAI's GPT-4 API with customizable creativity levels and consulting firm-inspired themes.

## Features

- **Text Summarization**: Input text and get AI-powered summaries using GPT-4
- **Temperature Control**: Slider (1-10) to adjust from factual (1) to creative (10) summaries
- **Theme Switching**: Choose between three consulting firm-inspired designs:
  - Bain & Company style (clean, modern blue/white)
  - McKinsey & Company style (sophisticated navy/gold)
  - Boston Consulting Group style (bold green/black)
- **Cost Tracking**: Real-time cost estimates and session total
- **Secure**: Uses your own OpenAI API key (stored locally, never transmitted to servers)

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **API**: OpenAI GPT-4 API
- **Storage**: Local browser storage for API key and session data
- **No frameworks**: Lightweight, fast loading, easy to deploy

## Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- OpenAI API key with GPT-4 access
- Basic understanding of API usage and costs

## Setup Instructions

1. **Clone or Download**
   ```bash
   git clone [repository-url]
   # OR download and extract ZIP file
   ```

2. **Configure API Key**
   ```bash
   # Copy the example config file
   cp config.example.js config.js
   
   # Edit config.js and add your OpenAI API key
   # Replace 'your-openai-api-key-here' with your actual key
   ```

3. **File Structure**
   ```
   openai-summarizer/
   ├── index.html          # Main webpage
   ├── config.js           # Your API key configuration (create from example)
   ├── config.example.js   # Template for API key setup
   ├── .gitignore          # Keeps your API key secure
   ├── styles/
   │   ├── main.css        # Base styles and layout
   │   ├── bain.css        # Bain & Company theme (coming in milestone 3)
   │   ├── mckinsey.css    # McKinsey & Company theme (coming in milestone 3)
   │   └── bcg.css         # Boston Consulting Group theme (coming in milestone 3)
   ├── scripts/
   │   ├── app.js          # Main application logic
   │   ├── api.js          # OpenAI API integration
   │   ├── themes.js       # Theme switching functionality (coming in milestone 2)
   │   └── cost-calculator.js # Cost estimation logic
   └── README.md           # This file
   ```

4. **Launch**
   - Open `index.html` in your web browser
   - Or serve via local server: `python -m http.server 8000`
   - No build process required!

## Usage

### Initial Setup
1. Copy `config.example.js` to `config.js`
2. Edit `config.js` and replace `'your-openai-api-key-here'` with your actual OpenAI API key
3. Open the webpage - your key will be loaded automatically

### Summarizing Text
1. Paste or type text in the input area
2. Adjust temperature slider (1 = factual, 10 = creative)
3. Select desired theme from dropdown
4. Review estimated cost
5. Click "Summarize" to generate summary

### Cost Information
- **Estimated Cost**: Shown before API call based on input token count
- **Session Total**: Running total of all requests in current session
- **Rate Information**: Current GPT-4 pricing displayed for reference

## Theme Details

### Bain & Company Style
- **Colors**: Clean blues (#0066CC) with white backgrounds
- **Typography**: Modern sans-serif fonts (Source Sans Pro)
- **Layout**: Minimal, spacious design with subtle shadows
- **Elements**: Simple icons, clean lines, professional feel

### McKinsey & Company Style  
- **Colors**: Navy blue (#003366) with gold accents (#FFD700)
- **Typography**: Elegant serif headings (Playfair Display) with sans-serif body
- **Layout**: Sophisticated grid system with structured sections
- **Elements**: Refined borders, premium feel, data-driven aesthetics

### Boston Consulting Group Style
- **Colors**: BCG green (#00A651) with charcoal black (#333333)
- **Typography**: Bold, impactful fonts (Montserrat)
- **Layout**: Dynamic, modern with strong geometric elements
- **Elements**: Sharp corners, high contrast, innovation-focused design

## Technical Implementation

### API Integration
- **Model**: GPT-4 (gpt-4-turbo-preview for optimal cost/performance)
- **Temperature**: User-controlled (0.1-1.0 mapped from 1-10 slider)
- **Max Tokens**: Dynamically calculated based on input length
- **Prompt Engineering**: Optimized prompts for summarization quality

### Cost Calculation
- **Input Tokens**: Estimated using tiktoken-like calculation
- **Output Tokens**: Estimated at 25% of input length (adjustable)
- **Pricing**: 
  - Input: $0.01 per 1K tokens
  - Output: $0.03 per 1K tokens
- **Updates**: Prices updated in code as OpenAI adjusts rates

### Security & Privacy
- API keys stored in local config.js file (never committed to git)
- No server-side storage or transmission of sensitive data
- All API calls made directly from browser to OpenAI
- .gitignore prevents accidental key exposure

## File Specifications

### Core Files

**index.html**
- Semantic HTML5 structure
- Accessibility features (ARIA labels, proper headings)
- Mobile-responsive meta tags
- Theme stylesheet imports

**styles/main.css**
- CSS Grid/Flexbox layout
- Mobile-first responsive design
- CSS custom properties for theme variables
- Smooth transitions and animations

**scripts/app.js**
- Main application controller
- Event handlers for UI interactions
- State management for user inputs
- Integration between all modules

**scripts/api.js**
- OpenAI API client implementation
- Token counting utilities
- Error handling and retry logic
- Response parsing and formatting

**scripts/themes.js**
- Dynamic theme switching
- CSS class management
- Theme persistence in localStorage
- Smooth theme transitions

**scripts/cost-calculator.js**
- Token estimation algorithms
- Real-time cost calculations
- Session tracking and totals
- Cost display formatting

## Development Notes

### Browser Compatibility
- ES6+ features used (modules, async/await, arrow functions)
- Modern browsers required (last 2 versions)
- Graceful degradation for unsupported features

### Performance
- Minimal dependencies
- Efficient DOM manipulation
- Debounced API calls
- Optimized CSS with minimal repaints

### Extensibility
- Modular architecture for easy feature additions
- Clear separation of concerns
- Well-documented functions and classes
- Easy theme addition through CSS files

## Deployment

### Static Hosting
- Can be deployed to any static host (GitHub Pages, Netlify, Vercel)
- No server-side requirements
- HTTPS recommended for API key security

### Local Development
- No build process required
- Live reload with browser dev tools
- CSS/JS changes reflect immediately

## Cost Management

### Estimation Accuracy
- Token counting: ~95% accuracy compared to OpenAI's counting
- Cost estimates include 10% buffer for safety
- Real costs updated after each API response

### Usage Tips
- Shorter texts = lower costs
- Temperature doesn't affect cost (only quality)
- Monitor session total to control spending
- Clear session data to reset counters

## Troubleshooting

### Common Issues
- **API Key Errors**: Verify key has GPT-4 access and sufficient credits
- **Network Issues**: Check internet connection and CORS settings
- **Theme Not Loading**: Clear browser cache and reload page
- **Cost Estimates Off**: Refresh page to get latest pricing

### Error Handling
- Graceful fallbacks for API failures
- User-friendly error messages
- Automatic retry for temporary failures
- Validation for all user inputs

## Contributing

This is a simple project designed for personal use. Feel free to:
- Fork and modify for your needs
- Add new themes or features
- Improve cost calculation accuracy
- Enhance mobile responsiveness

## License

MIT License - feel free to use and modify as needed.

## Disclaimer

- This tool is for educational/personal use
- Monitor your OpenAI usage and costs
- API keys and usage are your responsibility
- Themes are inspired by but not affiliated with mentioned consulting firms 