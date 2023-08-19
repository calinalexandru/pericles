import core from '@/core';
import store from '@/store';

store.subscribe(() => {
  const state = store.getState();
  console.log('state', state);
});

core();
