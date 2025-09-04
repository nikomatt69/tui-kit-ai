import blessed from 'blessed';
import { ButtonComponent } from './components/ui/button';
import { InputComponent } from './components/ui/input';

// Create a screen object
const screen = blessed.screen({
  smartCSR: true,
  title: 'TUI Kit Demo'
});

// Create a main container
const mainBox = blessed.box({
  parent: screen,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  content: 'TUI Kit Demo Application',
  style: {
    fg: 'white',
    bg: 'black',
    border: { fg: 'white' }
  },
  border: { type: 'line' }
});

// Create a title
const title = blessed.text({
  parent: mainBox,
  top: 1,
  left: 2,
  content: 'Welcome to TUI Kit!',
  style: {
    fg: 'cyan',
    bold: true
  }
});

// Create an input field
const input = InputComponent({
  parent: mainBox,
  top: 4,
  left: 2,
  width: 30,
  height: 3,
  placeholder: 'Enter your name...',
  onChange: (value) => {
    console.log('Input changed:', value);
  },
  onEnter: (value) => {
    console.log('Enter pressed with value:', value);
  }
});

// Create buttons
const primaryButton = ButtonComponent({
  parent: mainBox,
  top: 8,
  left: 2,
  width: 15,
  variant: 'primary',
  children: 'Primary Button',
  onClick: () => {
    console.log('Primary button clicked!');
  }
});

const secondaryButton = ButtonComponent({
  parent: mainBox,
  top: 8,
  left: 20,
  width: 15,
  variant: 'secondary',
  children: 'Secondary Button',
  onClick: () => {
    console.log('Secondary button clicked!');
  }
});

const dangerButton = ButtonComponent({
  parent: mainBox,
  top: 12,
  left: 2,
  width: 15,
  variant: 'danger',
  children: 'Danger Button',
  onClick: () => {
    console.log('Danger button clicked!');
  }
});

// Quit on Escape, q, or Control-C
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Focus the input by default
input.focus();

// Render the screen
screen.render();

console.log('TUI Kit Demo started! Use Tab to navigate, Enter to activate buttons.');
console.log('Press Escape, q, or Ctrl+C to quit.');