import React from 'react'

function BreedItem(props) {
  return (
    <div>
      <button key={props.breedKey} id={props.breedKey} className="btn" onClick={props.onClick}>
        {props.value}
      </button>
    </div>
  )
}

export default BreedItem