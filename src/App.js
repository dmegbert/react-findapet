import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import Question from "./Question";

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
    <button onClick={props.onClick} className="btn">
      Go Back To Results
    </button>
  );
}

function Stars(props) {
  let items = [];
  let solidStars = props.solidStars;

  for (let i = 1; i < 6; i++) {
    if (i <= solidStars) {
      items.push(<i key={i} className="fas fa-star" aria-hidden="true" />);
    } else {
      items.push(<i key={i} className="far fa-star" aria-hidden="true" />);
    }
  }
  return items;
}

const myQuestions = [
  {
    id: 0,
    name: "energy",
    text: "Energy Level"
  },
  {
    id: 1,
    name: "playfulness",
    text: "Level of playfulness"
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
];

function setInitialAnswers(questions) {
  let initialAnswers = [];
  for (let i = 0; i < questions.length; i++) {
    let answer = {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false
    };
    initialAnswers = initialAnswers.concat(answer);
  }
  return initialAnswers;
}

const App = () => {
  const [{ minimum, maximum }, setWeight] = useState({
    minimum: 0,
    maximum: 300
  });
  const [{ questions, answers }, setQuestionsAnswers] = useState({
    questions: myQuestions,
    answers: setInitialAnswers(myQuestions)
  });
  const [{ breedCount, breeds }, setBreedInfo] = useState({
    breedCount: 182,
    breeds: null
  });
  const [showAllBreeds, setShowAllBreeds] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [showFullPersonality, setShowFullPersonality] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [
    { singleBreedInfo, showSingleBreedInfo },
    setSingleBreedInfo
  ] = useState({ singleBreedInfo: null, showSingleBreedInfo: false });

  function handleChangeWeightMinimum(event) {
    setWeight({
      minimum: parseFloat(event.target.value),
      maximum: maximum
    });
    handleGetBreedCount();
  }

  function handleChangeWeightMaximum(event) {
    setWeight({
      maximum: parseFloat(event.target.value),
      minimum: minimum
    });
    handleGetBreedCount();
  }

  function handleGetSingleDogInfo(dogId) {
    let dogInfo;

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/dog/${dogId}`)
      .then(res => {
        dogInfo = res.data;
        dogInfo["id"] = dogId;
        setSingleBreedInfo({
          showSingleBreedInfo: true,
          singleBreedInfo: dogInfo
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  function handleGetBreedCount() {
    const weight = { minimum: minimum, maximum: maximum };
    const data = { answers, weight };

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/dog/breed_count`, { data })
      .then(res => {
        setBreedInfo({
          breedCount: Object.keys(res.data).length,
          breeds: res.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  function getBreedItems(breeds) {
    let items = [];

    if (breeds && !showAllBreeds && breedCount >= 10) {
      breeds = getTenRandomBreeds(breeds);
    }

    for (let key in breeds) {
      if (breeds.hasOwnProperty(key)) {
        items.push(
          <BreedItem
            key={key}
            breedKey={key}
            value={breeds[key]}
            onClick={() => handleGetSingleDogInfo(key)}
          />
        );
      }
    }

    return items;
  }

  function getTenRandomBreeds(breeds) {
    let tenBreeds = {};
    let keys = Object.keys(breeds);
    keys = shuffle(keys);
    keys = keys.slice(0, 10);

    for (let i = 0; i < 10; i++) {
      tenBreeds[keys[i]] = breeds[keys[i]];
    }

    return tenBreeds;
  }

  function shuffle(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  function handleQuestionBoxClick(checkboxValue, question) {
    let prevAnswers = answers;
    prevAnswers[question.id][checkboxValue] = !prevAnswers[question.id][
      checkboxValue
    ];
    setQuestionsAnswers({ answers: prevAnswers, questions: questions });
    handleGetBreedCount();
  }

  const breedItems = getBreedItems(breeds);
  const questionItems = questions.map(question => {
    return (
      <Question
        key={question.id}
        questionId={question.id}
        questionText={question.text}
        answer={answers[question.id]}
        onClick={checkboxValue =>
          handleQuestionBoxClick(checkboxValue, question)
        }
      />
    );
  });

  function resetSingleBreedInfo() {
    setSingleBreedInfo({ singleBreedInfo: null, showSingleBreedInfo: false });
  }

  return (
    <div className="App">
      <div>
        <h1 align="center">Find the Best Dog for You!</h1>
      </div>
      {/*Questions and list results*/}
      {!showSingleBreedInfo && (
        <div>
          {questionItems}
          <div>
            <div>
              <label>Minimum Weight: </label>
              <input
                value={minimum}
                type="number"
                pattern="[0-9]*"
                name="weightMinimum"
                onChange={handleChangeWeightMinimum}
              />
            </div>
            <div>
              <label>Maximum Weight: </label>
              <input
                type="number"
                value={maximum}
                pattern="[0-9]*"
                onChange={handleChangeWeightMaximum}
              />
            </div>
          </div>
          <div>
            <p>You are currently matched with {breedCount} dogs.</p>
          </div>
          <hr />
          <div>
            {breeds && (
              <ShowAllBreedsButton
                onClick={() => setShowAllBreeds(!showAllBreeds)}
                className={showAllBreeds ? "btn active" : "btn"}
              />
            )}
            {breedItems}
          </div>
        </div>
      )}
      {/*Single Breed Information Section*/}
      {showSingleBreedInfo && (
        <div>
          <div>
            <img
              src={`./img/dog-${singleBreedInfo["id"]}.jpg`}
              alt={`${singleBreedInfo["name"]}`}
            />
            <h2>{singleBreedInfo["name"]}</h2>
          </div>
          <div>
            <BackToResultsButton onClick={() => resetSingleBreedInfo()} />
          </div>
          <div>
            <p>
              <strong>Energy Level: </strong>
              <Stars solidStars={singleBreedInfo["energy_level"]} />
            </p>
            <p>
              <strong>Playfulness: </strong>
              <Stars solidStars={singleBreedInfo["playfulness"]} />
            </p>
            <p>
              <strong>Friendliness to Dogs: </strong>
              <Stars solidStars={singleBreedInfo["friendliness_to_dogs"]} />
            </p>
            <p>
              <strong>Friendliness to Other Pets: </strong>
              <Stars
                solidStars={singleBreedInfo["friendliness_to_other_pets"]}
              />
            </p>
            <p>
              <strong>Friendliness to New People: </strong>
              <Stars
                solidStars={singleBreedInfo["friendliness_to_strangers"]}
              />
            </p>
            <p>
              <strong>Ease of Training: </strong>
              <Stars solidStars={singleBreedInfo["ease_of_training"]} />
            </p>
            <p>
              <strong>Grooming Needs: </strong>
              <Stars solidStars={singleBreedInfo["grooming_requirements"]} />
            </p>
            <p>
              <strong>Exercise Needs: </strong>
              <Stars solidStars={singleBreedInfo["exercise_requirements"]} />
            </p>
            <p>
              <strong>Affection Level: </strong>
              <Stars solidStars={singleBreedInfo["affection_level"]} />
            </p>
            <p>
              <strong>Watchfulness: </strong>
              <Stars solidStars={singleBreedInfo["watchfulness"]} />
            </p>
            <p>
              <strong>Heat Sensitivity: </strong>
              <Stars solidStars={singleBreedInfo["heat_sensitivity"]} />
            </p>
            <p>
              <strong>Vocality: </strong>
              <Stars solidStars={singleBreedInfo["vocality"]} />
            </p>
            <p>
              <strong>Weight: </strong>
              {`${singleBreedInfo["weight_min"]}lbs - ${
                singleBreedInfo["weight_max"]
              }lbs`}
            </p>
            <p>
              <strong>Height: </strong>
              {`${singleBreedInfo["height_min"]}" - ${
                singleBreedInfo["height_max"]
              }"`}
            </p>
          </div>
          <div>
            <p>
              <strong>Description:</strong>
              {showFullDescription
                ? singleBreedInfo["description"]
                : `${singleBreedInfo["description"].substring(0, 300)}...`}
              <button
                className="read-more-btn"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? "Read Less" : "Read More"}
              </button>
            </p>
            <p>
              <strong>Personality:</strong>
              {showFullPersonality ||
              singleBreedInfo["personality"].length <= 300
                ? singleBreedInfo["personality"]
                : `${singleBreedInfo["personality"].substring(0, 300)}...`}
              {!(singleBreedInfo["personality"].length <= 300) && (
                <button
                  className="read-more-btn"
                  onClick={() => setShowFullPersonality(!showFullPersonality)}
                >
                  {showFullPersonality ? "Read Less" : "Read More"}
                </button>
              )}
            </p>
            <p>
              <strong>History:</strong>
              {showFullHistory
                ? singleBreedInfo["history"]
                : `${singleBreedInfo["history"].substring(0, 300)}...`}
              <button
                className="read-more-btn"
                onClick={() => setShowFullHistory(!showFullHistory)}
              >
                {showFullHistory ? "Read Less" : "Read More"}
              </button>
            </p>
          </div>
          <div>
            <BackToResultsButton onClick={() => resetSingleBreedInfo()} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
