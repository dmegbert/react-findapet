import React from 'react'

const DogImage = ({imageId, altName}) => {
  return (
    <div>
      <img
        src={`./img/dog-${imageId}.jpg`}
        alt={altName}
      />
    </div>
  )
}

export default DogImage