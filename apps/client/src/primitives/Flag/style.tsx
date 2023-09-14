import { css, } from '@emotion/react';
import styled from '@emotion/styled';

export const langCSS = css`
  width: 30px;
  margin-right: 8px;
`;

export const countryCSS = css`
  width: 12px;
  margin-right: 8px;
`;

export const FlagImg = styled.img`
  max-width: ${({ size, }) => (size === 'big' ? 30 : 15)}px;
  ${({ size, }: { size: 'big' | 'small' }) =>
    size === 'small'
      ? `
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid #000;`
      : ''}
`;
