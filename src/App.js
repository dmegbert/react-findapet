import React, { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import { BreedCount, BreedItem, Question, ShowAllBreedsButton, SingleBreed, WeightMinAndMax } from './components'

const myQuestions = [
  {
    id: 0,
    name: 'energy',
    text: 'Energy Level',
  },
  {
    id: 1,
    name: 'playfulness',
    text: 'Level of playfulness',
  },
  {
    id: 2,
    name: 'friendlinessToDogs',
    text: 'Friendliness to other dogs',
  },
  {
    id: 3,
    name: 'easeOfTraining',
    text: 'Ease of training',
  },
  {
    id: 4,
    name: 'grooming',
    text: 'Grooming needs (1 is little, 5 is a lot)',
  },
  {
    id: 5,
    name: 'Vocality',
    text: 'Vocality Level',
  },
]

let myAnswers = [
  {
    '1': false,
    '2': false,
    '3': false,
    '4': false,
    '5': false,
  },
  {
    '1': false,
    '2': false,
    '3': false,
    '4': false,
    '5': false,
  },
  {
    '1': false,
    '2': false,
    '3': false,
    '4': false,
    '5': false,
  },
  {
    '1': false,
    '2': false,
    '3': false,
    '4': false,
    '5': false,
  },
  {
    '1': false,
    '2': false,
    '3': false,
    '4': false,
    '5': false,
  },
  {
    '1': false,
    '2': false,
    '3': false,
    '4': false,
    '5': false,
  },
]

const App = () => {
  const [minimum, setWeightMinimum] = useState(0)
  const [maximum, setWeightMaximum] = useState(300)
  const [questions] = useState(myQuestions)
  const [answers, setAnswers] = useState(myAnswers)
  const [breeds, setBreedInfo] = useState(null)
  const [breedCount, setBreedCount] = useState(215)
  const [showAllBreeds, setShowAllBreeds] = useState(false)
  const [showSingleBreedInfo, setShowSingleBreedInfo] = useState(false)
  const [singleBreedId, setSingleBreedId] = useState(null)
  const [fetchData, setFetchData] = useState(false)

  useEffect(() => {

    if (fetchData) {
      const weight = { minimum: minimum, maximum: maximum }
      const data = {
        answers,
        weight,
      }

      axios
        .post(`${process.env.REACT_APP_BASE_URL}/dog/breed_count`, { data })
        .then(res => {
          if (showAllBreeds) {
            setBreedInfo(res.data)
          } else {
            setBreedInfo(limitBreedsShown(res.data))
          }
          setBreedCount(Object.keys(res.data).length)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }, [answers, minimum, maximum, showAllBreeds])

  function limitBreedsShown(breedData) {
    let tenBreeds = breedData
    if (breedData && Object.keys(breedData).length >= 10) {
      tenBreeds = getTenRandomBreeds(breedData)
    }
    return tenBreeds
  }


  function getTenRandomBreeds(breeds) {
    let tenBreeds = {}
    let keys = Object.keys(breeds)
    keys = shuffle(keys)
    keys = keys.slice(0, 10)

    for (let i = 0; i < 10; i++) {
      tenBreeds[keys[i]] = breeds[keys[i]]
    }

    return tenBreeds
  }

  function handleChangeWeightMinimum(event) {
    setWeightMinimum(parseFloat(event.target.value))
    setFetchData(true)
  }

  function handleChangeWeightMaximum(event) {
    setWeightMaximum(parseFloat(event.target.value))
    setFetchData(true)
  }

  function getBreedItems() {
    let items = []

    for (let key in breeds) {
      if (breeds.hasOwnProperty(key)) {
        items.push(
          <BreedItem
            key={key}
            breedKey={key}
            value={breeds[key]}
            onClick={() => {
              setSingleBreedId(key)
              setShowSingleBreedInfo(true)
            }}
          />,
        )
      }
    }

    return items
  }


  function shuffle(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }

    return array
  }

  function handleQuestionBoxClick(checkboxValue, question) {
    let newAnswers = answers.slice()
    newAnswers[question.id][checkboxValue] = !newAnswers[question.id][checkboxValue]
    setAnswers(newAnswers)
    setFetchData(true)
  }

  const breedItems = getBreedItems()


  const questionItems = questions.map(question => {
    return (
      <Question
        key={question.id}
        questionId={question.id}
        questionText={question.text}
        answer={answers[question.id]}
        onClick={checkboxValue => handleQuestionBoxClick(checkboxValue, question)}
      />
    )
  })

  function toggleShowSingleBreedInfo() {
    setShowSingleBreedInfo(false)
  }

  return (
    <div className="App">
      <div>
        <h1>Find the Best Dog for You!</h1>
      </div>
      {/*Questions and list results*/}
      {!showSingleBreedInfo && (
        <div>
          {questionItems}
          <div>
            <WeightMinAndMax
              weight={minimum}
              name={'weightMinimum'}
              label={'Minimum Weight'}
              onChange={handleChangeWeightMinimum}
            />
            <WeightMinAndMax
              weight={maximum}
              name={'weightMaximum'}
              label={'Maximum Weight'}
              onChange={handleChangeWeightMaximum}
            />
          </div>
          <BreedCount breedCount={breedCount}/>
          <hr/>
          <div>
            {breeds && (
              <ShowAllBreedsButton
                onClick={() => setShowAllBreeds(!showAllBreeds)}
                className={showAllBreeds ? 'btn active' : 'btn'}
              />
            )}
            {breedItems}
          </div>
        </div>
      )}
      {/*Single Breed Information Section*/}
      {showSingleBreedInfo && (
        <SingleBreed
          singleBreedId={singleBreedId}
          toggleShowSingleBreedInfo={toggleShowSingleBreedInfo}
        />
      )}
    </div>
  )
}

export default App
