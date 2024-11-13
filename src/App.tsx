import Header from "./components/Header";
import Calculator from "./pages/Calculator";
import OptionsProvider from "./context/OptionsProvider";

function App() {
  return (
    <OptionsProvider>
      <main>
        <Header />
        <Calculator />
      </main>
    </OptionsProvider>
  )
}

export default App
