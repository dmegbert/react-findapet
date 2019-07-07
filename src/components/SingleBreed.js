import React, {useState, useEffect} from 'react'
import { BackToResultsButton, Stars } from './index'
import axios from 'axios'

const SingleBreed = ({ singleBreedId }) => {
  const [showFullHistory, setShowFullHistory] = useState(false)
  const [showFullPersonality, setShowFullPersonality] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [singleBreedInfo, setSingleBreedInfo] = useState(null)

  useEffect(() => {
    fetchBreedInfo()
  }, [singleBreedId])

  function fetchBreedInfo() {
    let breedInfo

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/dog/${singleBreedId}`)
      .then(res => {
        breedInfo = res.data
        breedInfo['id'] = singleBreedId
        setSingleBreedInfo(breedInfo)
      })
      .catch(error => {
        console.log(error)
      })
  }

  function resetSingleBreedInfo() {
    setSingleBreedInfo({ singleBreedInfo: null, showSingleBreedInfo: false })
  }


  if (singleBreedInfo) {
  return (
    <div>
      <div>
        <img
          src={`./img/dog-${singleBreedInfo['id']}.jpg`}
          alt={`${singleBreedInfo['name']}`}
        />
        <h2>{singleBreedInfo['name']}</h2>
      </div>
      <div>
        <BackToResultsButton onClick={() => resetSingleBreedInfo()} />
      </div>
      <div>
        <p>
          <strong>Energy Level: </strong>
          <Stars solidStars={singleBreedInfo['energy_level']} />
        </p>
        <p>
          <strong>Playfulness: </strong>
          <Stars solidStars={singleBreedInfo['playfulness']} />
        </p>
        <p>
          <strong>Friendliness to Dogs: </strong>
          <Stars solidStars={singleBreedInfo['friendliness_to_dogs']} />
        </p>
        <p>
          <strong>Friendliness to Other Pets: </strong>
          <Stars solidStars={singleBreedInfo['friendliness_to_other_pets']} />
        </p>
        <p>
          <strong>Friendliness to New People: </strong>
          <Stars solidStars={singleBreedInfo['friendliness_to_strangers']} />
        </p>
        <p>
          <strong>Ease of Training: </strong>
          <Stars solidStars={singleBreedInfo['ease_of_training']} />
        </p>
        <p>
          <strong>Grooming Needs: </strong>
          <Stars solidStars={singleBreedInfo['grooming_requirements']} />
        </p>
        <p>
          <strong>Exercise Needs: </strong>
          <Stars solidStars={singleBreedInfo['exercise_requirements']} />
        </p>
        <p>
          <strong>Affection Level: </strong>
          <Stars solidStars={singleBreedInfo['affection_level']} />
        </p>
        <p>
          <strong>Watchfulness: </strong>
          <Stars solidStars={singleBreedInfo['watchfulness']} />
        </p>
        <p>
          <strong>Heat Sensitivity: </strong>
          <Stars solidStars={singleBreedInfo['heat_sensitivity']} />
        </p>
        <p>
          <strong>Vocality: </strong>
          <Stars solidStars={singleBreedInfo['vocality']} />
        </p>
        <p>
          <strong>Weight: </strong>
          {`${singleBreedInfo['weight_min']}lbs - ${singleBreedInfo['weight_max']}lbs`}
        </p>
        <p>
          <strong>Height: </strong>
          {`${singleBreedInfo['height_min']}" - ${singleBreedInfo['height_max']}"`}
        </p>
      </div>
      <div>
        <p>
          <strong>Description:</strong>
          {showFullDescription
            ? singleBreedInfo['description']
            : `${singleBreedInfo['description'].substring(0, 300)}...`}
          <button
            className="read-more-btn"
            onClick={() => setShowFullDescription(!showFullDescription)}
          >
            {showFullDescription ? 'Read Less' : 'Read More'}
          </button>
        </p>
        <p>
          <strong>Personality:</strong>
          {showFullPersonality || singleBreedInfo['personality'].length <= 300
            ? singleBreedInfo['personality']
            : `${singleBreedInfo['personality'].substring(0, 300)}...`}
          {!(singleBreedInfo['personality'].length <= 300) && (
            <button
              className="read-more-btn"
              onClick={() => setShowFullPersonality(!showFullPersonality)}
            >
              {showFullPersonality ? 'Read Less' : 'Read More'}
            </button>
          )}
        </p>
        <p>
          <strong>History:</strong>
          {showFullHistory
            ? singleBreedInfo['history']
            : `${singleBreedInfo['history'].substring(0, 300)}...`}
          <button
            className="read-more-btn"
            onClick={() => setShowFullHistory(!showFullHistory)}
          >
            {showFullHistory ? 'Read Less' : 'Read More'}
          </button>
        </p>
      </div>
      <div>
        <BackToResultsButton onClick={() => resetSingleBreedInfo()} />
      </div>
    </div>
  )}
  else {
    return (
    <div>Loading</div>
    )
  }
}

export default SingleBreed