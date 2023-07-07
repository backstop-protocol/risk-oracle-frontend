import { Box, Typography } from "@mui/material"

const Footer = props => {
  return <Box sx={{display: 'flex', flexDirection: 'column', alignItems:"center", justifyContent:"center", width: '100%' }}>
    <Box sx={{display: 'flex', flexDirection: 'row'}}>
      <img className="footer-logo" alt="" src="logo.svg" />
    </Box>
    <Box sx={{display: 'flex', flexDirection: 'row'}}>
      <a className="footer-link" href="https://docs.bprotocol.org"><Typography>Docs</Typography></a>
      <a className="footer-link" href="https://dashboard.bprotocol.org"><Typography>Dashboard</Typography></a>
      <a className="footer-link" href="https://forum.bprotocol.org/"><Typography>Forum</Typography></a>
      <a className="footer-link" href="https://app.bprotocol.org"><Typography>App</Typography></a>
    </Box>
    <Box sx={{display: 'flex', flexDirection: 'row'}}>
      <a className="footer-social-link" href="https://github.com/backstop-protocol"><img alt="" src="images/social/Group 6.svg" /></a>
      <a className="footer-social-link" href="https://discord.com/invite/bJ4guuw"><img alt="" src="images/social/Group 7.svg" /></a>
      <a className="footer-social-link" href="https://twitter.com/bprotocoleth"><img alt="" src="images/social/Group 8.svg" /></a>
      <a className="footer-social-link" href="https://medium.com/b-protocol"><img alt="" src="images/social/Group 24.svg" /></a>
    </Box>
  </Box>
}

export default Footer