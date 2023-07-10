import { Box, Typography } from "@mui/material"

import NavigationButton from "../components/NavigationButton"

const styles = {
  flex: {
    display: "flex",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    width: 'auto',
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
  return <Box sx={{height:'100vh'}}>
    <section style={styles.flex}>
      <div style={styles.flexItem}>
        <Typography variant="h1">
          Removing the Human Factor from DeFi Risk Management
          </Typography>
        <Typography marginTop="3vh" variant="subtitle1" color="secondary">
          Risk Oracle is an automated, decentralized, transparent, and self-executing DeFi risk engine.
          </Typography>
        <Typography marginTop="3vh" variant="subtitle2">
          The Risk Oracle provides on-chain risk parameter feeds that smart contracts can use to automate their economic risk management processes.
          </Typography>
          
        
        <div className="button-container">
          <a href="https://docs.bprotocol.org" role="button" >Read Docs</a>
          <a href="https://app.bprotocol.org" role="button" className="outline">Request an Asset</a>
        </div>
      </div>
      <div style={styles.flexItem}>
        <div>
          <img alt="pythia-code-example" src={darkMode ? 'images/pythia-code-dark.png' : 'images/pythia-code.png'} />
          <div>
          </div>
        </div>
      </div>
      
    </section>
    <NavigationButton />
  </Box >
}

export default First