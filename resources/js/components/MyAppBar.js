import React, { useState,useEffect, useContext } from 'react';
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
import axios from 'axios'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { drawerContext } from './App';
import { MyContext } from './ChatUI';
import { useQueryState } from 'react-router-use-location-state';

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        position:'relative'
    },
    title: {
        display: 'none',
        '&:hover':{
            cursor:'pointer'
        },
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },

    },
    redDot:{
        height:'10px',
        width:'10px',
        borderRadius:'50%',
        position:'absolute',
        background:'red',
        top: '13px',
        right: '10px'

    }



}));

const theme = createMuiTheme({
    overrides: {
        MuiMenu: {
            paper: {
                background: '#7F7FD5',
                color: 'white'
            },
        },
    },
});

export default function MyAppBar(props) {

    const history = useHistory();

    const { user, setUser } = useContext(drawerContext);
    const { setRid, contactState } = useContext(MyContext);

    const [query, setQuery] = useQueryState('rid', '')
    const [unreadMsg,setUnreadMsg] = useState(false)

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
        axios.get(`/airlock/csrf-cookie`).then(response => {

            axios.post(`/logout`)
                .then(response => {
                    
                    if (response.status == 200) {
                        setUser({
                            ...user,
                            user: {}
                        })
                        history.push('/')

                    }
                })
                .catch(error => {
                    console.log(error)

                })
        });
    }


    const handleLogoClick = () => {
        setQuery('')
        setRid('')
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


    useEffect(()=>{
        setUnreadMsg(contactState.contacts.some(item => item.unReadMessages > 0))
    },[contactState.contacts])





    return (
        <>
            {
                history.location.pathname == '/login' || history.location.pathname == '/register' || history.location.pathname == '/' ?
                    // false ?
                    ''
                    :


                    <div className={classes.grow}>
                        <AppBar position="static" style={{ background: '#353D5A' }}>
                            <Toolbar>
                                <Hidden smUp>

                                    <IconButton
                                        edge="start"
                                        className={classes.menuButton}
                                        color="inherit"
                                        aria-label="open drawer"
                                        onClick={() => props.setOpen(true)}
                                    >
                                        <MenuIcon />
                                        {
                                            unreadMsg &&
                                            <div className={classes.redDot} />
                                        }
                                    </IconButton>

                                </Hidden>

                                <Typography className={classes.title} variant="h6" noWrap onClick={handleLogoClick}>
                                    MyChat
                                </Typography>


                                <div className={classes.grow} />
                                <div className={classes.sectionDesktop}>



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

                                </div>

                            </Toolbar>
                        </AppBar>
                        {renderMenu}
                    </div>

            }

        </>
    );
}
