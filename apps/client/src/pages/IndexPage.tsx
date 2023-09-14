import React from 'react';

import FooterComponent from '@/components/Footer';
import HeaderComponent from '@/components/Header';
import PlayerComponent from '@/components/Player/Player';

const IndexPage: React.FC = () => (
  <>
    <HeaderComponent />
    <PlayerComponent />
    <FooterComponent />
  </>
);
export default IndexPage;
