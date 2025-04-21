import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const TicketDetailsModal = ({ open, setOpen, ticketCost, startStation, endStation, stations, handleBookTicket }) => {
  const handleClose = () => setOpen(false); // Close modal
  return (
    <Modal show={open} onHide={handleClose} centered> {/* Add `centered` prop */}
      <Modal.Header closeButton>
        <Modal.Title>Confirm your ticket</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Start Station: {stations.find(s => s.id === parseInt(startStation))?.name}</p>
        <p>End Station: {stations.find(s => s.id === parseInt(endStation))?.name}</p>
        <p>Total Cost: Rs {ticketCost.total_cost}</p>
        <p>Discount: {ticketCost.discount*100} %</p>
        <p>Cost after discount: Rs {ticketCost.cost_after_discount}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleBookTicket}>
          Book Ticket
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TicketDetailsModal;