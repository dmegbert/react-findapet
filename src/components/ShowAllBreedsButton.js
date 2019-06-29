import React from 'react'

function ShowAllBreedsButton(props) {
  return (
    <div>
      <button onClick={props.onClick} className={props.className}>
        Show All Breeds
      </button>
    </div>
  )
}

export default ShowAllBreedsButton;