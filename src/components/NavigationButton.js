import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';

export default function NavigationButton() {
    function goTo(e, id){
        console.log('firing')
        let element = document.getElementById(id);
        element.scrollIntoView();
    }
  return (
    <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <Fab variant="extended" onClick={(e)=>{goTo(e,'smartLTV')}}>
        <NavigationIcon sx={{ mr: 1, transform:"rotate(180deg)" }} />
        Try it!
      </Fab>
    </Box>
  );
}