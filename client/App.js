import React from 'react';

import Navbar from './components/Navbar';
import Routes from './Routes';
import SiteFooter from './components/SiteFooter';
import TutorialModal from './components/TutorialModal';
import { useSelector } from 'react-redux';

const App = () => {
  const showTutorial = useSelector((state) => state.showTutorial);
  return (
    <div>
      {showTutorial ? <TutorialModal /> : <></>}
      <Navbar />
      <Routes />
      <SiteFooter />
    </div>
  );
};

export default App;
