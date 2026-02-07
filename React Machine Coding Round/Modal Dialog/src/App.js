import { useState } from "react";
import Modal from "./Modal";
import "./styles.css";

export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <div className="App">
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <Modal open={open} title={"Modal Title"} onClose={() => setOpen(false)}>
        One morning, when Gregor Samsa woke from troubled dreams, he found
        himself transformed in his bed into a horrible vermin. He lay on his
        armour-like back, and if he lifted his head a little he could see his
        brown belly, slightly domed and divided by arches into stiff sections.
      </Modal>
    </div>
  );
}
