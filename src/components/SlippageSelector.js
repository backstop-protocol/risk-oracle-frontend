const options = [
  1, 5, 10, 15, 20
]

const defaultValue = 5

const SlippageSelector = props => {
  const currentValue = props.slippage;
  return (
    <div>
      <select id="slippage-selector" defaultValue={currentValue} onChange={(event) => props.handleChange(event.target.value)}>
        {options.map(option=> <option key={option} value={option}>{option}% slippage</option>)}
      </select>
    </div>
  )
}

export default SlippageSelector