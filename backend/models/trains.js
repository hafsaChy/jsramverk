import fetch from 'node-fetch';
import EventSource from 'eventsource';

const trains = {
  getTrains: async function getTrains(limit = -1) {
      const queryLimit = limit === -1 ? '' : `limit="${limit}"`;
      const query = `<REQUEST>
      <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
      <QUERY
          sseurl="true"
          namespace="järnväg.trafikinfo"
          objecttype="TrainPosition"
          schemaversion="1.0"
          ${queryLimit}            
      />
      </REQUEST>`;

      const response = await fetch(
          "https://api.trafikinfo.trafikverket.se/v2/data.json", {
              method: "POST",
              body: query,
              headers: { "Content-Type": "text/xml" }
          }
      );
      const result = await response.json();

      return result.RESPONSE.RESULT[0];
  },

  fetchAllDelayedTrains: async function fetchAllDelayedTrains() {
    let db;

    try {
        db = await database.openDb(version);

    } catch(error) {
        return {
            status: error.status,
            message: error.message,
        };
    } finally {
        await db.close();
    }
  },

  fetchTrainPositions: async function fetchTrainPositions(io) {
      const data = await trains.getTrains(1)
      const sseurl = data.INFO.SSEURL;
      const eventSource = new EventSource(sseurl);
      const trainPositions = {};
  
      eventSource.onopen = function() {
          console.log("Connection to server opened.");
      };
  
      io.on('connection', (socket) => {
          console.log('a user connected');
  
          eventSource.onmessage = function (e) {
              try {
                  const parsedData = JSON.parse(e.data);
  
                  if (parsedData) {
                      const changedPosition = parsedData.RESPONSE.RESULT[0].TrainPosition[0];
  
                      const matchCoords = /(\d*\.\d+|\d+),?/g;
  
                      const position = changedPosition.Position.WGS84.match(matchCoords).map(
                          (t=>parseFloat(t))
                      ).reverse();
  
                      const trainObject = {
                          trainnumber: changedPosition.Train.AdvertisedTrainNumber,
                          position: position,
                          timestamp: changedPosition.TimeStamp,
                          bearing: changedPosition.Bearing,
                          status: !changedPosition.Deleted,
                          speed: changedPosition.Speed,
                      };
  
                      if (changedPosition.Train.AdvertisedTrainNumber in trainPositions) {
                          socket.emit("message", trainObject);
                      }
  
                      trainPositions[changedPosition.Train.AdvertisedTrainNumber] = trainObject;
                  }
              } catch (e) {
                  console.log(e);
              }
  
              return;
          };
      });
  
      eventSource.onerror = function() {
          console.log("EventSource failed.");
      };
  }
}

export default trains;
