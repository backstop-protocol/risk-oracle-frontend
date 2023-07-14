import NavigationIcon from '@mui/icons-material/Navigation';
import { Fab } from '@mui/material';

const styles = {
  flex: {
    display: "flex",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    width: 'auto',
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
  const {darkMode} = window
  function goTo(e, id){
    let element = document.getElementById(id);
    element.scrollIntoView({behavior:'smooth'});}
  return <div className="container-fluid" style={{marginTop: '102px'}}>
    <section  style={styles.flex}>
      <div style={styles.flexItem}>
        <div className='title'>Asset Tracker for On-Chain Liquidity and Volatility </div>
        <div className='subtitle'>The Risk Oracle provides an on-chain feed of liquidity and volatility for specific assets.</div>
        <p>
          Devs can add these feeds into their smart contracts to enable a new layer of transparency and security to their dapps.
        </p>
        <div className="button-container">
          <a href="https://docs.bprotocol.org" role="button" >Read Docs</a>
          <a href="https://app.bprotocol.org" role="button" className="outline">Request an Asset</a>
        </div>
      </div>
      <div style={styles.flexItem}>
        <div>
          <img alt="pythia-code-example" src={darkMode ? 'images/pythia-code-dark.png' : 'images/pythia-code.png'}/>
        </div>
      </div>
      <Fab size='medium' sx={{position:"absolute", marginLeft:"auto", width:"8%", marginRight:"auto", left:"0", right:"0", bottom:"0", zIndex:"10", color:"secondary.main"}} variant="extended" onClick={(e)=>{goTo(e,'mainSection')}}>
        <NavigationIcon sx={{ mr: 1, transform:"rotate(180deg)", color:"secondary.main" }} />
        Try it!
      </Fab>
    </section>
  </div>
}

export default First