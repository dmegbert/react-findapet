import axios from 'axios'
import { BreedItem, Question } from '../components'
import React, { useState } from 'react'

export const myQuestions = [
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

export function setInitialAnswers(questions) {
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

export const [{ minimum, maximum }, setWeight] = useState({
  minimum: 0,
  maximum: 300,
})
export const [{ questions, answers }, setQuestionsAnswers] = useState({
  questions: myQuestions,
  answers: setInitialAnswers(myQuestions),
})
export const [{ breedCount, breeds }, setBreedInfo] = useState({
  breedCount: 182,
  breeds: null,
})
export const [showAllBreeds, setShowAllBreeds] = useState(false)
export const [showFullHistory, setShowFullHistory] = useState(false)
export const [showFullPersonality, setShowFullPersonality] = useState(false)
export const [showFullDescription, setShowFullDescription] = useState(false)
export const [{ singleBreedInfo, showSingleBreedInfo }, setSingleBreedInfo] = useState({
  singleBreedInfo: null,
  showSingleBreedInfo: false,
})

const handleChangeWeightMinimum = event => {
  setWeight({
    minimum: parseFloat(event.target.value),
    maximum: maximum,
  })
  handleGetBreedCount()
}

export function handleChangeWeightMaximum(event) {
  setWeight({
    maximum: parseFloat(event.target.value),
    minimum: minimum,
  })
  handleGetBreedCount()
}

export function handleGetSingleDogInfo(dogId) {
  let dogInfo

  axios
    .get(`${process.env.REACT_APP_BASE_URL}/dog/${dogId}`)
    .then(res => {
      dogInfo = res.data
      dogInfo['id'] = dogId
      setSingleBreedInfo({
        showSingleBreedInfo: true,
        singleBreedInfo: dogInfo,
      })
    })
    .catch(error => {
      console.log(error)
    })
}

export function handleGetBreedCount() {
  export const weight = { minimum: minimum, maximum: maximum }
  export const data = { answers, weight }

  axios
    .post(`${process.env.REACT_APP_BASE_URL}/dog/breed_count`, { data })
    .then(res => {
      setBreedInfo({
        breedCount: Object.keys(res.data).length,
        breeds: res.data,
      })
    })
    .catch(error => {
      console.log(error)
    })
}

export function getBreedItems(breeds) {
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
          onClick={() => handleGetSingleDogInfo(key)}
        />,
      )
    }
  }

  return items
}

export function getTenRandomBreeds(breeds) {
  let tenBreeds = {}
  let keys = Object.keys(breeds)
  keys = shuffle(keys)
  keys = keys.slice(0, 10)

  for (let i = 0; i < 10; i++) {
    tenBreeds[keys[i]] = breeds[keys[i]]
  }

  return tenBreeds
}

export function shuffle(array) {
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

export function handleQuestionBoxClick(checkboxValue, question) {
  let prevAnswers = answers
  prevAnswers[question.id][checkboxValue] = !prevAnswers[question.id][checkboxValue]
  setQuestionsAnswers({ answers: prevAnswers, questions: questions })
  handleGetBreedCount()
}

export const breedItems = getBreedItems(breeds)
export const questionItems = questions.map(question => {
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

export function resetSingleBreedInfo() {
  setSingleBreedInfo({ singleBreedInfo: null, showSingleBreedInfo: false })
}

export {handleChangeWeightMinimum}