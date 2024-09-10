interface CustomSelectProp {
  label: string;
  name: string;
  options: string[];
  displayOptions?: string[];
  selectedOption: string;
  isActive: boolean;
  onClick: (name: string) => void;
  onChange: (name: string, value: string) => void;
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

  const handleOptionClick = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();
    onChange(name, value);
  };

  return (
    <li onClick={() => onClick(name)}>
      <p>{label}</p>
      <div className={`options-select ${name} ${isActive ? "shown" : "hidden"}`}>
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
    </li>
  );
}

export default CustomSelect;