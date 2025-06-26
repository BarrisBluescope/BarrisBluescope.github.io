import React from 'react';
import TechnologyRadar from './components/TechnologyRadar';
import technologiesData from './data/technologies.json';

function App() {
  return (
    <TechnologyRadar technologies={technologiesData.technologies} />
  );
}

export default App;