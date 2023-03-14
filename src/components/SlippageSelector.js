const options = [
  1, 5, 10, 15, 20
]

const defaultValue = 5

const SlippageSelector = props => {
  return (
    <div>
      <select id="slippage-selector" defaultValue={defaultValue}>
        {options.map(option=> <option key={option} value={option}>{option}% slippage</option>)}
      </select>
    </div>
  )
}

export default SlippageSelector