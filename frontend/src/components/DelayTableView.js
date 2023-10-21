import React, { useState, useEffect } from 'react';
import Clock from './Clock'
import TicketView from './TicketView';

export default function DelayTableView({ onTrainClick }) {
  const [delayedData, setDelayedData] = useState([]);

  useEffect(() => {
    fetchDelayedData();
  }, []);

  const fetchDelayedData = () => {
    fetch('http://localhost:1337/delayed')
      .then((response) => response.json())
      .then((result) => {setDelayedData({delayedData: result.data})})
      .catch((error) => console.error('Error fetching delayed data:', error));
  }

  const renderDelayedTable = (data) => {
    return data.map((item, index) => (
      <div key={index} className="train-item" onClick={() => TicketView(item)}>
        <div className="train-number">{item.OperationalTrainNumber}</div>
        <div className="current-station">
          <div>{item.LocationSignature}</div>
          <div>
            {item.FromLocation ? `${item.FromLocation[0].LocationName} -> ` : ""}
            {item.ToLocation ? item.ToLocation[0].LocationName : ""}
          </div>
        </div>
        <div className="delay">{outputDelay(item)}</div>
      </div>
    ));
  }

  const outputDelay = (item) => {
    let advertised = new Date(item.AdvertisedTimeAtLocation);
    let estimated = new Date(item.EstimatedTimeAtLocation);
    const diff = Math.abs(estimated - advertised);
    return Math.floor(diff / (1000 * 60)) + ' minuter';
  }

  return (
    <div className="left-column">
    <div className="delayed">
      <Clock />
      <h1>Försenade tåg</h1>
      <div id="delayed-trains" className="delayed-trains">
        {renderDelayedTable(delayedData)}
      </div>
    </div>
    </div>
  );
}

// export default DelayTableView;
