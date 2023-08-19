import React from 'react';

// !TODO
// I Don't know what this does either
export default function useResetCache(data) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [ data, ]);
  return ref;
}
