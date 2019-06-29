import React from 'react'

function Stars(props) {
  let items = []
  let solidStars = props.solidStars

  for (let i = 1; i < 6; i++) {
    if (i <= solidStars) {
      items.push(<i key={i} className="fas fa-star" aria-hidden="true"/>)
    } else {
      items.push(<i key={i} className="far fa-star" aria-hidden="true"/>)
    }
  }
  return items
}

export default Stars