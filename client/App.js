import React from 'react';

import Navbar from './components/Navbar';
import Routes from './Routes';
import SiteFooter from './components/SiteFooter';
import TutorialModal from './components/TutorialModal';

// REMOVE OFFLINE VIEW
const offlinePage = document.querySelector('#offline-page');
offlinePage.remove();

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
