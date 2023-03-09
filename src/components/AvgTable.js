import { observer } from "mobx-react"

const AvgTable = observer(props => {
  return (
    <article style={{marginTop: 0}} className="box">
      <table>
        <thead>
          <tr>
            <th scope="col">1</th>
            <th scope="col">2</th>
            <th scope="col">3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
          </tr>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
          </tr>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
          </tr>
        </tbody>
      </table>
    </article>
  )
})

export default AvgTable