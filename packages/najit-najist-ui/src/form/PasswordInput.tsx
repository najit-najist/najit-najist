import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { forwardRef, HTMLInputTypeAttribute, useState } from 'react';
import { Input, InputProps } from './Input';

export type PasswordInputProps = Omit<InputProps, 'ref'>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ ...rest }, ref) {
    const [isShown, setIsShown] = useState(false);

    const Icon = isShown ? EyeSlashIcon : EyeIcon;
    const inputType: HTMLInputTypeAttribute = isShown ? 'text' : 'password';

    const suffixContent = (
      <button
        className="flex h-full px-2 items-center"
        type="button"
        onClick={() => setIsShown((item) => !item)}
      >
        <Icon className="w-5 h-5" />
      </button>
    );

    return (
      <Input ref={ref} {...rest} type={inputType} suffix={suffixContent} />
    );
  }
);
