import React from 'react'

const WeightMinAndMax = ({ label, weight, name, onChange }) => {

  return (
    <div>
      <label>{label} </label>
      <input
        value={weight}
        type="number"
        pattern="[0-9]*"
        name={name}
        onChange={onChange}
      />
    </div>
  )
}

export default WeightMinAndMax
