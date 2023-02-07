import mainStore from "../stores/main.store"
import { observer } from "mobx-react"

const LiquidityOrVolatility = observer(props => {
  return (
    <div>
      <fieldset>
        <label htmlFor="small">
          <input type="radio" id="small" name="size" value="small" checked/>
          Liquidity
        </label>
        <label htmlFor="medium">
          <input type="radio" id="medium" name="size" value="medium"/>
          Volatility
        </label>
      </fieldset>
    </div>
  )
})

export default LiquidityOrVolatility
