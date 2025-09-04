import { Textbox } from 'blessed';
import { ComponentProps } from '../../types';

export interface InputProps extends ComponentProps {
  placeholder?: string;
  value?: string;
  type?: 'text' | 'password' | 'number';
  disabled?: boolean;
  onChange?: (value: string) => void;
  onEnter?: (value: string) => void;
}

export function InputComponent(props: InputProps) {
  const {
    placeholder = '',
    value = '',
    type = 'text',
    disabled = false,
    onChange,
    onEnter,
    ...rest
  } = props;

  const inputOptions = {
    content: value,
    placeholder,
    inputOnFocus: true,
    style: {
      fg: 'white',
      bg: 'black',
      focus: { fg: 'white', bg: 'blue' },
    },
    border: { type: 'line' },
    ...rest,
  };

  const input = Textbox(inputOptions);

  if (onChange) {
    input.on('input', () => {
      onChange(input.getValue());
    });
  }

  if (onEnter) {
    input.on('submit', () => {
      onEnter(input.getValue());
    });
  }

  return input;
}

export default InputComponent;