import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import './TicketConfirmation.css';

const TicketConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { startStation, endStation, cost, bookingTime } = location.state;

    // Generate a unique ticket ID or use existing data for the QR code
    const ticketData = JSON.stringify({
        startStation,
        endStation,
        cost,
        bookingTime,
    });

    const handlePrintReceipt = () => {
        window.print();
    };

    return (
        <div className="ticket-confirmation">
            <h1>Ticket Status </h1>
            <div className="ticket-details">
                <p><strong>Start Station:</strong> {startStation}</p>
                <p><strong>End Station:</strong> {endStation}</p>
                <p><strong>Cost:</strong> Rs {cost}</p>
                <p><strong>Booking Time:</strong> {new Date(bookingTime).toLocaleString()}</p>
                <p><strong>Payment Status:</strong> <span style={{ color: 'green' }}>Successful</span></p>
            </div>

            {/* QR Code Section */}
            <div className="qr-code-section">
                <h2>Scan QR Code for Ticket Details</h2>
                <QRCode
                    value={ticketData} // Data to encode in the QR code
                    size={200} // Size of the QR code
                    level="H" // Error correction level (L, M, Q, H)
                    includeMargin={true} // Add a margin around the QR code
                />
            </div>

            <button onClick={handlePrintReceipt}>Print Receipt</button>
            <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
    );
};

export default TicketConfirmation;