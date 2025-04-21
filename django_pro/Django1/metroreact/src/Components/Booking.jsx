import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Booking.css';
import Button from 'react-bootstrap/Button';
import TicketDetailsModal from './TicketDetailsModal';
import { useUser } from '../UserStore';
const Booking = () => {
    const [stations, setStations] = useState([]); 
    const [startStation, setStartStation] = useState(''); 
    const [endStation, setEndStation] = useState(''); 
    const [ticketCost, setTicketCost] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(''); 
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const {user} = useUser();
    
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/stations/')
            .then(response => setStations(response.data))
            .catch(error => console.error(error));
    }, []);

    
    const calculateTicketCost = () => {
        if (!startStation || !endStation) {
            setError('Please select both start and end stations.');
            return;
        }

        setLoading(true);
        setError('');

        axios.get(`http://127.0.0.1:8000/api/calculate-ticket-cost/?start=${startStation}&end=${endStation}&age=${user.age}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        })
            .then(response => {
                setTicketCost(response.data);
                setOpen(true);
                setLoading(false);
            })
            .catch(error => {
                setError('Failed to calculate ticket cost. Please try again.');
                setLoading(false);
            });
    };

    
    const handleBookTicket = () => {
        if (!ticketCost) {
            setError('Please calculate the ticket cost first.');
            return;
        }
        navigate('/ticket-confirmation', {
            state: {
                startStation: stations.find(s => s.id === parseInt(startStation))?.name,
                endStation: stations.find(s => s.id === parseInt(endStation))?.name,
                cost: ticketCost.cost_after_discount,
                bookingTime: new Date().toISOString(), 
            },
        });
    };

    return (
        <div className='bookingpage'>
            <div className="booking-container">
            <h1 className='head1'>Book a Ticket</h1>
            {error && <p className="error-message">{error}</p>}

            <div className="station-selectors">
                <label className='stationlabel'>
                    Boarding Point:
                    <select className='stationselect' value={startStation} onChange={(e) => setStartStation(e.target.value)}>
                        <option value="">Select a station</option>
                        {stations.map(station => (
                            station.id!=endStation &&
                            <option key={station.id} value={station.id}>
                                {station.name} 
                            </option>
                        ))}
                    </select>
                </label>

                <label className='stationlabel'>
                    Destination :
                    <select className='stationselect' value={endStation} onChange={(e) => setEndStation(e.target.value)}>
                        <option value="">Select a station</option>
                        {stations.map(station => (
                            station.id!=startStation &&
                            <option key={station.id} value={station.id}>
                                {station.name} 
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <button onClick={calculateTicketCost} disabled={loading}>
                {loading ? 'Calculating...' : 'Book Ticket'}
            </button>

            {ticketCost !== null && (
            <TicketDetailsModal
                open = {open}
                setOpen = {setOpen}
                ticketCost={ticketCost}
                startStation={startStation}
                endStation={endStation}
                stations={stations}
                handleBookTicket={handleBookTicket}
            />
            )}
            
        </div>
        <img src="metromap.png" height={'550px'} alt="" />

        </div>
        
        

    );
};

export default Booking;