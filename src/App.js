import React, {Component} from 'react';
import './App.css';
import axios from 'axios';


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

class Question extends React.Component {
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


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions : [
                {
                    id: 0,
                    name : "energy",
                    text: "Energy Level (You may select more than one)",
                },
                {
                    id: 1,
                    name: "playfulness",
                    text: "Playfulness (You may select more than one)",
                }
            ],
            answers : [
                {
                    1: false,
                    2: false,
                    3: false,
                    4: false,
                    5: false,
                },
                {
                    1: false,
                    2: false,
                    3: false,
                    4: false,
                    5: false,
                },
            ],
            breedCount: 182,
            breeds: null,
    };
    }

    handleGetBreedCount() {
        const answers = this.state.answers;

        axios.post('http://localhost:5000/dog/breed_count', { answers })
            .then(res => {
                const breedCount = Object.keys(res.data).length;
                const breeds = res.data;
                this.setState({
                    breedCount: breedCount,
                    breeds: breeds,
                });
            }).catch(error => {console.log(error)})
    }

    handleClick(questionId, value) {
        let prevAnswers = this.state.answers.slice();

        this.handleGetBreedCount();

        prevAnswers[questionId][value] = !prevAnswers[questionId][value];

        this.setState({
            answers: prevAnswers
        });
    }

    getBreedItems(breeds) {
        let items = [];

        if (this.state.breeds && this.state.breedCount >= 10) {
            breeds =  this.getTenRandomBreeds(breeds);
        }

        for (let key in breeds) {
            if (breeds.hasOwnProperty(key)) {
                items.push(<p key={key}>{breeds[key]}</p>)
            }
        }

        return items;
    }

    getTenRandomBreeds(breeds) {
        let tenBreeds = {};
        let keys = Object.keys(breeds);
        keys = this.shuffle(keys);
        keys = keys.slice(0, 9);

        for (let i = 0; i < 10; i++) {
            tenBreeds[keys[i]] = breeds[keys[i]];
        }

        return tenBreeds;
    }

    shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    render() {
        const questions = this.state.questions;
        const answers = this.state.answers;
        const breedCount = this.state.breedCount;
        const breeds = this.state.breeds;

        const breedItems = this.getBreedItems(breeds);

        const questionItems = questions.map((question) => {
            return (
               <Question
                   key={question.id}
                   question={question}
                   answers={answers}
                   onClick={(questionId, value) => this.handleClick(questionId, value)}
               />
            );
        });

        return (
            <div className="App">
                {questionItems}
                <div>
                    <p>You are currently matched with {breedCount} dogs.</p>
                </div>
                <hr />
                <div>
                    {breedItems}
                </div>
            </div>

        );
    }
}

export default App;
