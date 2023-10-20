import React, { Component } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import io from "socket.io-client";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "./App.css";
import TicketView from './components/TicketView.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      markers: {},
      delayedTrains: [],
    };
    this.map = null;
    this.mapContainer = React.createRef();
  }

  componentDidMount() {
    this.renderMainView();
  }

  renderMainView() {
    const socket = io("http://localhost:1337");
    console.log("Map Container Ref:", this.mapContainer);

    this.map = L.map(this.mapContainer.current).setView([62.173276, 14.942265], 5);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    socket.on("message", (data) => {
      this.updateMarker(data);
    });

    this.fetchDelayedTrains();
  }

  updateMarker(data) {
    const { markers } = this.state;

    if (markers.hasOwnProperty(data.trainnumber)) {
      let marker = markers[data.trainnumber];
      marker.setLatLng(data.position);
    } else {
      let customIcon = L.icon({
        iconUrl: icon,
        iconSize: [32, 32],
        shadowUrl: iconShadow,
      });

      let marker = L.marker(data.position, { icon: customIcon })
        .bindPopup(data.trainnumber) // Bind a popup with the train number
        .addTo(this.map);

      markers[data.trainnumber] = marker;
      this.setState({ markers });
    }
  }

  fetchDelayedTrains() {
    fetch("http://localhost:1337/delayed")
      .then((response) => response.json())
      .then((result) => {
        this.setState({ delayedTrains: result.data });
      });
  }

  renderDelayedTable(data) {
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
        <div className="delayed">{this.outputDelay(item)}</div>
      </div>
    ));
  }

  outputDelay(item) {
    let advertised = new Date(item.AdvertisedTimeAtLocation);
    let estimated = new Date(item.EstimatedTimeAtLocation);
    const diff = Math.abs(estimated - advertised);
    return Math.floor(diff / (1000 * 60)) + " minuter";
  }

  // renderTicketView(item) {
  //   // Implement the ticket view rendering logic
  // }

  render() {
    const { delayedTrains } = this.state;

    return (
      <div className="App">
        <div className="left-column">
          <div className="delayed">
            <h1>Försenade tåg</h1>
            <div id="delayed-trains" className="delayed-trains">
              {this.renderDelayedTable(delayedTrains)}
            </div>
          </div>
        </div>
        <div className="right-column">
          <div ref={this.mapContainer} id="map" className="map"></div>
        </div>
      </div>
    );
  }
}

export default App;
