import React from "react";
import { useState } from "react";
import axios from "axios";

const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
  const [coordState, setCoordState] = useState(initialIndex);
  const [steps, setSteps] = useState(initialSteps);
  const [message, setMessage] = useState(initialMessage);
  const [theEmail, settheEmail] = useState(initialEmail);

  const theGrid = [
    "(1, 1)",
    "(2, 1)",
    "(3, 1)",
    "(1, 2)",
    "(2, 2)",
    "(3, 2)",
    "(1, 3)",
    "(2, 3)",
    "(3, 3)",
  ];
  function getXY() {
    return theGrid[coordState];
  }

  function getXYMesaj(yon) {
    if (yon == "left") {
      setMessage("Sola gidemezsiniz");
    } else if (yon == "up") {
      setMessage("Yukarıya gidemezsiniz");
    } else if (yon == "right") {
      setMessage("Sağa gidemezsiniz");
    } else if (yon == "down") {
      setMessage("Aşağıya gidemezsiniz");
    }
  }

  function reset() {
    console.log("reset zamanı");
    setSteps(initialSteps);
    setCoordState(initialIndex);
    settheEmail(initialEmail);
    setMessage(initialMessage);
  }

  function sonrakiIndex(yon) {}

  function ilerle(evt) {
    const coordIndex = coordState;
    if (evt == "left" && !(coordIndex % 3 == 0)) {
      setSteps(steps + 1);
      setCoordState(coordIndex - 1);
    } else if (evt == "up" && coordIndex / 3 >= 1) {
      setSteps(steps + 1);
      setCoordState(coordIndex - 3);
    } else if (evt == "right" && !(coordIndex % 3 == 2)) {
      setSteps(steps + 1);
      setCoordState(coordIndex + 1);
    } else if (evt == "down" && coordIndex / 3 < 2) {
      setCoordState(coordIndex + 3);
      setSteps(steps + 1);
    } else getXYMesaj(evt);
  }

  function onChange(evt) {
    settheEmail(evt.target.value);
    if (!/\S+@\S+\.\S+/.test(evt.target.value)) {
      setMessage("Ouch: email must be a valid email");
    } else {
      setMessage("");
    }
  }

  function onSubmit(evt) {
    evt.preventDefault();

    const theData = {
      x: theGrid[coordState][1],
      y: theGrid[coordState][4],
      steps: steps,
      email: theEmail,
    };

    const config = {
      method: "post",
      url: "http://localhost:9001/api/result",
      headers: {
        "Content-Type": "application/json",
      },
      data: theData,
    };

    settheEmail(initialEmail);
    axios(config)
      .then(function (response) {
        setMessage(response.data.message);
      })
      .catch(function (error) {
        setMessage(error.response.data.message);
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Koordinatlar {getXY()}</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div
            key={idx}
            className={`square${idx === coordState ? " active" : ""}`}
          >
            {idx === coordState ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={(e) => ilerle(e.target.id)} id="left">
          SOL
        </button>
        <button onClick={(e) => ilerle(e.target.id)} id="up">
          YUKARI
        </button>
        <button onClick={(e) => ilerle(e.target.id)} id="right">
          SAĞ
        </button>
        <button onClick={(e) => ilerle(e.target.id)} id="down">
          AŞAĞI
        </button>
        <button onClick={(e) => reset()} id="reset">
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          onChange={(e) => onChange(e)}
          value={theEmail}
          placeholder="email girin"
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
