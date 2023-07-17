import NavigationIcon from '@mui/icons-material/Navigation';
import { CircularProgress, Fab, LinearProgress } from '@mui/material';
import { observer } from 'mobx-react';
import mainStore from '../stores/main.store';

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

const First = observer(props => {
  const loading = mainStore.loading;
  const {darkMode} = window
  function goTo(e, id){
    let element = document.getElementById(id);
    element.scrollIntoView({behavior:'smooth'});}
  return <div className="container-fluid" style={{marginTop: '102px'}}>
    <section  style={styles.flex}>
      <div style={styles.flexItem}>
        <div className='title'>Removing the Human Factor from DeFi Risk Management</div>
        <div className='subtitle'>Risk Oracle is an automated, decentralized, transparent, and self-executing DeFi risk engine.</div>
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
          <img alt="pythia-code-example" src={darkMode ? 'images/pythia-code-dark.png' : 'images/pythia-code.png'}/>
        </div>
      </div>
      {loading ? 
      <LinearProgress sx={{position:"absolute", marginLeft:"auto", minWidth:"100px", maxWidth:"100", marginRight:"auto", left:"0", right:"0", bottom:"0", zIndex:"10"}}></LinearProgress>
      : 
      <Fab size='medium' sx={{position:"absolute", marginLeft:"auto", minWidth:"200px", maxWidth:"250px", marginRight:"auto", left:"0", right:"0", bottom:"10px", zIndex:"10", color:"secondary.main"}} variant="extended" onClick={(e)=>{goTo(e,'mainSection')}}>
        <NavigationIcon sx={{ mr: 1, transform:"rotate(180deg)", color:"secondary.main" }} />
        Try it!
      </Fab>
      }
    </section>
  </div>
})

export default First