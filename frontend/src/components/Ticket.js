import React, { useState, useEffect } from 'react';
import { config } from '../Constants';
const URL = config.url;

const Ticket = ({ selectedTrain, onBackClick }) => {
  const [reasonCodes, setReasonCodes] = useState([]);
  const [newTicketId, setNewTicketId] = useState(0);
  const [existingTickets, setExistingTickets] = useState([]);
  const endpoint = `${URL}/codes`;
  const endpoint1 = `${URL}/tickets`;

  useEffect(() => {
    fetchReasonCodes();
    fetchTicketId();
    fetchExistingTickets(); // eslint-disable-next-line
  }, []);

  const fetchReasonCodes = () => {
    fetch(endpoint)
      .then((response) => response.json())
      .then((result) => {
        setReasonCodes(result.data);
      })
      .catch((error) => console.error('Error fetching reason codes:', error));
  };

  const fetchTicketId = () => {
    fetch(endpoint1)
      .then((response) => response.json())
      .then((result) => {
        const lastId = result.data[1] ? result.data[1].id : 0;
        setNewTicketId(lastId + 1);
      })
      .catch((error) => console.error('Error fetching ticket ID:', error));
  };

  const fetchExistingTickets = () => {
    fetch(endpoint1)
      .then((response) => response.json())
      .then((result) => {
        setExistingTickets(result.data);
      })
      .catch((error) => console.error('Error fetching existing tickets:', error));
  };

  const renderReasonCodeOptions = () => {
    return reasonCodes.map((code) => (
      <option key={code.Code} value={code.Code}>
        {`${code.Code} - ${code.Level3Description}`}
      </option>
    ));
  };

  const renderExistingTickets = () => {
    return existingTickets.map((ticket) => (
      <div key={ticket.id}>
        {ticket.id} - {ticket.code} - {ticket.trainnumber} - {ticket.traindate}
      </div>
    ));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const newTicket = {
      code: event.target.reasonCode.value,
      trainnumber: selectedTrain.OperationalTrainNumber,
      traindate: selectedTrain.EstimatedTimeAtLocation.substring(0, 10),
    };

    fetch(endpoint1, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTicket),
    })
      .then((response) => response.json())
      .then(() => {
        fetchExistingTickets();
      })
      .catch((error) => console.error('Error creating new ticket:', error));
  };

  return (
    <div className="ticket-container">
      <div className="ticket">
        <button className='back' href="home" onClick={onBackClick}>
          Tillbaka
        </button>
        <h1>Nytt ärende #{newTicketId}</h1>
        <form onSubmit={handleFormSubmit}>
          <label>Orsakskod</label>
          <br />
          <select name="reasonCode" id="reason-code">
            {renderReasonCodeOptions()}
          </select>
          <br />
          <br />
          <input type="submit" value="Skapa nytt ärende" />
        </form>
      </div>
      <br />
      <div className="old-tickets">
        <h2>Befintliga ärenden</h2>
        {renderExistingTickets()}
      </div>
    </div>
  );
}

export default Ticket;
