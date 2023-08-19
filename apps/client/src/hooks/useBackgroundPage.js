import { useEffect, useState, } from 'react';

import { getBrowserAPI, } from '@pericles/util';

export default function useBackgroundPage() {
  const [ bg, setBg, ] = useState(() => {});
  useEffect(() => {
    setBg(getBrowserAPI().api.extension.getBackgroundPage());
    return () => {
      // cleanup
    };
  }, []);

  return bg;
}
