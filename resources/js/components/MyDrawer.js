import React,{useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { drawerContext } from './App';

const useStyles = makeStyles((theme)=>({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
      },
}));

export default function MyDrawer({component}) {
    const classes = useStyles();
    const {open,setOpen} = useContext(drawerContext);

    return (
        <div>
            <Drawer
                variant="temporary"
                anchor='left'
                open={open}

            >
                <div style={{ width: '240px',background: 'linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5)' }}>
                  
                        {component}
                </div>
            </Drawer>
        </div>
    );
}
