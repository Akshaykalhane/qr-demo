import React, { useState } from "react";

export default function Stepper({
  min = 0,
  max = 100,
  step = 1,
  initial = 0,
  onChange,
}) {
  const [value, setValue] = useState(initial);

  const handleDecrease = () => {
    const newValue = Math.max(min, value - step);
    setValue(newValue);
    onChange?.(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(max, value + step);
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <button
        className="btn btn-outline-secondary"
        onClick={handleDecrease}
        disabled={value <= min}
      >
        -
      </button>
      <span className="px-3">{value}</span>
      <button
        className="btn btn-outline-primary"
        onClick={handleIncrease}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}
