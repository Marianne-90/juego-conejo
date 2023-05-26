import { useState, useRef, useEffect } from "react";
import fresa from "./img/fresa.png";
import conejoDurmiendo from "./img/bunny1.jpg";
import conejoDespierto from "./img/bunny4.jpg";
import conejoComiendo from "./img/bunny3.jpg";
import conejoCorriendo from "./img/bunny2.jpg";

import "./App.css";

const bunnyImages = {
  conejoDurmiendo,
  conejoDespierto,
  conejoComiendo,
  conejoCorriendo,
};

function App() {
  const divRef = useRef(null);
  const strawBerryRef = useRef(null);
  const bunnyRef = useRef(null);

  const [bunnyInAction, setBunnyInAction] = useState(false);
  const [strawberryState, setStrawberryState] = useState({
    top: 0,
    left: 0,
    display: "none",
  });
  const [bunnyState, setBunyState] = useState({
    top: 0,
    left: 0,
    trasform: "scaleX(1)",
    img: "",
  });

  //*! Marcar dónde se hace clic
  const handleClick = (event) => {
    const containerRect = divRef.current.getBoundingClientRect();
    const clickX = event.clientX - containerRect.left;
    const clickY = event.clientY - containerRect.top;
    if(!bunnyInAction){
      mainFunction(clickX, clickY);
    }
  };

  //*! Animación caída Fresa

  const animacionCaidaFresa = (top, left, conteinerHeigth) => {
    return new Promise((resolve) => {
      setBunyState({ ...bunnyState, img: bunnyImages.conejoDespierto });
      let position = { top, left, display: "block" };
      let i = top;
      const animateDrop = () => {
        setTimeout(() => {
          setStrawberryState({ ...position, top: i });
          i = i + 2;
          if (i < conteinerHeigth - strawBerryRef.current.offsetHeight) {
            animateDrop();
          } else {
            // La animación ha terminado, resolvemos la promesa
            resolve();
          }
        }, 1);
      };
      animateDrop();
    });
  };

  //*! Conejo corriendo

  const conejoCorriendo = (strawberryPosition) => {
    return new Promise((resolve) => {
      const bunnyWidth = bunnyRef.current.offsetWidth;
      let bunnyPosition = bunnyState.left;
      let distance = strawberryPosition - bunnyPosition;
      let bunny = { ...bunnyState };
      if (distance > 0) {
        bunny = {
          ...bunny,
          img: bunnyImages.conejoCorriendo,
          trasform: "scaleX(-1)",
        };
        setBunyState(bunny);
      } else {
        bunny = {
          ...bunny,
          img: bunnyImages.conejoCorriendo,
          trasform: "scaleX(1)",
        };
        setBunyState(bunny);
      }

      const run = () => {
        if (distance > 0) {
          setTimeout(() => {
            setBunyState({
              ...bunny,
              left: bunnyPosition,
            });
            bunnyPosition = bunnyPosition + 2;
            if (bunnyPosition < strawberryPosition - 30) {
              run();
            } else {
              resolve();
            }
          }, 1);
        } else {
          setTimeout(() => {
            setBunyState({
              ...bunny,
              left: bunnyPosition,
            });
            bunnyPosition = bunnyPosition - 2;
            if (bunnyPosition > strawberryPosition) {
              run();
            } else {
              resolve();
            }
          }, 1);
        }
      };
      run();
    });
  };

  //*! comida

  const conejoComiendo = async (x) => {
    let left = x;
    const eat = (left) => {
      setBunyState({ ...bunnyState, img: bunnyImages.conejoComiendo, left });
      return new Promise((resolve) => {
        const comiendo = () => {
          setTimeout(() => {
            resolve();
          }, 1000);
        };
        comiendo();
      });
    };
    await eat(x);
    setBunyState({ ...bunnyState, img: bunnyImages.conejoDespierto, left });
  };

  //*! función principal
  const mainFunction = async (x, y) => {
    let conteinerHeigth = divRef.current.offsetHeight;
    const width = strawBerryRef.current.offsetWidth;
    const heigth = strawBerryRef.current.offsetHeight;
    let top =
      y - heigth / 2 > conteinerHeigth - heigth ? y - heigth : y - heigth / 2;
    let left = x - width / 2;
    setBunnyInAction(true);
    await animacionCaidaFresa(top, left, conteinerHeigth);
    await conejoCorriendo(left).then(() => conejoComiendo(left));
    setBunnyInAction(false);
  };

  useEffect(() => {
    const bunnyPosition = () => {
      const width = divRef.current.offsetWidth;
      let heigth = divRef.current.offsetHeight;
      const bunnyWidth = bunnyRef.current.offsetWidth;
      const bunnyHeigth = bunnyRef.current.offsetHeight;
      let top = heigth - bunnyHeigth;
      let left = (width - bunnyWidth) / 2;
      setBunyState({
        ...bunnyState,
        top,
        left,
        img: bunnyImages.conejoDurmiendo,
      });
    };

    const handleResize = () => {
      bunnyPosition();
      setStrawberryState({ ...strawberryState, display: "none" });
    };

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
        <div
          className="conejo"
          ref={bunnyRef}
          style={{
            top: bunnyState.top,
            left: bunnyState.left,
          }}
        >
          <img
            src={bunnyState.img}
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
