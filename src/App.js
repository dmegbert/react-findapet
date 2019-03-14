import React, {Component} from 'react';
import './App.css';
import axios from 'axios';
import { Question } from './question.js'


function ShowAllBreedsButton(props) {
    return (
        <div>
            <button onClick={props.onClick} className={props.className}>
                Show All Breeds
            </button>
        </div>
    );
}

function BreedItem(props) {
        return (
            <div>
                <button
                    key={props.breedKey}
                    id={props.breedKey}
                    className="btn"
                    onClick={props.onClick}
                >
                    {props.value}
                </button>
            </div>
        );
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
                },
                {
                    id: 2,
                    name: "friendlinessToDogs",
                    text: "Friendliness to other Dogs."
                }
            ],
            answers : [],
            weight: {
                minimum: 0,
                maximum: 300,
            },
            breedCount: 182,
            breeds: null,
            showAllBreeds: false,
            showSingleBreedInfo: false,
            singleBreedInfo: null,
    };
        let answers = [];
        for (let i = 0; i < this.state.questions.length; i++) {
            let answer = {
                    1: false,
                    2: false,
                    3: false,
                    4: false,
                    5: false,
                };
            answers = answers.concat(answer);
        }
        this.state.answers = answers;
        this.handleChangeWeightMinimum = this.handleChangeWeightMinimum.bind(this);
        this.handleChangeWeightMaximum = this.handleChangeWeightMaximum.bind(this);
    }

    handleChangeWeightMinimum(event) {
        let weight = this.state.weight;
        weight.minimum = parseFloat(event.target.value);

        this.setState({weight: weight });

        this.handleGetBreedCount();
    }

    handleChangeWeightMaximum(event) {
        let weight = this.state.weight;
        weight.maximum = parseFloat(event.target.value);

        this.setState({weight: weight });

        this.handleGetBreedCount();
    }

    handleGetSingleDogInfo(dogId) {
        let dogInfo;

        axios.get(`${process.env.REACT_APP_BASE_URL}/dog/${dogId}`)
            .then(res => {
                dogInfo = res.data;
                this.setState({
                    showSingleBreedInfo: true,
                    singleBreedInfo: dogInfo
                });

            })
            .catch(error => {console.log(error)})

    }


    handleGetBreedCount() {
        const answers = this.state.answers;
        const weight = this.state.weight;
        const data = {answers, weight};

        axios.post(`${process.env.REACT_APP_BASE_URL}/dog/breed_count`, { data })
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

        if (this.state.breeds && !this.state.showAllBreeds && this.state.breedCount >= 10) {
            breeds =  this.getTenRandomBreeds(breeds);
        }

        for (let key in breeds) {
            if (breeds.hasOwnProperty(key)) {
                items.push(
                    <BreedItem
                        key={key}
                        breedKey={key}
                        value={breeds[key]}
                        onClick={() => this.handleGetSingleDogInfo(key)}
                    />
                )
            }
        }

        return items;
    }

    getTenRandomBreeds(breeds) {
        let tenBreeds = {};
        let keys = Object.keys(breeds);
        keys = this.shuffle(keys);
        keys = keys.slice(0, 10);

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
        const showSingleBreedInfo = this.state.showSingleBreedInfo;
        const singleBreedInfo = this.state.singleBreedInfo;
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
                {/*Questions and list results*/}
                {!showSingleBreedInfo &&
                <div>
                    {questionItems}
                    <div>
                        <div>
                            <label>Minimum Weight: </label>
                            <input type="number" pattern="[0-9]*" name="weightMinimum" onChange={this.handleChangeWeightMinimum}/>
                        </div>
                        <div>
                            <label>Maximum Weight: </label>
                            <input type="number" onChange={this.handleChangeWeightMaximum}/>
                        </div>
                    </div>
                    <div>
                        <p>You are currently matched with {breedCount} dogs.</p>
                    </div>
                    <hr/>
                    <div>
                        {breeds &&
                        <ShowAllBreedsButton
                            onClick={() => this.setState({showAllBreeds: !this.state.showAllBreeds})}
                            className={this.state.showAllBreeds ? "btn active" : "btn"}
                        />}
                        {breedItems}
                    </div>
                </div>
                }
                {/*Single Breed Information Section*/}
                {showSingleBreedInfo &&
                <div>
                    <div>
                        <p>Name: {singleBreedInfo["name"]}</p>
                        <p>Description: {singleBreedInfo["description"]}</p>
                        <p>Personality: {singleBreedInfo["personality"]}</p>
                    </div>
                    <div>
                        <button
                            onClick={() => this.setState({singleBreedInfo: null, showSingleBreedInfo: false})}
                            className="btn"
                        >
                            Go Back To Results
                        </button>
                    </div>
                </div>
                }


            </div>

        );
    }
}

export default App;
