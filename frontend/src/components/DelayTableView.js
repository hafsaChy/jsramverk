// import React, { Component } from "react";
// import Clock from './Clock'
// // import TicketView from "./TicketView";

// class DelayTableView extends Component {
//   constructor() {
//     super();
//     this.state = {
//       delayedData: []
//     };
//   }

//   componentDidMount() {
//     this.fetchDelayedData();
//   }

//   fetchDelayedData() {
//     fetch('http://localhost:1337/delayed')
//       .then((response) => response.json())
//       .then((result) => this.setState(result.data))
//       .catch((error) => console.error('Error fetching delayed data:', error))
//   }

//   outputDelay(item) {
//     let advertised = new Date(item.AdvertisedTimeAtLocation);
//     let estimated = new Date(item.EstimatedTimeAtLocation);
//     const diff = Math.abs(estimated - advertised);
//     return Math.floor(diff / (1000 * 60)) + ' minuter';
//   };

//   renderDelayedTable(data) {
//     return data.map((item, index) => (
//       <table className="train-table">
//         <tbody>      
//           <tr key={index} className="train-item">
//             <td className="train-number">{item.OperationalTrainNumber}</td>
//             <td className="current-station">
//               <div>{item.LocationSignature}</div>
//               <div>
//                 {item.FromLocation ? `${item.FromLocation[0].LocationName} -> ` : ""}
//                 {item.ToLocation ? item.ToLocation[0].LocationName : ""}
//               </div>
//             </td>
//             <td className="delay">{this.outputDelay(item)}</td>
//           </tr>
//         </tbody>
//       </table>
//     ));
//   };

//   render() {
//     const { delayedData } = this.state;

//     return (
//       <div className="delayed">
//         <Clock />
//         <h1>Försenade tåg</h1>
//         <div id="delayed-trains" className="delayed-trains">
//           {this.renderDelayedTable(delayedData)}
//         </div>
//       </div>
//     );
//   }
// };

import React, { useState, useEffect } from 'react';
import Clock from './Clock'

const DelayTableView = ({ onTrainClick }) => {
  const [delayedData, setDelayedData] = useState([]);

  useEffect(() => {
    fetchDelayedData();
  }, []);

  const fetchDelayedData = () => {
    fetch('http://localhost:1337/delayed')
      .then((response) => response.json())
      .then((result) => setDelayedData(result.data))
      .catch((error) => console.error('Error fetching delayed data:', error));
  };

  const outputDelay = (item) => {
    let advertised = new Date(item.AdvertisedTimeAtLocation);
    let estimated = new Date(item.EstimatedTimeAtLocation);
    const diff = Math.abs(estimated - advertised);
    return Math.floor(diff / (1000 * 60)) + ' minuter';
  };

  const renderDelayedTable = (data) => {
    return data.map((item, index) => (
      <table className="train-table">
        <tbody>      
          <tr key={index} className="train-item" onClick={() => onTrainClick(item)}>
            <td className="train-number">{item.OperationalTrainNumber}</td>
            <td className="current-station">
              <div>{item.LocationSignature}</div>
              <div>
                {item.FromLocation ? `${item.FromLocation[0].LocationName} -> ` : ""}
                {item.ToLocation ? item.ToLocation[0].LocationName : ""}
              </div>
            </td>
            <td className="delay">{outputDelay(item)}</td>
          </tr>
        </tbody>
      </table>
    ));
  };
  
  return (
    <div className="delayed">
      <Clock />
      <h1>Försenade tåg</h1>
      <div id="delayed-trains" className="delayed-trains">
        {renderDelayedTable(delayedData)}
      </div>
    </div>
  );
};

export default DelayTableView;
