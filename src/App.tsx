import Header from "./components/header/Header";
import { useOptions } from "./context/OptionsContext";
import Calculator from "./pages/Calculator";

function App() {
  const { options } = useOptions();

  return (
    <main className={`${options.theme}-theme`}>
      <Header />
      <Calculator />
    </main>
  );
}

export default App
