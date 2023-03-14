import mainStore from "../stores/main.store"
import { observer } from "mobx-react"


const VolatilityTable = observer(props => {
  return (
    <article style={{ marginTop: 0}} className="box">
      <table>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Heading</th>
            <th scope="col">Heading</th>
            <th scope="col">Heading</th>
            <th scope="col">Heading</th>
            <th scope="col">Heading</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Cell</td>
            <td>Cell</td>
            <td>Cell</td>
            <td>Cell</td>
            <td>Cell</td>
          </tr>
          <tr>
            <th scope="row">1</th>
            <td>Cell</td>
            <td>Cell</td>
            <td>Cell</td>
            <td>Cell</td>
            <td>Cell</td>
          </tr>
          <tr>
            <th scope="row">1</th>
            <td>Cell</td>
            <td>Cell</td>
            <td>Cell</td>
            <td>Cell</td>
            <td>Cell</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th scope="col">#</th>
            <td scope="col">Total</td>
            <td scope="col">Total</td>
            <td scope="col">Total</td>
            <td scope="col">Total</td>
            <td scope="col">Total</td>
          </tr>
        </tfoot>
      </table>
    </article>
  )
})

export default VolatilityTable