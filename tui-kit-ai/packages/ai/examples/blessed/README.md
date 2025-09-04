# AI Components - Blessed Examples

This directory contains Blessed-based examples for the AI components package. These examples demonstrate how to use the AI components in a terminal environment using the Blessed library.

## 🚀 Getting Started

### Prerequisites

- Node.js 14+
- TypeScript
- Terminal with Unicode support

### Installation

```bash
cd examples/blessed
npm install
```

### Running Examples

#### Stream Component
```bash
npm run stream
```

#### CodeBlock Component
```bash
npm run codeblock
```

#### TokenInfo Component
```bash
npm run tokeninfo
```

#### Run All Examples
```bash
npm run all
```

## 📚 Examples Overview

### Stream Component Example (`stream-example.ts`)

Demonstrates real-time streaming with progress tracking and statistics.

**Features:**
- Real-time chunk streaming
- Progress tracking
- Statistics display
- Pause/resume functionality
- Mock data generation

**Controls:**
- `s` - Start streaming
- `p` - Pause/resume
- `r` - Reset
- `q` - Quit

### CodeBlock Component Example (`codeblock-example.ts`)

Shows syntax highlighting with line numbers and multi-language support.

**Features:**
- Syntax highlighting for multiple languages
- Line numbers
- Multiple themes
- Copy functionality
- Expandable blocks

**Controls:**
- `l` - Change language
- `t` - Change theme
- `c` - Copy code
- `e` - Toggle expand
- `q` - Quit

### TokenInfo Component Example (`tokeninfo-example.ts`)

Displays token usage tracking with cost analysis and model information.

**Features:**
- Token usage tracking
- Cost analysis
- Model information
- Real-time updates
- Multiple AI models

**Controls:**
- `+` - Add tokens
- `-` - Subtract tokens
- `m` - Change model
- `r` - Reset
- `q` - Quit

## 🎯 Key Features

### Terminal UI
- Full terminal interface using Blessed
- Responsive design
- Keyboard navigation
- Color-coded information
- Real-time updates

### Interactive Controls
- Keyboard shortcuts for all functions
- Real-time feedback
- Status indicators
- Progress tracking

### Mock Data
- Realistic sample data
- Simulated AI responses
- Performance metrics
- Error simulation

## 🔧 Technical Implementation

### Architecture
- **Blessed Integration:** Full terminal UI using Blessed library
- **Component System:** Modular component architecture
- **Event Handling:** Keyboard and mouse event support
- **State Management:** Real-time state updates

### Styling
- **Color Themes:** Consistent color schemes
- **Layout:** Responsive terminal layouts
- **Typography:** Monospace font support
- **Visual Feedback:** Status indicators and progress bars

### Performance
- **Efficient Rendering:** Optimized for terminal performance
- **Memory Management:** Proper cleanup and resource management
- **Real-time Updates:** Smooth animations and transitions

## 📖 Usage Examples

### Basic Component Usage

```typescript
import { Stream } from '@tui-kit-ai/ai';

const stream = new Stream({
  variant: 'realtime',
  showProgress: true,
  onChunk: (chunk) => console.log('New chunk:', chunk)
});

stream.start();
```

### Advanced Configuration

```typescript
import { CodeBlock } from '@tui-kit-ai/ai';

const codeBlock = new CodeBlock({
  language: 'typescript',
  theme: 'dark',
  showLineNumbers: true,
  showCopyButton: true,
  expandable: true
});

codeBlock.setCode(sampleCode);
```

## 🎨 Customization

### Themes
- Dark theme (default)
- Light theme
- Custom color schemes
- Terminal-specific optimizations

### Layout
- Responsive design
- Flexible sizing
- Multiple view modes
- Custom layouts

### Functionality
- Configurable features
- Custom event handlers
- Extensible components
- Plugin support

## 🚀 Development

### Adding New Examples

1. Create a new TypeScript file
2. Import the required components
3. Set up Blessed screen and containers
4. Add event handlers
5. Update package.json scripts

### Component Development

1. Extend base component classes
2. Implement required methods
3. Add terminal-specific features
4. Test with different terminals
5. Document usage

### Testing

1. Test in different terminals
2. Verify keyboard shortcuts
3. Check color rendering
4. Test performance
5. Validate accessibility

## 🔍 Troubleshooting

### Common Issues

1. **Terminal Compatibility:**
   - Ensure Unicode support
   - Check color capabilities
   - Verify keyboard input

2. **Performance Issues:**
   - Reduce update frequency
   - Optimize rendering
   - Check memory usage

3. **Display Problems:**
   - Verify terminal size
   - Check color support
   - Test font rendering

### Debug Mode

Enable debug logging by setting environment variable:
```bash
DEBUG=* npm run stream
```

## 📚 Additional Resources

- [Blessed Documentation](https://github.com/chjj/blessed)
- [Terminal UI Best Practices](https://github.com/chjj/blessed/wiki)
- [AI Components Documentation](../../README.md)
- [Component API Reference](../../docs/api.md)

## 🤝 Contributing

We welcome contributions to improve these examples:

1. **Bug Reports:** Report issues with specific examples
2. **Feature Requests:** Suggest new example scenarios
3. **Code Contributions:** Submit improvements or new examples
4. **Documentation:** Help improve this README

### Contribution Guidelines

1. Follow the existing code style
2. Test thoroughly in different terminals
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

**Happy coding with AI components in the terminal! 🚀**