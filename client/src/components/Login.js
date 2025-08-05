import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container, AppBar, Toolbar, IconButton } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// Images
import logo from '../public/LOGO (2).png';
import accueilImg from '../public/accueil.png';

const Login = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleConnexionClick = () => {
    navigate('/');
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  const handleAideClick = () => {
    navigate('/aide');
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: '#80b9e5',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ background: '#ffffff', boxShadow: 'none', height: 80 }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, md: 6 }, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleLogoClick} sx={{ p: 0 }}>
              {/* Agrandir le logo sans affecter la hauteur du navbar */}
              <Box component="img" src={logo} alt="Logo" sx={{ height: 60, width: 'auto' }} />
            </IconButton>
          </Box>
          {/* Desktop buttons */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            <IconButton onClick={handleContactClick} sx={{ color: '#3b4a6b' }}>
              <MailOutlineIcon />
              <Typography sx={{ ml: 1, fontSize: 16, fontWeight: 500 }}>Contact</Typography>
            </IconButton>
            <IconButton onClick={handleAideClick} sx={{ color: '#3b4a6b' }}>
              <HelpOutlineIcon />
              <Typography sx={{ ml: 1, fontSize: 16, fontWeight: 500 }}>Aide</Typography>
            </IconButton>
            <IconButton onClick={handleConnexionClick} sx={{ color: '#3b4a6b' }}>
              <AccountCircleIcon />
              <Typography sx={{ ml: 1, fontSize: 16, fontWeight: 500 }}>Connexion</Typography>
            </IconButton>
          </Box>
          {/* Mobile menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton onClick={handleMenuOpen} sx={{ color: '#3b4a6b' }}>
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
              <MenuItem onClick={() => { handleContactClick(); handleMenuClose(); }}>
                <MailOutlineIcon sx={{ mr: 1 }} /> Contact
              </MenuItem>
              <MenuItem onClick={() => { handleAideClick(); handleMenuClose(); }}>
                <HelpOutlineIcon sx={{ mr: 1 }} /> Aide
              </MenuItem>
              <MenuItem onClick={() => { handleConnexionClick(); handleMenuClose(); }}>
                <AccountCircleIcon sx={{ mr: 1 }} /> Connexion
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', width: '100%', justifyContent: 'center', mt: { xs: 4, md: 0 } }}>
          {/* Left: Buttons */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, justifyContent: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<GroupIcon />}
              onClick={() => navigate('/login/eleve')}
              sx={{
                bgcolor: '#fff',
                color: '#222',
                border: '2px solid #222',
                borderRadius: 8,
                fontWeight: 'bold',
                fontSize: 18,
                px: 4,
                py: 1.2,
                boxShadow: 2,
                '&:hover': {
                  bgcolor: '#f5f5f5',
                  borderColor: '#3b4a6b',
                },
              }}
            >
              Élèves
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<PersonIcon />}
              onClick={() => navigate('/login/enseignant')}
              sx={{
                bgcolor: '#232c3d',
                color: '#fff',
                borderRadius: 8,
                fontWeight: 'bold',
                fontSize: 18,
                px: 4,
                py: 1.2,
                boxShadow: 2,
                '&:hover': {
                  bgcolor: '#3b4a6b',
                },
              }}
            >
              Enseignant
            </Button>
          </Box>
          {/* Right: Illustration */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', mt: { xs: 4, md: 0 } }}>
            <Box component="img" src={accueilImg} alt="Illustration accueil" sx={{ maxWidth: 520, width: '100%' }} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
