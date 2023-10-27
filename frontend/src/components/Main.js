import React, { useState } from 'react';
import DelayTableView from './DelayTable.js';
import TicketView from './Ticket.js';
import MapView from './Map.js';

const Main = () => {
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
}

export default Main;
