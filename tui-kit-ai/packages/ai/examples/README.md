# AI Components Examples

This directory contains comprehensive examples and demonstrations of all AI components in the `@tui-kit-ai/ai` package.

## 📁 Directory Structure

```
examples/
├── basic/           # Individual component demonstrations
├── advanced/        # Complex workflows and integrations
├── dashboard/       # Complete application showcase
├── package.json     # Examples package configuration
└── README.md        # This file
```

## 🚀 Getting Started

### Prerequisites

- Python 3.6+ (for local server)
- Modern web browser
- Node.js 14+ (optional, for development)

### Running Examples

1. **Start the local server:**
   ```bash
   cd examples
   python -m http.server 8000
   ```

2. **Open your browser:**
   - Navigate to `http://localhost:8000`
   - Choose from the available example categories

### Alternative Methods

- **Using Node.js:**
  ```bash
  npx serve .
  ```

- **Using PHP:**
  ```bash
  php -S localhost:8000
  ```

## 📚 Example Categories

### 1. Basic Examples (`/basic/`)

Individual component demonstrations with interactive controls:

- **Stream Component** (`stream-example.html`)
  - Real-time streaming with progress tracking
  - Chunk management and statistics
  - Multiple streaming variants

- **CodeBlock Component** (`codeblock-example.html`)
  - Syntax highlighting for multiple languages
  - Line numbers and themes
  - Copy functionality and expandable blocks

- **TokenInfo Component** (`tokeninfo-example.html`)
  - Token usage tracking and cost analysis
  - Model information and pricing
  - Real-time metrics and breakdowns

- **ModelSelector Component** (`modelselector-example.html`)
  - AI model selection and comparison
  - Advanced filtering and sorting
  - Provider and capability filtering

- **WebSearchTool Component** (`websearch-example.html`)
  - Multi-engine web search
  - Search history and filters
  - Result metadata and types

- **PDFTool Component** (`pdftool-example.html`)
  - PDF document processing
  - Text, table, and image extraction
  - Content search and analysis

- **ImageAI Component** (`imageai-example.html`)
  - AI image generation and analysis
  - Prompt editing and gallery
  - Multiple model support

### 2. Advanced Examples (`/advanced/`)

Complex workflows and real-world applications:

- **AI Dashboard** (`ai-dashboard.html`)
  - Complete workflow demonstration
  - Component interaction and data flow
  - Automated execution and export

### 3. Dashboard Examples (`/dashboard/`)

Complete application showcase:

- **AI Components Dashboard** (`index.html`)
  - Full-featured AI application
  - All components working together
  - Real-time updates and status monitoring

## 🎯 Key Features Demonstrated

### Component Integration
- How different AI components work together
- Data flow between components
- Event handling and callbacks

### Real-time Updates
- Live streaming and progress tracking
- Dynamic content updates
- Status monitoring and notifications

### Interactive Controls
- Buttons and inputs for testing features
- Real-time configuration changes
- State management and persistence

### Mock Data
- Realistic sample data for testing
- Simulated AI responses
- Performance metrics and statistics

## 🔧 Technical Implementation

### Architecture Patterns
- **Event-Driven Architecture:** Components communicate through events
- **State Management:** Centralized state for complex workflows
- **Component Lifecycle:** Proper initialization and cleanup
- **Error Handling:** Graceful failure and recovery

### Mock Components
All examples use mock implementations that simulate the real component behavior:
- Realistic data and responses
- Proper timing and delays
- Error simulation and recovery
- Performance metrics

### Styling System
- Consistent dark theme across all examples
- Responsive design for different screen sizes
- Custom scrollbars and animations
- Accessibility features

## 📖 Usage Examples

### Basic Component Usage

```javascript
// Stream Component
const stream = new Stream({
  variant: 'realtime',
  showProgress: true,
  onChunk: (chunk) => console.log('New chunk:', chunk)
});

// CodeBlock Component
const codeBlock = new CodeBlock({
  language: 'typescript',
  theme: 'dark',
  showLineNumbers: true
});

// TokenInfo Component
const tokenInfo = new TokenInfo({
  model: 'gpt-4',
  showCost: true,
  showBreakdown: true
});
```

### Advanced Workflow

```javascript
// Complete AI workflow
const dashboard = new AIDashboard({
  components: {
    modelSelector: new ModelSelector(),
    tokenInfo: new TokenInfo(),
    webSearch: new WebSearchTool(),
    stream: new Stream(),
    codeBlock: new CodeBlock(),
    pdfTool: new PDFTool(),
    imageAI: new ImageAI()
  },
  onWorkflowComplete: (data) => console.log('Workflow completed:', data)
});
```

## 🎨 Customization

### Themes
- Dark theme (default)
- Light theme support
- Custom color schemes
- Responsive design

### Configuration
- Component-specific options
- Global settings
- Environment variables
- User preferences

### Extensions
- Custom components
- Additional workflows
- Integration examples
- Plugin development

## 🚀 Development

### Adding New Examples

1. Create a new HTML file in the appropriate directory
2. Include the necessary mock component classes
3. Add interactive controls and event handlers
4. Update the index.html file to include the new example
5. Test thoroughly across different browsers

### Mock Component Development

1. Extend the base mock component class
2. Implement the required methods and properties
3. Add realistic data and timing
4. Include error handling and edge cases
5. Document the component interface

### Styling Guidelines

1. Use the established color scheme
2. Maintain consistency with existing examples
3. Ensure responsive design
4. Test accessibility features
5. Optimize for performance

## 📊 Performance Considerations

### Optimization Techniques
- Lazy loading of components
- Efficient data handling
- Minimal DOM updates
- Proper event cleanup
- Memory management

### Best Practices
- Use requestAnimationFrame for animations
- Debounce user input
- Implement proper error boundaries
- Monitor performance metrics
- Test on different devices

## 🔍 Troubleshooting

### Common Issues

1. **Server not starting:**
   - Check Python version (3.6+ required)
   - Verify port 8000 is available
   - Try alternative ports or methods

2. **Components not loading:**
   - Check browser console for errors
   - Verify all dependencies are included
   - Clear browser cache

3. **Styling issues:**
   - Check CSS file loading
   - Verify responsive design
   - Test different screen sizes

### Debug Mode

Enable debug mode by adding `?debug=true` to the URL:
```
http://localhost:8000/basic/stream-example.html?debug=true
```

This will show additional console logging and error information.

## 📚 Additional Resources

- [Main Package Documentation](../../README.md)
- [API Reference](../../docs/api.md)
- [Component Guide](../../docs/components.md)
- [Integration Examples](../../docs/integration.md)
- [Troubleshooting Guide](../../docs/troubleshooting.md)

## 🤝 Contributing

We welcome contributions to improve these examples:

1. **Bug Reports:** Report issues with specific examples
2. **Feature Requests:** Suggest new example scenarios
3. **Code Contributions:** Submit improvements or new examples
4. **Documentation:** Help improve this README and other docs

### Contribution Guidelines

1. Follow the existing code style and patterns
2. Test thoroughly across different browsers
3. Update documentation as needed
4. Submit pull requests with clear descriptions
5. Ensure all examples work correctly

## 📄 License

This examples package is licensed under the MIT License. See the main package LICENSE file for details.

## 🆘 Support

For support with these examples:

1. Check the troubleshooting section above
2. Review the main package documentation
3. Search existing issues on GitHub
4. Create a new issue with detailed information
5. Join our community discussions

---

**Happy coding with AI components! 🚀**