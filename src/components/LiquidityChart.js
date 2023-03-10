import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { observer } from "mobx-react"
import TimeFrameButtons from './TimeFrameButtons'

const LiquidityChart = observer(props => {
  const {dataStore} = props
  const {liquidityChartData, loadingLiquidityChartData} = dataStore
  return (
    <article className='box' style={{width: '100%', height: '30vh', minHeight: '440px', marginTop: "0px",}}>
      <TimeFrameButtons/>
      {!loadingLiquidityChartData && <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={liquidityChartData}
          margin={{
            top: 5,
            right: 0,
            left: 60,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="USDC" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="BTC" stroke="#82ca9d" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="ETH" stroke="#82ca9d" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>}
      {loadingLiquidityChartData && <div style={{marginTop: '100px'}} aria-busy="true"></div>}
    </article>
  )
})

export default LiquidityChart