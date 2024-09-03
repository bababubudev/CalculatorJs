import { IoTrashBinOutline } from "react-icons/io5";
import type { historyObject } from "../utils/types";
import { useCallback, useEffect, useRef, useState } from "react";

interface HistoryProp {
  history: historyObject[];
  toggleHistoryShown: () => void;
  removeFromHistory: (key: string) => void;
  clearHistory: () => void;
}

function History({ history, removeFromHistory, toggleHistoryShown }: HistoryProp) {
  const [transitionItems, setTransitionItems] = useState<historyObject[]>(history);
  const historyItemRefs = useRef<Map<string, HTMLLIElement | null>>(new Map());
  const UListRef = useRef<HTMLUListElement | null>(null);

  const onHistoryClicked = useCallback((key: string) => {
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
    <section className="history-div" onClick={toggleHistoryShown}>
      {history.length > 0 ?
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
                <button className="del-btn" onClick={() => onHistoryClicked(elem.key)}>
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
    </section>
  );
}

export default History;