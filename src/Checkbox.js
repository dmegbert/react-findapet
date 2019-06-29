import React from "react";

function Checkbox({ answer, value, onClick, questionId }) {
  let className = answer[value] ? "btn active" : "btn";

  return (
    <button className={className} key={value} onClick={onClick}>
      {value}
    </button>
  );
}

export default Checkbox;
