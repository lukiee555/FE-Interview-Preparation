import { useEffect, useState, useRef } from "react";
import "./styles.css";
const OTP_DIGIT_COUNT = 5;
export default function App() {
  const [arr, setArr] = useState(new Array(OTP_DIGIT_COUNT).fill(""));
  const inputsRef = useRef([]);
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);
  const handleOnChange = (value, index) => {
    console.log(isNaN(value));
    if (isNaN(value)) return;
    const newInput = [...arr];
    newInput[index] = value;
    setArr(newInput);
    value && inputsRef.current[index + 1]?.focus();
  };
  const handleKeyDown = (event, index) => {
    if (!event.target.value && event.key === "Backspace") {
      inputsRef.current[index - 1]?.focus();
    }
  };
  return (
    <div className="App">
      <h1>Validate OTP</h1>
      <div className="otp-container">
        {arr.map((item, index) => {
          return (
            <input
              className="otp-input"
              type="text"
              key={index}
              value={arr[item]}
              ref={(item) => (inputsRef.current[index] = item)}
              onChange={(event) =>
                handleOnChange(event.target.value.trim().slice(-1), index)
              }
              onKeyDown={(event) => handleKeyDown(event, index)}
            />
          );
        })}
      </div>
    </div>
  );
}
