interface ModalProps {
  isOpen: boolean;
  dialogue: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function Modal({ dialogue, description, isOpen, onConfirm, onCancel }: ModalProps) {
  return (
    <div className={`modal-overlay ${isOpen ? "visible" : "hidden"}`}>
      <div className={`modal-content ${isOpen ? "visible" : "hidden"}`}>
        <h2>{dialogue}</h2>
        <p>{description}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="confirm-btn">Confirm</button>
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;