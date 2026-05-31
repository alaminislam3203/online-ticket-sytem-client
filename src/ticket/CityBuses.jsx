import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
const CityBuses = () => {
  const { city } = useParams();
  console.log('City from URL:', city);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios.get('/api/tickets').then(res => {
      const filtered = res.data.filter(t => t.from === city);
      setTickets(filtered);
    });
  }, [city]);

  return (
    <div>
      <h1>Showing buses from: {city}</h1>
      {tickets.map(bus => (
        <div key={bus._id}>{bus.title}</div>
      ))}
    </div>
  );
};
export default CityBuses;
