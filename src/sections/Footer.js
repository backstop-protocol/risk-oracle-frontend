
const Footer = props => {
  return <div >
    <footer className="footer">
      <div className="footer-main">
        <img className="footer-logo" src="logo.svg"/>
        <div className="footer-link-row">
          <a className="footer-link"  href="https://docs.bprotocol.org">Docs</a>
          <a className="footer-link" href="https://dashboard.bprotocol.org">Dashboard</a>
          <a className="footer-link" href="https://forum.bprotocol.org/">Forum</a>
          <a className="footer-link" href="https://app.bprotocol.org">App</a>
        </div>
        <div className="footer-social-row">
          <a className="footer-social-link" href="https://github.com/backstop-protocol"><img src="images/social/Group 6.svg"/></a>
          <a className="footer-social-link" href="https://discord.com/invite/bJ4guuw"><img src="images/social/Group 7.svg"/></a>
          <a className="footer-social-link" href="https://twitter.com/bprotocoleth"><img src="images/social/Group 8.svg"/></a>
          <a className="footer-social-link" href="https://medium.com/b-protocol"><img src="images/social/Group 24.svg"/></a>
        </div>
      </div>
    </footer>
  </div>
}

export default Footer