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

function BackToResultsButton(props) {
	return (
		<button
			onClick={props.onClick}
			className={props.className}
		>
			Go Back To Results
		</button>
	)
}

function Stars(props) {
	let items = [];
	let solidStars = props.solidStars;

	for (let i = 1; i < 6; i++) {
		if (i <= solidStars) {
			items.push(<i key={i} className="fas fa-star" aria-hidden="true"/>)
		}
		else {
			items.push(<i key={i} className="far fa-star" aria-hidden="true"/>)
		}
	}
	return items;
}

class App extends Component {
	constructor(props) {
		super(props);
		this.myRef = React.createRef();
		this.state = {
			questions : [
				{
					id: 0,
					name : "energy",
					text: "Energy Level",
				},
				{
					id: 1,
					name: "playfulness",
					text: "Level of playfulness",
				},
				{
					id: 2,
					name: "friendlinessToDogs",
					text: "Friendliness to other dogs"
				},
				{
					id: 3,
					name: "easeOfTraining",
					text: "Ease of training"
				},
				{
					id: 4,
					name: "grooming",
					text: "Grooming needs (1 is little, 5 is a lot)"
				},
				{
					id: 5,
					name: "Vocality",
					text: "Vocality Level"
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
			showFullHistory: false,
			showFullPersonality: false,
			showFullDescription: false
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
				dogInfo['id'] = dogId;
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
		const {
			questions, answers, breedCount, breeds, showSingleBreedInfo,
			singleBreedInfo, showFullHistory, showFullPersonality, showFullDescription
		} = this.state;
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
			<div className="App" ref={this.myRef}>
				<div>
					<h1 align="center">Find the Best Dog for You!</h1>
				</div>
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
							<input type="number" pattern="[0-9]*" onChange={this.handleChangeWeightMaximum}/>
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
						<img src={`./img/dog-${singleBreedInfo["id"]}.jpg`} alt={`${singleBreedInfo["name"]}`}/>
						<h2>{singleBreedInfo["name"]}</h2>
					</div>
					<div>
						<BackToResultsButton
							onClick={() => this.setState({singleBreedInfo: null, showSingleBreedInfo: false})}
							className="btn"
						/>
					</div>
					<div>
						<p><strong>Energy Level: </strong><Stars solidStars={this.state.singleBreedInfo["energy_level"]} /></p>
						<p><strong>Playfulness: </strong><Stars solidStars={this.state.singleBreedInfo["playfulness"]} /></p>
						<p><strong>Friendliness to Dogs: </strong><Stars solidStars={this.state.singleBreedInfo["friendliness_to_dogs"]} /></p>
						<p><strong>Friendliness to Other Pets: </strong><Stars solidStars={this.state.singleBreedInfo["friendliness_to_other_pets"]} /></p>
						<p><strong>Friendliness to New People: </strong><Stars solidStars={this.state.singleBreedInfo["friendliness_to_strangers"]} /></p>
						<p><strong>Ease of Training: </strong><Stars solidStars={this.state.singleBreedInfo["ease_of_training"]} /></p>
						<p><strong>Grooming Needs: </strong><Stars solidStars={this.state.singleBreedInfo["grooming_requirements"]} /></p>
						<p><strong>Exercise Needs: </strong><Stars solidStars={this.state.singleBreedInfo["exercise_requirements"]} /></p>
						<p><strong>Affection Level: </strong><Stars solidStars={this.state.singleBreedInfo["affection_level"]} /></p>
						<p><strong>Watchfulness: </strong><Stars solidStars={this.state.singleBreedInfo["watchfulness"]} /></p>
						<p><strong>Heat Sensitivity: </strong><Stars solidStars={this.state.singleBreedInfo["heat_sensitivity"]} /></p>
						<p><strong>Vocality: </strong><Stars solidStars={this.state.singleBreedInfo["vocality"]} /></p>
						<p><strong>Weight: </strong>{`${singleBreedInfo["weight_min"]}lbs - ${singleBreedInfo["weight_max"]}lbs`}</p>
						<p><strong>Height: </strong>{`${singleBreedInfo["height_min"]}" - ${singleBreedInfo["height_max"]}"`}</p>
					</div>
					<div>
						<p><strong>Description:</strong>
							{showFullDescription ? singleBreedInfo["description"] : `${singleBreedInfo["description"].substring(0, 300)}...`}
							<button className="read-more-btn" onClick={() => this.setState({showFullDescription: !showFullDescription})}>
								{showFullDescription ? 'Read Less' : 'Read More'}
							</button>
						</p>
						<p>
							<strong>Personality:</strong>
							{showFullPersonality || (singleBreedInfo["personality"].length <= 300) ? singleBreedInfo["personality"] : `${singleBreedInfo["personality"].substring(0, 300)}...`}
							{!(singleBreedInfo["personality"].length <= 300) && <button className="read-more-btn" onClick={() => this.setState({showFullPersonality: !showFullPersonality})}>
								{showFullPersonality ? 'Read Less' : 'Read More'}
							</button>}
						</p>
						<p>
							<strong>History:</strong>
							{showFullHistory ? singleBreedInfo["history"] : `${singleBreedInfo["history"].substring(0, 300)}...`}
							<button className="read-more-btn" onClick={() => this.setState({showFullHistory: !showFullHistory})}>
								{showFullHistory ? 'Read Less' : 'Read More'}
							</button>
						</p>
					</div>
					<div>
						<BackToResultsButton
							onClick={() => this.setState({singleBreedInfo: null, showSingleBreedInfo: false})}
							className="btn"
						/>
					</div>
				</div>
				}


			</div>

		);
	}
}

export default App;
