import Shape from "./Shape";
import "./styles.css";

const BOX_DATA = [
  [1, 1, 1, 1, 1, 1],
  [1, 0, 0],
  [1, 1, 1],
];
export default function App() {
  return (
    <div className="App">
      <Shape boxes={BOX_DATA} />
    </div>
  );
}
