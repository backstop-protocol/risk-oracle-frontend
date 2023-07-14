import { Box, Link, Stack, Typography } from "@mui/material";
import mainStore from "../stores/main.store";

const Footer = props => {
  return <Box sx={{height:"15vh",display: 'flex', flexDirection: 'column', alignItems:"center", justifyContent:"center", width: '100%' }}>
    <Box sx={{display: 'flex', flexDirection: 'row', marginBottom:"1vh"}}>
      <img className="footer-logo" alt="" src="logo.svg" />
    </Box>
    <Stack  gap={4} direction="horizontal">
      <Link href="https://docs.bprotocol.org"><Typography>Docs</Typography></Link>
      <Link href="https://dashboard.bprotocol.org"><Typography>Dashboard</Typography></Link>
      <Link href="https://forum.bprotocol.org/"><Typography>Forum</Typography></Link>
      <Link href="https://app.bprotocol.org"><Typography>App</Typography></Link>
      </Stack>
    <Stack sx={{padding:"1vh 0 1vh 0"}} gap={4} direction="horizontal">
      <Link className="footer-social-link" href="https://github.com/backstop-protocol"><img alt="Github Logo" src={mainStore.darkTheme ? "images/social/github-mark-white.svg" : "images/social/github-mark.svg"} /></Link>
      <Link className="footer-social-link" href="https://discord.com/invite/bJ4guuw"><img alt="Discord Logo" src={mainStore.darkTheme ? "images/social/discord-mark-white.svg" : "images/social/discord-mark-black.svg"} /></Link>
      <Link className="footer-social-link" href="https://twitter.com/bprotocoleth"><img alt="Twitter Logo" src={mainStore.darkTheme ? "images/social/twitter-white.svg" : "images/social/twitter-blue.svg"} /></Link>
      <Link className="footer-social-link" href="https://medium.com/b-protocol"><img  alt="Medium Logo" src={mainStore.darkTheme ? "images/social/medium-white.png" : "images/social/medium-black.png"} /></Link>
      </Stack>
  </Box>
}

export default Footer