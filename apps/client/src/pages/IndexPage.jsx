import { number, } from 'prop-types';
import { applySpec, } from 'ramda';
import React, { memo, } from 'react';
import { connect, } from 'react-redux';

import FooterComponent from '@/components/footer';
import HeaderComponent from '@/components/Header';
import PlayerComponent from '@/components/Player';
import { TABS, } from '@pericles/constants';
import { appRouteTabSelector, } from '@pericles/store';

function IndexPage({ routeTab, }) {
  console.log('IndexPage', { routeTab, });

  return (
    <>
      <HeaderComponent />
      <PlayerComponent />
      <FooterComponent />
    </>
  );
}

IndexPage.propTypes = {
  routeTab: number,
};

IndexPage.defaultProps = {
  routeTab: TABS.SETTINGS,
};

const mapStateToProps = applySpec({
  routeTab: appRouteTabSelector,
});

export default connect(mapStateToProps)(memo(IndexPage));
