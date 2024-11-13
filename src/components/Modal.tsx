import { useEffect, useRef } from "react";

interface ModalProps {
  isInfo?: boolean;
  isOpen: boolean;
  dialogue: string;
  description?: string | JSX.Element;
  onConfirm: () => void;
  onCancel: () => void;
}

function Modal({ isInfo = false, dialogue, description, isOpen, onConfirm, onCancel }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onCancel]);

  const currentClassName = `${isOpen ? "visible" : "hidden"} ${isInfo ? "info-pnl" : ""} ${dialogue.toLowerCase()}`

  return (
    <div
      className={`modal-overlay ${currentClassName}`}>
      <div
        className={`modal-content ${isOpen ? "visible" : "hidden"}`}
        ref={modalRef}
      >
        <h2>{dialogue}</h2>
        {description && typeof description === "string" ?
          <p>{description}</p> :
          description
        }
        <div className="modal-buttons">
          {!isInfo &&
            <button
              onClick={(e) => { e.stopPropagation(); onConfirm() }}
              className="confirm-btn"
            >
              Confirm
            </button>
          }
          <button
            onClick={(e) => { e.stopPropagation(); onCancel() }}
            className="cancel-btn"
          >
            {isInfo ? "Got it" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;