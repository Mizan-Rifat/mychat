import React,{useEffect} from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { useHistory } from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu';
import { Hidden } from '@material-ui/core';

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },



}));

const theme = createMuiTheme({
    overrides: {
        MuiMenu: {
            paper: {
                background: '#7F7FD5',
                color:'white'
            },
        },
    },
});

export default function MyAppBar(props) {

    const history = useHistory();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };


    const handleLogout = () => {
        handleMenuClose();
        axios.get('/airlock/csrf-cookie').then(response => {

            axios.post('/logout')
                .then(response => {

                    console.log(response)

                    if (response.status == 200) {

                        localStorage.removeItem('userID')
                        localStorage.removeItem('loggedIn')
                        history.push('/')

                    }
                })
                .catch(error => {
                    console.log(error)

                })
        });
    }

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <ThemeProvider theme={theme}>
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                id={menuId}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMenuOpen}
                onClose={handleMenuClose}
            >

                <MenuItem onClick={handleLogout}>Logout</MenuItem>

            </Menu>
        </ThemeProvider >
    );





    return (
        <div className={classes.grow}>
            <AppBar position="static" style={{ background: '#353D5A' }}>
                <Toolbar>
                    <Hidden smUp>

                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="open drawer"
                            onClick={()=>props.setOpen(true)}
                        >
                            <MenuIcon />
                        </IconButton>

                    </Hidden>

                    <Typography className={classes.title} variant="h6" noWrap>
                        MyChatApp
          </Typography>


                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>

                        {
                            localStorage.getItem('loggedIn') ?

                                <IconButton
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                                : ''
                        }
                    </div>

                </Toolbar>
            </AppBar>
            {renderMenu}
        </div>
    );
}
