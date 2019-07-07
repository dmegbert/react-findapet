import React, { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import { BreedCount, BreedItem, Question, ShowAllBreedsButton, SingleBreed } from './components'

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

function setInitialAnswers(questions) {
  let initialAnswers = []
  for (let i = 0; i < questions.length; i++) {
    let answer = {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    }
    initialAnswers = initialAnswers.concat(answer)
  }
  return initialAnswers
}

const App = () => {
  const [{ minimum, maximum }, setWeight] = useState({
    minimum: 0,
    maximum: 300,
  })
  const [questions, setQuestions] = useState(myQuestions)
  const [answers, setAnswers] = useState(myAnswers)
  //const initialAnswers = setInitialAnswers(myQuestions)
  const [breeds, setBreedInfo] = useState(null)
  const [breedCount, setBreedCount] = useState(182)
  const [showAllBreeds, setShowAllBreeds] = useState(false)
  const [showSingleBreedInfo, setShowSingleBreedInfo] = useState(false)
  const [singleBreedId, setSingleBreedId] = useState(null)

  // useEffect(() => {
  //
  //     const weight = { minimum: 1, maximum: 300 }
  //     const data = {
  //       answers,
  //       weight,
  //     }
  //     console.log(answers)
  //     debugger
  //
  //     axios
  //       .post(`${process.env.REACT_APP_BASE_URL}/dog/breed_count`, { data })
  //       .then(res => {
  //         setBreedInfo(res.data)
  //         setBreedCount(Object.keys(res.data).length)
  //       })
  //       .catch(error => {
  //         console.log(error)
  //       })
//
      //   function getTenRandomBreeds(breeds) {
      //   let tenBreeds = {}
      //   let keys = Object.keys(breeds)
      //   keys = shuffle(keys)
      //   keys = keys.slice(0, 10)
      //
      //   for (let i = 0; i < 10; i++) {
      //     tenBreeds[keys[i]] = breeds[keys[i]]
      //   }
      //
      //   return tenBreeds
      // }

      // if (breeds && !showAllBreeds && breedCount >= 10) {
      //   let tenRandomBreeds = getTenRandomBreeds(breeds)
      //   setBreedInfo(tenRandomBreeds)
      // }
  //   }, [breeds, breedCount, answers],
  // )

  function handleGetBreedCount() {
    const weight = { minimum: minimum, maximum: maximum }
      const data = {
        answers,
        weight,
      }

      axios
        .post(`${process.env.REACT_APP_BASE_URL}/dog/breed_count`, { data })
        .then(res => {
          setBreedInfo(res.data)
          setBreedCount(Object.keys(res.data).length)
        })
        .catch(error => {
          console.log(error)
        })
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
    setWeight({
      minimum: parseFloat(event.target.value),
      maximum: maximum,
    })
    handleGetBreedCount()
  }

  function handleChangeWeightMaximum(event) {
    setWeight({
      maximum: parseFloat(event.target.value),
      minimum: minimum,
    })
    handleGetBreedCount()
  }


  function getBreedItems(breeds) {
    let items = []

    if (breeds && !showAllBreeds && breedCount >= 10) {
      breeds = getTenRandomBreeds(breeds)
    }

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

//   const getTenRandomBreeds = useCallback(
//   () => {
//     let tenBreeds = {}
//     let keys = Object.keys(breeds)
//     keys = shuffle(keys)
//     keys = keys.slice(0, 10)
//
//     for (let i = 0; i < 10; i++) {
//       tenBreeds[keys[i]] = breeds[keys[i]]
//     }
//
//     return tenBreeds
//   },
//   [breeds],
// );

  // function getTenRandomBreeds(breeds) {
  //   let tenBreeds = {}
  //   let keys = Object.keys(breeds)
  //   keys = shuffle(keys)
  //   keys = keys.slice(0, 10)
  //
  //   for (let i = 0; i < 10; i++) {
  //     tenBreeds[keys[i]] = breeds[keys[i]]
  //   }
  //
  //   return tenBreeds
  // }

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
    let newAnswers = answers
    newAnswers[question.id][checkboxValue] = !newAnswers[question.id][checkboxValue]
    setAnswers(newAnswers)
    handleGetBreedCount()
  }

  const breedItems = getBreedItems(breeds)
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
        />
      )}
    </div>
  )
}

export default App
