import { useEffect, useMemo, useRef, useState } from "react";
import classnames from "classnames";

function Shape({ boxes }) {
  const [selected, setSelected] = useState(new Set());
  const [unloading, setUnloading] = useState(false);
  const timerRef = useRef(null);

  // Count visible (1) boxes correctly
  const countOfVisibleBoxes = useMemo(() => {
    return boxes.reduce((acc, row) => {
      row.forEach((cell) => {
        if (cell === 1) acc++;
      });
      return acc;
    }, 0);
  }, [boxes]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const unload = () => {
    setUnloading(true);
    const keys = Array.from(selected);
    let index = 0;

    const removeNextKey = () => {
      if (index < keys.length) {
        const currentKey = keys[index++];
        setSelected((prev) => {
          const next = new Set(prev);
          next.delete(currentKey);
          return next;
        });
        timerRef.current = setTimeout(removeNextKey, 500);
      } else {
        setUnloading(false);
        clearTimeout(timerRef.current);
      }
    };

    timerRef.current = setTimeout(removeNextKey, 100);
  };

  // Trigger unload once all visible boxes are selected
  useEffect(() => {
    if (
      !unloading &&
      countOfVisibleBoxes > 0 &&
      selected.size >= countOfVisibleBoxes
    ) {
      unload();
    }
  }, [selected, countOfVisibleBoxes, unloading]);

  const handleOnClick = (e) => {
    const identifier = e.target.getAttribute("data-index");
    if (!identifier || unloading || selected.has(identifier)) return;

    setSelected((prev) => {
      const next = new Set(prev);
      next.add(identifier);
      return next;
    });
  };

  return (
    <div className="boxes" onClick={handleOnClick}>
      {boxes.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
          {row.map((cell, colIndex) => {
            const identifier = `${rowIndex}-${colIndex}`;
            const isSelected = selected.has(identifier);

            return cell === 1 ? (
              <div
                key={identifier}
                className={classnames("box", { selected: isSelected })}
                data-index={identifier}
              />
            ) : (
              <div className="box-placeholder" key={identifier} />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Shape;
