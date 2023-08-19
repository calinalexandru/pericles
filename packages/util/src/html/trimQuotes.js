/**
 * Replace quotes at the begining and end of string
 * U+0022 Quotation Mark ""
 * U+0027 Apostrophe ''
 * U+2018 Left Single Quotation Mark ‘
 * U+2019 Right Single Quotation Mark ’
 * U+201A Single Low-9 Quotation Mark ‚
 * U+201C Left Double Quotation Mark “
 * U+201D Right Double Quotation Mark ”
 * U+201E Double Low-9 Quotation Mark „
 */
export default function trimQuotes(str) {
  return str.replace(
    /(^[\u2018|\u2019|\u201A|\u201C|\u201D|\u201E|\u0022|\u0027]+|[\u2018|\u2019|\u201A|\u201C|\u201D|\u201E|\u0022|\u0027]+$)/gm,
    ''
  );
}
