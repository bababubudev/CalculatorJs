import { IoSettings } from "react-icons/io5";
import Options from "./Options";

function Header() {
  return (
    <header>
      <h1>calculator</h1>
      <button type="button" className="option-area">
        {false && <Options />}
        <IoSettings />
      </button>
    </header>
  );
}

export default Header;