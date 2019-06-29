import React from 'react'

function BackToResultsButton(props) {
  return (
    <button onClick={props.onClick} className="btn">
      Go Back To Results
    </button>
  )
}

export default BackToResultsButton