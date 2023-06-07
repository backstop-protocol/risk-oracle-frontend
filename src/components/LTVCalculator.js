import { observer } from "mobx-react";
import { useState } from "react";

const LTVCalculator = observer(props => {
    const quotes = props.quotes;
    const [selectedQuote, setSelectedQuote] = useState(quotes[0]);

    return (
        <article style={{ marginTop: 0, }} className="box">
          <table>
            <thead>
              <tr>
                <th scope="col">Borrowed Asset</th>
                <th scope="col">Time Frame</th>
                <th scope="col">a (Volatility %)</th>
                <th scope="col">l (liquidity)</th>
                <th scope="col">b (liquidation bonus)</th>
                <th scope="col">d (borrow caps)</th>
                <th scope="col">CLF</th>
                <th scope="col">Recommended LTV</th>
              </tr>
            </thead>
            <tbody>
                <td></td>
            </tbody>
          </table>
        </article>
      )
    
})

export default LTVCalculator