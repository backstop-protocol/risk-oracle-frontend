import Title from "../components/Title"
import Subtitle from "../components/Subtitle"

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
  const {darkMode} = window
  return <div className="container-fluid" style={{marginTop: '102px'}}>
    <section  style={styles.flex}>
      <div style={styles.flexItem}>
        <Title>Asset Tracker for On-Chain Liquidity and Volatility </Title>
        <Subtitle>The Risk Oracle provides an on-chain feed of liquidity and volatility for specific assets.</Subtitle>
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
          <div> 
            <small>
              Here’s an example of how to read the feed for 
              ETH DEX liquidity of the last 30 days 
            </small>
          </div>
        </div>
      </div>
    </section>
  </div>
}

export default First