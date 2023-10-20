import React, { useState } from 'react';
import DelayTableView from './DelayTableView.js';
import TicketView from './TicketView.js';
import MapView from './MapView.js';

export default function MainView() {
  const [selectedTrain, setSelectedTrain] = useState(null);

  const handleTrainClick = (train) => {
    setSelectedTrain(train);
  };

  return (
    <>
      {selectedTrain ? (
        <TicketView selectedTrain={selectedTrain} onBackClick={() => setSelectedTrain(null)} />
      ) : (
        <DelayTableView onTrainClick={handleTrainClick} />
      )}
      <MapView />
    </>
  );
};

// export default MainView;
