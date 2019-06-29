import React from "react";

import Checkbox from "./Checkbox";

const Question = ({ questionId, questionText, onClick, answer }) => {
  let childrenCheckboxes = [];
  for (let j = 1; j < 6; j++) {
    childrenCheckboxes.push(
      <td key={j}>
        <Checkbox
          value={j}
          questionId={questionId}
          answer={answer}
          onClick={() => onClick(j)}
        />
      </td>
    );
  }
  return (
    <div>
      <p>{questionText}</p>
      <table>
        <tbody>
          <tr>{childrenCheckboxes}</tr>
        </tbody>
      </table>
      <hr />
    </div>
  );
};

export default Question;
