import { useEffect, useRef, useState } from "react";
import { useOptions } from "../context/OptionsContext";
import CustomSelect from "./CustomSelect";

function Options() {
  const { options, setOptions } = useOptions();

  const optionRef = useRef<HTMLDivElement | null>(null);
  const [activeDropdown, setActiveDropDown] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  const optionChange = (name: string, value: any) => {
    setOptions({ [name]: value });
  };

  const getOrdinalSuffix = (num: number) => {
    if (num % 10 === 1 && num % 100 !== 11) return `${num}st`;
    if (num % 10 === 2 && num % 100 !== 12) return `${num}nd`;
    if (num % 10 === 3 && num % 100 !== 13) return `${num}rd`;
    return `${num}th`;
  };

  const precisionOptions = Array.from({ length: 14 }, (_, i) => ({
    value: (i + 2).toString(),
    display: `${getOrdinalSuffix(i + 2)} decimal`,
  }));

  const handleDropDownClick = (name: string) => {
    setActiveDropDown(prev => (prev === name ? null : name));
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (optionRef.current && !optionRef.current.contains(event.target as Node)) {
        setActiveDropDown(null);
        setShowForm(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="option-area" ref={optionRef}>
      <button
        className={`setting-btn ${showForm ? "shown" : ""}`}
        onClick={() => setShowForm(prev => !prev)}
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 512 512"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="256" cy="256" r="48" className="inside-circle">
          </circle>
          <path
            d="m470.39 300-.47-.38-31.56-24.75a16.11 16.11 0 0 1-6.1-13.33v-11.56a16 16 0 0 1 6.11-13.22L469.92 212l.47-.38a26.68 26.68 0 0 0 5.9-34.06l-42.71-73.9a1.59 1.59 0 0 1-.13-.22A26.86 26.86 0 0 0 401 92.14l-.35.13-37.1 14.93a15.94 15.94 0 0 1-14.47-1.29q-4.92-3.1-10-5.86a15.94 15.94 0 0 1-8.19-11.82l-5.59-39.59-.12-.72A27.22 27.22 0 0 0 298.76 26h-85.52a26.92 26.92 0 0 0-26.45 22.39l-.09.56-5.57 39.67a16 16 0 0 1-8.13 11.82 175.21 175.21 0 0 0-10 5.82 15.92 15.92 0 0 1-14.43 1.27l-37.13-15-.35-.14a26.87 26.87 0 0 0-32.48 11.34l-.13.22-42.77 73.95a26.71 26.71 0 0 0 5.9 34.1l.47.38 31.56 24.75a16.11 16.11 0 0 1 6.1 13.33v11.56a16 16 0 0 1-6.11 13.22L42.08 300l-.47.38a26.68 26.68 0 0 0-5.9 34.06l42.71 73.9a1.59 1.59 0 0 1 .13.22 26.86 26.86 0 0 0 32.45 11.3l.35-.13 37.07-14.93a15.94 15.94 0 0 1 14.47 1.29q4.92 3.11 10 5.86a15.94 15.94 0 0 1 8.19 11.82l5.56 39.59.12.72A27.22 27.22 0 0 0 213.24 486h85.52a26.92 26.92 0 0 0 26.45-22.39l.09-.56 5.57-39.67a16 16 0 0 1 8.18-11.82c3.42-1.84 6.76-3.79 10-5.82a15.92 15.92 0 0 1 14.43-1.27l37.13 14.95.35.14a26.85 26.85 0 0 0 32.48-11.34 2.53 2.53 0 0 1 .13-.22l42.71-73.89a26.7 26.7 0 0 0-5.89-34.11zm-134.48-40.24a80 80 0 1 1-83.66-83.67 80.21 80.21 0 0 1 83.66 83.67z"
          >
          </path>
        </svg>
      </button>

      <form
        onSubmit={e => e.preventDefault()}
        className={`option-form ${showForm ? "shown" : "hidden"}`}
      >
        <ul>
          <CustomSelect
            label="Angle Unit"
            options={["degree", "radian", "gradian"]}
            selectedOption={options.angleUnit ?? "radian"}
            onChange={optionChange}
            name="angleUnit"
            isActive={activeDropdown === "angleUnit"}
            onClick={handleDropDownClick}
          />

          <CustomSelect
            label="Precision"
            options={precisionOptions.map(option => option.value)}
            displayOptions={precisionOptions.map(option => option.display)}
            selectedOption={options.precision?.toString() ?? "5"}
            onChange={optionChange}
            name="precision"
            isActive={activeDropdown === "precision"}
            onClick={handleDropDownClick}
          />

          <CustomSelect
            label="Theme"
            options={["light", "dark", "default"]}
            displayOptions={["Earth", "Night", "Jade"]}
            selectedOption={options.theme ?? "default"}
            onChange={optionChange}
            name="theme"
            isActive={activeDropdown === "theme"}
            onClick={handleDropDownClick}
          />
          <CustomSelect
            label="Keypad"
            options={[true, false]}
            displayOptions={["Show", "Hide"]}
            selectedOption={options.showKeypad}
            onChange={optionChange}
            name="showKeypad"
            isActive={activeDropdown === "showKeypad"}
            onClick={handleDropDownClick}
          />
        </ul>
      </form >
    </div>
  );
}

export default Options;