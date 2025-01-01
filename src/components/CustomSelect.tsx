import { FaArrowCircleRight } from "react-icons/fa";

interface CustomSelectProp {
  label: string;
  name: string;
  options: any[];
  displayOptions?: string[];
  selectedOption: any;
  isActive: boolean;
  onClick: (name: string) => void;
  onChange: (name: string, value: any) => void;
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
  const currentOptionType = displayOptions ? displayOptions : options;
  const selectedIndex = options.indexOf(selectedOption);
  const handleOptionClick = (e: React.MouseEvent, value: string) => {
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
    <div className={`list-type ${name} ${isActive ? "shown" : "hidden"}`}>
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
            key={option}
            onClick={e => handleOptionClick(e, option)}
            className={`${selectedOption === option ? "current" : ""}`}
          >
            {option}
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
