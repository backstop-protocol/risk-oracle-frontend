import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';

export default function NavigationButton() {
    function goTo(e, id){
        let element = document.getElementById(id);
        element.scrollIntoView();
    }
  return (
    <Box>
      <Fab sx={{position:"absolute", marginLeft:"auto", marginRight:"auto", left:"0", right:"0", zIndex:"10", color:"secondary.main"}} variant="extended" onClick={(e)=>{goTo(e,'smartLTV')}}>
        <NavigationIcon sx={{ mr: 1, transform:"rotate(180deg)", color:"secondary.main" }} />
        Try it!
      </Fab>
    </Box>
  );
}
