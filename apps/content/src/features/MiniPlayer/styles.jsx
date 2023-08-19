import {
  string, oneOfType, arrayOf, node, func, 
} from 'prop-types';
import React from 'react';

export function Container({ children, }) {
  return (
    <div
      style={{
        width: `50px`,
        height: '26px',
        background: 'transparent',
      }}
    >
      {children}
    </div>
  );
}

Container.propTypes = {
  children: oneOfType([ arrayOf(node), node, ]),
};

Container.defaultProps = {
  children: [],
};

export function Button({ children, onClick, }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-block',
        width: '24px',
        height: '24px',
        margin: 0,
        padding: 0,
        opacity: 0.9,
        cursor: 'pointer',
        border: 'none',
      }}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: oneOfType([ arrayOf(node), node, ]),
  onClick: func,
};

Button.defaultProps = {
  children: [],
  onClick: () => {},
};

export function Icon({ alt, src, }) {
  return (
    <img
      alt={alt}
      src={src}
      style={{
        width: '24px',
        height: '24px',
        margin: 0,
        padding: 0,
        verticalAlign: 'top',
      }}
    />
  );
}

Icon.propTypes = {
  alt: string,
  src: string,
};

Icon.defaultProps = {
  alt: '',
  src: '',
};
