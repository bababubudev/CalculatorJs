import { IoSettings } from "react-icons/io5";
import Options from "./Options";

function Header() {
  return (
    <header>
      <h1>calculator</h1>
      <div className="option-area">
        <Options />
        <IoSettings />
      </div>
    </header>
  );
}

export default Header;