/*
 * ConfirmDialog · confirmação acessível (foco preso, Esc fecha) no lugar do window.confirm.
 */
import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

/* Mostra a pergunta e devolve a escolha por onConfirm/onCancel. */
export default function ConfirmDialog({ show, title, message, confirmLabel = "Excluir", onConfirm, onCancel }) {
  return (
    <Modal show={show} onHide={onCancel} centered aria-labelledby="confirm-title">
      <Modal.Header closeButton closeLabel="Fechar">
        <Modal.Title id="confirm-title" as="h2" className="h5">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onCancel}>Cancelar</Button>
        <Button variant="danger" onClick={onConfirm}>{confirmLabel}</Button>
      </Modal.Footer>
    </Modal>
  );
}
/* fim de ConfirmDialog */
