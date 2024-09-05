import { useCallback, useEffect, useRef, useState } from "react";
import { IoTrashBinOutline } from "react-icons/io5";
import { FaBroom } from "react-icons/fa";
import { historyObject } from "../utils/types";

interface HistoryListProps {
  history: historyObject[];
  removeFromHistory: (key: string) => void;
  toggleHistoryShown: () => void;
  clearHistory: () => void;
}

function HistoryList({ history, removeFromHistory, toggleHistoryShown, clearHistory }: HistoryListProps) {
  const [transitionItems, setTransitionItems] = useState<historyObject[]>(history);
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
        }, 500);
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

  const handleClearAll = useCallback(async () => {
    //* INFO: Sequential call
    for (const item of transitionItems) {
      onRemovalCalled(item.key);
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    setTimeout(() => clearHistory(), 500);
  }, [transitionItems, clearHistory, onRemovalCalled]);

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
            }, 500);

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
    <section className="history-div" onClick={toggleHistoryShown}>
      {history.length > 0 ?
        <>
          <ul ref={UListRef}>
            {transitionItems.map(elem => (
              <li
                key={elem.key}
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
          </ul>
          <button
            onClick={handleClearAll}
            className="clear-all-btn"
          >
            <FaBroom />
          </button>
        </> :
        <p className="no-history">Nothing in history</p>
      }
    </section >
  );
}

export default HistoryList;