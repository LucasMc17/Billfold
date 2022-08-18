import React from 'react';

import Navbar from './components/Navbar';
import Routes from './Routes';
import SiteFooter from './components/SiteFooter';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes />
      <SiteFooter />
    </div>
  );
};

export default App;
