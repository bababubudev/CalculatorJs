import Header from "./components/Header";
import Calculator from "./pages/Calculator";

function App() {
  return (
    <main>
      {/* <div className="blobs">
        <img draggable="false" src="/CalculatorJs/svg/blob1.svg" alt="Blob1" className="blob1" />
        <img draggable="false" src="/CalculatorJs/svg/blob2.svg" alt="Blob2" className="blob2" />
      </div> //! FIXME: Fix after styling changes
      */}
      <Header />
      <Calculator />
    </main>
  )
}

export default App
