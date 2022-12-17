import React from 'react';

import Navbar from './components/Navbar';
import Routes from './Routes';
import SiteFooter from './components/SiteFooter';
import TutorialModal from './components/TutorialModal';

const App = () => {
  return (
    <div>
      <TutorialModal />
      <Navbar />
      <Routes />
      <SiteFooter />
    </div>
  );
};

export default App;
