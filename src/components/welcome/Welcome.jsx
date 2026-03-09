import { useState } from "react";
import "./welcome.scss";

import logo from "./../../assets/logo.png";
import { toast } from "react-toastify";
import { db } from "../../firebase-config";
import { collection, addDoc } from "firebase/firestore";

export default function Welcome({ setCurrentPage }) {
  const [selectedPoint, setSelectedPoint] = useState("");
  const handleChange = (e) => {
    const { value } = e.target;
    console.log(value);
    setSelectedPoint(value);
  };

  return (
    <div className="Welcome w-100 h-100  flex-col-center justify-content-start px-4 py-5">
      <img src={logo} alt="logo" className="logo" />
      <h1 className="text-center w-100">WELCOME</h1>
      <section className="d-flex flex-column gap-3 w-100 pt-5">
        <h3 className="fs-3 text-black">Select Your Point:</h3>
        <div className="btn-group">
          {/* <button
            className={`btn ${
              selectedPoint === "entry" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setSelectedPoint("entry")}
          >
            ENTRY POINT
          </button>
          <button
            className={`btn ${
              selectedPoint === "exit" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setSelectedPoint("exit")}
          >
            EXIT POINT
          </button> */}
          <select
            className="form-select"
            value={selectedPoint}
            onChange={handleChange}
          >
            <option value="">Select Point</option>
            <option value="entry">Entry</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>
      </section>
      <button
        className="btn btn-primary w-100 mt-5"
        onClick={() => {
          if (!selectedPoint) {
            toast.warning("Please select point");
            return;
          }
          setCurrentPage(selectedPoint);
        }}
      >
        CONTINUE
      </button>
    </div>
  );
}
