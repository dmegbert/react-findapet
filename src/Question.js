import React from "react";

import Checkbox from './Checkbox'


const Question = ({question, answers, onClick}) => {
	let childrenCheckboxes = [];
	for (let j = 1; j < 6; j++) {
		childrenCheckboxes.push(
			<td key={j}>
				<Checkbox
					value={j}
					questionId={question.id}
					answer={answers[question.id]}
					onClick={() => onClick(question.id, j)}
				/>
			</td>
		);
	}
	return (
		<div>
			<p>{question.text}</p>
			<table>
				<tbody>
				<tr>
					{childrenCheckboxes}
				</tr>
				</tbody>
			</table>
			<hr />
		</div>
	)
}

export default Question;
