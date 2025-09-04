import { Button } from 'blessed';
import { ComponentProps } from '../../types';

export interface ButtonProps extends ComponentProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

export function ButtonComponent(props: ButtonProps) {
  const {
    children = 'Button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    onClick,
    ...rest
  } = props;

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { fg: 'white', bg: 'blue' };
      case 'secondary':
        return { fg: 'white', bg: 'gray' };
      case 'danger':
        return { fg: 'white', bg: 'red' };
      case 'ghost':
        return { fg: 'blue', bg: 'black' };
      default:
        return { fg: 'white', bg: 'blue' };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { height: 1, padding: { left: 1, right: 1 } };
      case 'md':
        return { height: 3, padding: { left: 2, right: 2 } };
      case 'lg':
        return { height: 5, padding: { left: 3, right: 3 } };
      default:
        return { height: 3, padding: { left: 2, right: 2 } };
    }
  };

  const buttonOptions = {
    content: children,
    ...getSizeStyles(),
    style: {
      ...getVariantStyles(),
      focus: { fg: 'white', bg: 'lightblue' },
    },
    mouse: true,
    keys: true,
    ...rest,
  };

  const button = Button(buttonOptions);

  if (onClick) {
    button.on('press', onClick);
  }

  return button;
}

export default ButtonComponent;