import { Box } from "@mui/material"
import Subtitle from "../components/Subtitle"
import Title from "../components/Title"

const styles = {
  flex: {
    display: "flex",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    width: '100%',
    marginTop: 'calc(var(--spacing) * 2)',
    minHeight: "calc(100vh - 204px)",
    alignItems: "center",
  },
  flexItem: {
    width: "45vw",
    minWidth: "min(600px, 100%)",
    maxWidth: "850px",
  }
}

const First = props => {
  const { darkMode } = window
  return <Box sx={{height:'92vh'}}>
    <section style={styles.flex}>
      <div style={styles.flexItem}>
        <Title>Removing the Human Factor from DeFi Risk Management</Title>
        <Subtitle>Risk Oracle is an automated, decentralized, transparent, and self-executing DeFi risk engine.</Subtitle>
        <p>
          The Risk Oracle provides on-chain risk parameter feeds that smart contracts can use to automate their economic risk management processes.
        </p>
        <div className="button-container">
          <a href="https://docs.bprotocol.org" role="button" >Read Docs</a>
          <a href="https://app.bprotocol.org" role="button" className="outline">Request an Asset</a>
        </div>
      </div>
      <div style={styles.flexItem}>
        <div>
          <img alt="pythia-code-example" src={darkMode ? 'images/pythia-code-dark.png' : 'images/pythia-code.png'} />
          <div>
            <small>
              Here’s an example of how to read the feed for
              ETH DEX liquidity of the last 30 days
            </small>
          </div>
        </div>
      </div>
    </section>
  </Box >
}

export default First