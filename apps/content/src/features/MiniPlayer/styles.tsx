import React, { ReactNode, MouseEvent, } from 'react';

interface ContainerProps {
  children?: ReactNode | ReactNode[];
}

const contaienrStyle = {
  width: `50px`,
  height: '26px',
  background: 'transparent',
};

export function Container({ children, }: ContainerProps) {
  return <div style={contaienrStyle}>{children}</div>;
}

interface ButtonProps {
  children?: ReactNode | ReactNode[];
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const buttonStyle = {
  display: 'inline-block',
  width: '24px',
  height: '24px',
  margin: 0,
  padding: 0,
  opacity: 0.9,
  cursor: 'pointer',
  border: 'none',
};

export function Button({ children, onClick, }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={buttonStyle}>
      {children}
    </button>
  );
}

interface IconProps {
  alt?: string;
  src?: string;
}

const iconStyle = {
  width: '24px',
  height: '24px',
  margin: 0,
  padding: 0,
  verticalAlign: 'top',
};

export function Icon({ alt, src, }: IconProps) {
  return <img
    alt={alt}
    src={src}
  style={iconStyle} />;
}
