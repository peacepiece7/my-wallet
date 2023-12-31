import { InputHTMLAttributes, forwardRef } from 'react'
import styled, { css } from 'styled-components'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  $variant?: 'default' | 'primary' | 'warn'
  $size?: 'small' | 'medium' | 'large' | 'auto' | 'full'
}

export const UncontrolledInput = forwardRef<HTMLInputElement, InputProps>((props: InputProps, ref) => {
  const { $variant = 'default', $size = 'medium', ...rest } = props
  return <Input ref={ref} $variant={$variant} $size={$size} {...rest} />
})

UncontrolledInput.displayName = 'UncontrolledInput'

const InputVariants = {
  default: css`
    color: black;
    background-color: white;
    &:focus {
      background-color: #ebebeb;
    }
  `,
  primary: css`
    color: white;
    background-color: gray;
    &:focus {
      background-color: #ebebeb;
    }
  `,
  warn: css`
    color: red;
    background-color: white;
    border: 1px solid red;
    &:focus {
      background-color: #f9ecec;
    }
  `
}

const InputSizes = {
  small: css`
    width: 5rem;
  `,
  medium: css`
    width: 10rem;
  `,
  large: css`
    width: 15rem;
  `,
  auto: css`
    width: auto;
  `,
  full: css`
    width: 100%;
  `
}

const Input = styled.input<InputProps>`
  font-size: 1.6rem;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid gray;
  ${({ $variant }) => InputVariants[$variant || 'default']}
  ${({ $size }) => InputSizes[$size || 'medium']}
`
