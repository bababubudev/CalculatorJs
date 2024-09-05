import { IoSettings } from "react-icons/io5";
import { useState } from "react";
import Options from "./Options";

function Header() {
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const showHideOptions = () => {
    setShowOptions(prev => !prev);
  }

  return (
    <header>
      <h1>calculator</h1>
      <div className="option-area">
        {showOptions && <Options />}
        <button onClick={showHideOptions}>
          <IoSettings />
        </button>
      </div>
    </header>
  );
}

export default Header;