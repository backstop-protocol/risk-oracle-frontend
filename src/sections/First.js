import { Box, Chip, Fab, Typography } from "@mui/material";

import NavigationIcon from '@mui/icons-material/Navigation';

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
  function goTo(e, id){
    let element = document.getElementById(id);
    element.scrollIntoView({behavior:'smooth'});
}
  return <Box sx={{height:'100vh'}}>
    <Box sx={styles.flex}>
      <Box sx={styles.flexItem}>
        <Typography variant="h1">
          Removing the Human Factor from DeFi Risk Management
          </Typography>
        <Typography marginTop="3vh" variant="h2" color="secondary">
          Risk Oracle is an automated, decentralized, transparent, and self-executing DeFi risk engine.
          </Typography>
        <Typography marginTop="3vh" variant="h3" color="text.secondary">
          The Risk Oracle provides on-chain risk parameter feeds that smart contracts can use to automate their economic risk management processes.
          </Typography>
          
        
        <Box className="button-container">
          <Chip sx={{height:"4vh", marginRight:"2vw"}} component="a" href="https://docs.bprotocol.org" clickable color="secondary" label={"Read Docs"} />
          <Chip sx={{height:"4vh"}} component="a" href="https://app.bprotocol.org" clickable color="secondary" variant="outlined" label={"Request an Asset"}/>
        </Box>
      </Box>
      <Box sx={styles.flexItem}>
          <img alt="pythia-code-example" src={darkMode ? 'images/pythia-code-dark.png' : 'images/pythia-code.png'} />
          </Box>

    </Box>
    <Fab sx={{position:"absolute", marginLeft:"auto", marginRight:"auto", left:"0", right:"0", bottom:"0", zIndex:"10", color:"secondary.main"}} variant="extended" onClick={(e)=>{goTo(e,'mainSection')}}>
        <NavigationIcon sx={{ mr: 1, transform:"rotate(180deg)", color:"secondary.main" }} />
        Try it!
      </Fab>
  </Box >
}

export default First