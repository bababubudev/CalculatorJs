import { useCallback, useRef, useState } from "react";
import { IoTrashBinOutline } from "react-icons/io5";
import { PiBroomFill } from "react-icons/pi";
import { historyObject } from "../utils/types";
import Modal from "./Modal";
import { AnimatePresence, motion } from "framer-motion";

interface HistoryListProps {
  history: historyObject[];
  removeFromHistory: (key: string) => void;
  onHistoryClicked: (key: string) => void;
  toggleHistoryShown: () => void;
}

function HistoryList({ history, removeFromHistory, onHistoryClicked, toggleHistoryShown }: HistoryListProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const historyItemRefs = useRef<Map<string, HTMLLIElement | null>>(new Map());
  const UListRef = useRef<HTMLUListElement | null>(null);

  const onRemovalCalled = useCallback((key: string) => {
    removeFromHistory(key);
  }, [removeFromHistory]);

  const handleClearAll = () => {
    setTimeout(() => {
      history.forEach(item => removeFromHistory(item.key));
    }, 300);
  };

  const handleClearAllClicked = () => {
    setIsModalOpen(true);
  };

  const handleConfirmClearAll = () => {
    handleClearAll();
    setIsModalOpen(false);
  };

  const handleCancelClearAll = () => {
    setIsModalOpen(false);
  };

  const onHistoryPartClicked = (currentItem: historyObject) => {
    onHistoryClicked(currentItem.key);
  };

  return (
    <>
      <section className={"history-div"} onClick={toggleHistoryShown}>
        {history.length > 0 ?
          <ul ref={UListRef}>
            <AnimatePresence>
              {history.map(elem => (
                <motion.li
                  initial={{ opacity: 0, translateX: "100%" }}
                  animate={{ opacity: 1, translateX: "0%" }}
                  exit={{ opacity: 0, translateX: "-100%" }}
                  transition={{ duration: 0.3 }}

                  key={elem.key}
                  ref={el => historyItemRefs.current.set(elem.key, el)}
                >
                  <div
                    className="history-part"
                    onClick={() => { onHistoryPartClicked(elem) }}
                  >
                    <p className="operation">{elem.displayOperation}</p>
                    <span>{elem.needsRounding ? "≈" : "="}</span>
                    <p className="result">{elem.result}</p>
                  </div>
                  <div className="detail">
                    <button className="del-btn" onClick={() => onRemovalCalled(elem.key)}>
                      <IoTrashBinOutline className="del-icon" />
                    </button>
                  </div>
                  <span className="index">
                    {(history.length - history.findIndex(item => item.key === elem.key))}
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul> :
          <p className="no-history">Nothing in history</p>
        }
      </section >
      <button
        onClick={handleClearAllClicked}
        className="clear-all-btn"
        disabled={history.length === 0}
      >
        <PiBroomFill />
      </button>
      <Modal
        dialogue="Clear all history"
        description="Are you sure you want to clear everything from history?"
        isOpen={isModalOpen}
        onConfirm={handleConfirmClearAll}
        onCancel={handleCancelClearAll}
      />
    </>
  );
}

export default HistoryList;