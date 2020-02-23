import React from 'react'

const DogImage = ({altName}) => {
  return (
    <div>
      <img
        src={`./img/${altName}.jpg`}
        alt={altName}
      />
    </div>
  )
}

export default DogImage