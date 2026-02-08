import { useState } from "react";
import BarChart from "../BarChart";
import CHART_DATA from "./data";
import "./styles.css";

export default function App() {
  const [showChart, setShowChart] = useState(false);
  return (
    <div className="App">
      <button className="button" onClick={() => setShowChart((prev) => !prev)}>
        Toggle Button
      </button>
      {showChart ? <BarChart data={CHART_DATA} /> : null}
    </div>
  );
}
