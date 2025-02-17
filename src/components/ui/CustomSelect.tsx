import { useEffect, useRef } from "react";
import { FaArrowCircleRight } from "react-icons/fa";

type OptionValue = string | number | boolean;

interface CustomSelectProp {
  label: string;
  name: string;
  options: OptionValue[];
  displayOptions?: string[];
  selectedOption: OptionValue;
  isActive: boolean;
  onClick: (name: string) => void;
  onChange: (name: string, value: OptionValue) => void;
}

function CustomSelect({
  label,
  name,
  options,
  displayOptions,
  selectedOption,
  isActive,
  onClick,
  onChange,
}: CustomSelectProp) {
  const listRef = useRef<HTMLDivElement>(null);
  const currentOptionType = displayOptions ? displayOptions : options;
  const selectedIndex = options.indexOf(selectedOption);

  useEffect(() => {
    if (!isActive && listRef.current) {
      const listElement = listRef.current;
      const selectedElement = listElement.querySelector(".current");

      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  }, [isActive, selectedOption]);

  const handleOptionClick = (e: React.MouseEvent, value: OptionValue) => {
    e.stopPropagation();
    onChange(name, value);
  };

  const handlePrevClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.stopPropagation();
    const newIndex = (selectedIndex - 1 + currentOptionType.length) % currentOptionType.length;
    onChange(name, options[newIndex]);
  }

  const handleNextClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.stopPropagation();
    const newIndex = (selectedIndex + 1) % currentOptionType.length;
    onChange(name, options[newIndex]);
  }

  const sliderType: JSX.Element = (
    <div className={`slider-type ${name} ${isActive ? "shown" : "hidden"}`}>
      <button onClick={handlePrevClick} className="prev-button"><FaArrowCircleRight /></button>
      <div className="selected-option">
        {currentOptionType[selectedIndex]}
      </div>
      <button onClick={handleNextClick} className="next-button"><FaArrowCircleRight /></button>
    </div>
  )

  const listType: JSX.Element = (
    <div
      ref={listRef}
      className={`list-type ${name} ${isActive ? "shown" : "hidden"}`}
    >
      {displayOptions ?
        displayOptions.map((option, idx) => (
          <div
            key={option}
            onClick={e => handleOptionClick(e, options[idx])}
            className={`${selectedOption === options[idx] ? "current" : ""}`}
          >
            {option}
          </div>)) :
        options.map((option) => (
          <div
            key={String(option)}
            onClick={e => handleOptionClick(e, option)}
            className={`${selectedOption === option ? "current" : ""}`}
          >
            {String(option)}
          </div>
        ))}
    </div>
  );

  return (
    <li onClick={() => onClick(name)}>
      <div className="display-current">
        <p>{label}</p>
      </div>
      {sliderType}
      {listType}
    </li>
  );
}

export default CustomSelect;
