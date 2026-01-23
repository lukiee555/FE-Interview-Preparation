import { useEffect, useState } from "react";
import "./styles.css";
export default function App() {
  /**
   * Make Progress Bar, add accessbaility as well as
   * add animation Because of animation can't use width property here
   * Will Use transform and transalte
   * Width can be used but not performance efficent
   *  */
  const ProgressBar = ({ progress }) => {
    const [animatedProgress, setAnimatedProgress] = useState(0);
    useEffect(() => {
      setTimeout(() => setAnimatedProgress(progress), 100);
    }, [progress]);
    return (
      <div className="progress-bar-container">
        <div
          className="progress"
          style={{ transform: `translateX(${animatedProgress - 100}%)` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemax="100"
          aria-valuemin="0"
        ></div>
      </div>
    );
  };
  return (
    <div className="App">
      <h1>Progress Bar</h1>
      <ProgressBar progress={70} />
    </div>
  );
}
