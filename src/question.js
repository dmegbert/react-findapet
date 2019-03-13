import React from "react";

export class Question extends React.Component {
    renderCheckbox(value) {
        return (
            <Checkbox
                value={value}
                questionId={this.props.question.id}
                answer={this.props.answers[this.props.question.id]}
                onClick={() => this.props.onClick(this.props.question.id, value)}
            />
        );
    }

    createQuestion() {
        let childrenCheckboxes = [];
        for (let j = 1; j < 6; j++) {
            childrenCheckboxes.push(<td key={j}>{this.renderCheckbox(j)}</td>);
        }
        return (
            <div>
                <p>{this.props.question.text}</p>
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

    render() {
        return (this.createQuestion());
    }
}

function Checkbox(props) {
    let className = props.answer[props.value] ? "btn active" : "btn";

    return (
        <button className={className}
            key={props.value}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}
