import { useState, useRef, useEffect } from "react";
import fresa from "./img/fresa.png";
import conejo from "./img/conejo.png";

import "./App.css";

function App() {
  const divRef = useRef(null);
  const strawBerryRef = useRef(null);

  const [divWidth, setDivWidth] = useState(0);
  const [clickPosition, setClickPosition] = useState({ top: 0, left: 0 });
  const [strawberryState, setStrawberryState] = useState({
    top: 0,
    left: 0,
    display: "none",
  });
  const [bunnyState, bunyState] = useState({
    top: 0,
    left: 0,
    trasform: "scaleX(1)",
    img: { conejo },
  });

  //*! Marcar dónde se hace clic
  const handleClick = (event) => {
    const containerRect = divRef.current.getBoundingClientRect();
    const clickX = event.clientX - containerRect.left;
    const clickY = event.clientY - containerRect.top;
    setClickPosition({ top: clickY, left: clickX });
    strawberryPosition(clickX, clickY);
  };

  //*! Posición de la fresa
  const strawberryPosition = (x, y) => {
    let conteinerHeigth = divRef.current.offsetHeight;
    const width = strawBerryRef.current.offsetWidth;
    const heigth = strawBerryRef.current.offsetHeight;
    let top =
      y - heigth / 2 > conteinerHeigth - heigth ? y - heigth : y - heigth / 2;
    let left = x - width / 2;
    let position = { top, left, display: "block" };

    let i = top;
    const animateDrop = () => {
      setTimeout(() => {
        setStrawberryState({ ...position, top: i });
        i++;
        if (i < conteinerHeigth - strawBerryRef.current.offsetHeight) {
          animateDrop();
        }
      }, 1);
    };

    animateDrop();
  };

  //*! Tener el ancho del div cada que cambie la pantalla

  useEffect(() => {
    const handleResize = () => {
      const width = divRef.current.offsetWidth;
      setDivWidth(width);
    };

    setStrawberryState({ ...strawberryState, display: "none" });
    handleResize(); // Calcular el ancho del div inicialmente

    window.addEventListener("resize", handleResize); // Agregar un listener para cambios de tamaño de pantalla

    return () => {
      window.removeEventListener("resize", handleResize); // Limpiar el listener al desmontar el componente
    };
  }, []);

  return (
    <section className="bunny">
      <div ref={divRef} className="conteiner" onClick={handleClick}>
        <div
          className="fresa"
          ref={strawBerryRef}
          style={{
            top: strawberryState.top,
            left: strawberryState.left,
            display: strawberryState.display,
          }}
        >
          <img src={fresa} alt="fresa" />
        </div>
        <div className="conejo">
          <img
            src={bunnyState.img.conejo}
            alt="conejo"
            style={{
              transform: bunnyState.trasform,
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default App;
