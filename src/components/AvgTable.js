import { observer } from "mobx-react"

const AvgTable = observer(props => {
  return (
    <article style={{marginTop: 0, }} className="box">
      <table>
        <thead>
          <tr>
            <th scope="col">AVG</th>
            <th scope="col">Liquidity</th>
            <th scope="col">Volatility</th>
          </tr>
        </thead>
        <tbody>
          <tr>
              <td>ETH</td>
              <td>1</td>
              <td>1</td>
          </tr>
          <tr>
            <td>BTC</td>
            <td>2</td>
            <td>2</td>
          </tr>
          <tr>
            <td>USDC</td>
            <td>2</td>
            <td>2</td>
          </tr>
        </tbody>
      </table>
    </article>
  )
})

export default AvgTable