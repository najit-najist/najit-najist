import { cva, VariantProps } from 'class-variance-authority';
import { DetailedHTMLProps, FC, forwardRef, InputHTMLAttributes } from 'react';

type InputVariantProps = VariantProps<typeof inputStyles>;

export interface InputProps
  extends DetailedHTMLProps<
      InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    Omit<InputVariantProps, 'type'> {}

const inputTypeToStyleType = (
  type: InputProps['type']
): InputVariantProps['type'] => {
  let res: InputVariantProps['type'] = 'normal';

  switch (type) {
    case 'checkbox': {
      res = 'checkbox';
      break;
    }
    default: {
      break;
    }
  }

  return res;
};

export const inputStyles = cva('', {
  variants: {
    type: {
      normal: '',
      checkbox: '',
    },
  },
  defaultVariants: {
    type: 'normal',
  },
});

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({
  type,
  className,
  ...rest
}) {
  return (
    <input
      className={inputStyles({ className, type: inputTypeToStyleType(type) })}
      type={type}
      {...rest}
    />
  );
});
