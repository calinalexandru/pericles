/**
 *
 */
export const leadingSign = (num) =>
  num >= 0 ? `+${num.toString()}` : num.toString();

/**
 *
 */
export const rateProsody = (rate) => `+${(rate * 100 - 100).toFixed(2)}%`;

/**
 *
 */
export const volumeProsody = (volume) => `${volume * 100}`;

/**
 *
 */
export const pitchProsody = (pitch) =>
  `${leadingSign((pitch - 1).toFixed(2))}st`;

/**
 *
 */
export const escapeSsmlAzure = (str) => {
  const map = {
    '&': '&amp;',
    '<': '&#60;',
    '>': '&#62;',
    '"': '&quot;',
  };

  return str.replace(/[&<>"]/g, (m) => map[m]);
};
