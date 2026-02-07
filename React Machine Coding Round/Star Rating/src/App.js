import { useState } from "react";
import StarRating from "./StarRating";
import "./styles.css";

export default function App() {
  const [rating, setRating] = useState(3);
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <StarRating max={5} value={rating} onChange={setRating} />
    </div>
  );
}
