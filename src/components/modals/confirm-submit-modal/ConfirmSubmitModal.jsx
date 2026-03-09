import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function ConfirmSubmitModal({ show, onClose, onConfirm, type }) {
  const pointLabels = {
    entry: "event check-in",
    lunch: "lunch check-in",
    dinner: "dinner check-in",
  };

  const message = `Confirm ${pointLabels[type]}?`;
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Submission</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          No
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Yes, Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
