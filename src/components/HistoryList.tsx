import { useCallback, useEffect, useRef, useState } from "react";
import { IoTrashBinOutline } from "react-icons/io5";
import { TbClearAll } from "react-icons/tb";
import { historyObject } from "../utils/types";
import Modal from "./Modal";

interface HistoryListProps {
  history: historyObject[];
  removeFromHistory: (key: string) => void;
  onHistoryClicked: (key: string) => void;
  toggleHistoryShown: () => void;
}

function HistoryList({ history, removeFromHistory, onHistoryClicked, toggleHistoryShown }: HistoryListProps) {
  const [transitionItems, setTransitionItems] = useState<historyObject[]>(history);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const historyItemRefs = useRef<Map<string, HTMLLIElement | null>>(new Map());
  const UListRef = useRef<HTMLUListElement | null>(null);

  const onRemovalCalled = useCallback((key: string) => {
    const element = historyItemRefs.current.get(key);
    if (element) {
      element.classList.add("item-exit");
      requestAnimationFrame(() => {
        element.classList.add("item-exit-active");
        setTimeout(() => {
          setTransitionItems(prevItems => prevItems.filter(item => item.key !== key));
          removeFromHistory(key);
        }, 300);
      });
    }
  }, [removeFromHistory]);

  const handleEnterAnim = useCallback((key: string) => {
    const element = historyItemRefs.current.get(key);
    if (element) {
      element.classList.add("item-enter");
      requestAnimationFrame(() => {
        element.classList.add("item-enter-active");
      });
    }
  }, []);

  const handleClearAll = useCallback(() => {
    for (const item of transitionItems) {
      onRemovalCalled(item.key);
    }
  }, [transitionItems, onRemovalCalled]);

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

  //! FIXME: What the fuck is this code?
  useEffect(() => {
    if (UListRef.current) {
      UListRef.current.scrollTop = UListRef.current.scrollHeight;
    }

    const timeoutIds: number[] = [];

    //* INFO: IF MORE ITEMS THAN IN TRANSITION, ADD IT
    const newItems = history.filter(
      (item) => !transitionItems.some((transItem) => transItem.key === item.key)
    );

    if (newItems.length > 0) {
      setTransitionItems(prevItems => [...prevItems, ...newItems]);
    }

    transitionItems.forEach(item => {
      //* INFO: IF HISTORY IS OUT OF SYNC, SYNC
      if (!history.some(hItem => hItem.key === item.key)) {
        const element = historyItemRefs.current.get(item.key);
        if (element) {
          element.classList.add("item-exit");
          requestAnimationFrame(() => {
            element.classList.add("item-exit-active");
            const timeoutId = setTimeout(() => {
              setTransitionItems(prevItems => prevItems.filter(tranItem => tranItem.key !== item.key));
              removeFromHistory(item.key);
            }, 300);

            timeoutIds.push(timeoutId);
          });
        }
      }
      else {
        handleEnterAnim(item.key);
      }
    });


    return () => {
      timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
    }
  }, [history, transitionItems, handleEnterAnim, removeFromHistory]);

  return (
    <>
      <section className={"history-div"} onClick={toggleHistoryShown}>
        {history.length > 0 ?
          <ul ref={UListRef}>
            {transitionItems.map(elem => (
              <li
                key={elem.key}
                onClick={() => onHistoryClicked(elem.key)}
                ref={el => historyItemRefs.current.set(elem.key, el)}
              >
                <div className="history-part">
                  <p className="operation">{elem.operation}</p>
                  <span>{elem.needsRounding ? "≈" : "="}</span>
                  <p className="result">{elem.result}</p>
                </div>
                <div className="detail">
                  <button className="del-btn" onClick={() => onRemovalCalled(elem.key)}>
                    <IoTrashBinOutline className="del-icon" />
                  </button>
                  <span className="index">
                    {(history.length - transitionItems.findIndex(item => item.key === elem.key))}
                  </span>
                </div>
              </li>
            ))}
          </ul> :
          <p className="no-history">Nothing in history</p>
        }
      </section >
      <button
        onClick={handleClearAllClicked}
        className="clear-all-btn"
        disabled={history.length === 0}
      >
        <TbClearAll />
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