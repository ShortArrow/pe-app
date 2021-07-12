import React from 'react';
// import clsx from 'clsx';
import { useState, useEffect } from 'react';
import './App.css';

// firebase functions
import firebase from 'firebase/app';
import { firebaseStore } from './firebase/index'
import 'firebase/firestore';
import 'firebase/auth';
import { StyledFirebaseAuth } from 'react-firebaseui';
import { AppBar, Button, CircularProgress, FormControlLabel, FormGroup, IconButton, Link, makeStyles, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography, withStyles } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import SecurityIcon from '@material-ui/icons/Security';
import clsx from 'clsx';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(0.5),
    },
    title: {
        // flexGrow: 1,
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
}));

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        //   fontSize: 14,
    },
}))(TableCell);
const StyledFormControlLabel = withStyles((theme) => ({
    root: {
        width: '100%',
    },
}))(FormControlLabel);

const Sampledata = React.memo(() => {
    const classes = useStyles();
    const [Days, setDays] = useState<firebase.firestore.DocumentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<number>(0);
    const [state, setState] = React.useState({
        checked_h09: true,
        checked_h12: true,
        checked_h15: true,
        checked_h18: true,
        checked_A: true,
        checked_B: true,
    });


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };
    const Cell = (data: string) => {
        return <StyledTableCell align="center" className={data === '×' ? 'gray' : 'lightgreen'}>{data}</StyledTableCell>
    }
    const DayCell = (dayId: number, time: string) => {
        const DayOfWeek = getDayOfWeekFromDateString(getDateStringFromId(dayId))
        return (
            <React.StrictMode>
                <StyledTableCell align="center" className={DayOfWeek}>
                    {getDateStringFromId(dayId)}<span className="pc_only">{" (" + DayOfWeek + ")"}</span>
                </StyledTableCell>
                <StyledTableCell align="center" >{time}</StyledTableCell>
            </React.StrictMode>
        )
    }
    const Areas = (check_A: boolean, check_B: boolean, hdata: { A1: string, A2: string, A3: string, B1: string, B2: string, B3: string }) => {
        return (<React.StrictMode>
            {check_A ? <React.StrictMode>
                {Cell(hdata.A1)}{Cell(hdata.A2)}{Cell(hdata.A3)}
            </React.StrictMode > : null}
            {check_B ? <React.StrictMode>
                {Cell(hdata.B1)}{Cell(hdata.B2)}{Cell(hdata.B3)}
            </React.StrictMode > : null}
        </React.StrictMode >)
    }

    useEffect(() => {
        const searchDays = async () => {
            // Firestoreのコレクションを指定してデータ取得
            const res = await firebaseStore.collection('days').orderBy('id').get();
            const infoDoc = await firebaseStore.collection('info').doc('lastupdate').get();
            setLastUpdate(infoDoc.get('date'));
            if (res.empty) return [];
            const dayList: firebase.firestore.DocumentData[] = [];
            // DocumentData型にはmapメソッドが定義されていないため、forEachのループでデータを加工
            res.forEach(doc => {
                dayList.push(doc.data());
            })
            setDays(dayList);
        }
        searchDays();

        setLoading(false);
    }, []);

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    {SwipeableTemporaryDrawer(state, setState, lastUpdate)}
                    <Typography variant="h6" className={classes.title}>
                        空き状況 東郷町総合体育館
                    </Typography>
                </Toolbar>
            </AppBar>
            <main>
                <FormGroup row className="controll_pannel">
                    <FormControlLabel control={<Switch checked={state.checked_h09} onChange={handleChange} name="checked_h09" />} label="9~12" />
                    <FormControlLabel control={<Switch checked={state.checked_h12} onChange={handleChange} name="checked_h12" />} label="12~15" />
                    <FormControlLabel control={<Switch checked={state.checked_h15} onChange={handleChange} name="checked_h15" />} label="15~18" />
                    <FormControlLabel control={<Switch checked={state.checked_h18} onChange={handleChange} name="checked_h18" />} label="18~21" />
                    <FormControlLabel control={<Switch checked={state.checked_A} onChange={handleChange} name="checked_A" color="primary" />} label="A" />
                    <FormControlLabel control={<Switch checked={state.checked_B} onChange={handleChange} name="checked_B" color="primary" />} label="B" />
                </FormGroup>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <TableContainer component={Paper}>
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">Date</StyledTableCell>
                                    <StyledTableCell align="center">Time</StyledTableCell>
                                    {state.checked_A ? <React.StrictMode>
                                        <StyledTableCell align="center">A1</StyledTableCell>
                                        <StyledTableCell align="center">A2</StyledTableCell>
                                        <StyledTableCell align="center">A3</StyledTableCell>
                                    </React.StrictMode> : null}
                                    {state.checked_B ? <React.StrictMode>
                                        <StyledTableCell align="center">B1</StyledTableCell>
                                        <StyledTableCell align="center">B2</StyledTableCell>
                                        <StyledTableCell align="center">B3</StyledTableCell>
                                    </React.StrictMode> : null}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Days.map((day, index) => {
                                    return <React.StrictMode key={index}>
                                        {state.checked_h09 ? <StyledTableRow>
                                            {DayCell(day.id, "09h")}
                                            {Areas(state.checked_A, state.checked_B, day.h09)}
                                        </StyledTableRow> : null}
                                        {state.checked_h12 ? <StyledTableRow>
                                            {DayCell(day.id, "12h")}
                                            {Areas(state.checked_A, state.checked_B, day.h12)}
                                        </StyledTableRow> : null}
                                        {state.checked_h15 ? <StyledTableRow>
                                            {DayCell(day.id, "15h")}
                                            {Areas(state.checked_A, state.checked_B, day.h15)}
                                        </StyledTableRow> : null}
                                        {state.checked_h18 ? <StyledTableRow>
                                            {DayCell(day.id, "18h")}
                                            {Areas(state.checked_A, state.checked_B, day.h18)}
                                        </StyledTableRow> : null}
                                    </React.StrictMode>
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </main>
        </div >
    );
});

export default Sampledata;

function getDateStringFromId(id: number) {
    return String(id).slice(0, 4) + "/" + String(id).slice(4, 6) + "/" + String(id).slice(6, 8);
}

function getDayOfWeekFromDateString(dateString: string) {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    const dayOfWeekStr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeek];
    return dayOfWeekStr;
}
function SwipeableTemporaryDrawer(switchState: {
    checked_h09: boolean;
    checked_h12: boolean;
    checked_h15: boolean;
    checked_h18: boolean;
    checked_A: boolean;
    checked_B: boolean;
}, setSwitchState: React.Dispatch<React.SetStateAction<{
    checked_h09: boolean;
    checked_h12: boolean;
    checked_h15: boolean;
    checked_h18: boolean;
    checked_A: boolean;
    checked_B: boolean;
}>>, lastupdate: number) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const [myAccount, setMyAccount] = useState<firebase.User>();
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSwitchState({ ...switchState, [event.target.name]: event.target.checked });
    };
    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) return;
            if (user.email !== process.env.REACT_APP_VALID_MAIL_ADDRESSES) return;
            setMyAccount(user);
            // searchDays();
        });
    }, []);
    const uiConfig = {
        signInFlow: 'popup',
        signInSuccessUrl: '/',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
    };

    const toggleDrawer = (anchor: Anchor, open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent,
    ) => {
        if (
            event &&
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor: Anchor) => {
        return (
            <div
                className={clsx(classes.list, {
                    [classes.fullList]: anchor === 'top' || anchor === 'bottom',
                })}
                role="presentation"
            >
                <List>
                    <ListItem>
                        <ListItemText primary={"Last Update"} />
                        <ListItemText primary={String(lastupdate).slice(0, 4) + "/" + String(lastupdate).slice(4, 6) + "/" + String(lastupdate).slice(6, 8)} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary={"Update Timing"} />
                        <ListItemText primary={'24:00~25:00'} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary={<p><span>このページは毎日自動更新されます。その時、</span><Link href="https://www.e-shisetsu.e-aichi.jp/sp/">ここ</Link>の情報を基にしています。</p>} />
                    </ListItem>
                    <Divider />

                    <ListItem button onClick={(event) => { window.open("https://qiita.com/shortarrow") }}>
                        <ListItemIcon><PersonIcon /></ListItemIcon>
                        <ListItemText primary={"Admin's Blog"} />
                    </ListItem>
                    <Divider />
                    <ListItem><ListItemText primary={"Control Panel"} /></ListItem>
                    <ListItem button onChange={handleChange}><StyledFormControlLabel control={<Switch checked={switchState.checked_h09} name="checked_h09" />} label="9~12" /></ListItem>
                    <ListItem button onChange={handleChange}><StyledFormControlLabel control={<Switch checked={switchState.checked_h12} name="checked_h12" />} label="12~15" /></ListItem>
                    <ListItem button onChange={handleChange}><StyledFormControlLabel control={<Switch checked={switchState.checked_h15} name="checked_h15" />} label="15~18" /></ListItem>
                    <ListItem button onChange={handleChange}><StyledFormControlLabel control={<Switch checked={switchState.checked_h18} name="checked_h18" />} label="18~21" /></ListItem>
                    <ListItem button onChange={handleChange}><StyledFormControlLabel control={<Switch checked={switchState.checked_A} name="checked_A" color="primary" />} label="A" /></ListItem>
                    <ListItem button onChange={handleChange}><StyledFormControlLabel control={<Switch checked={switchState.checked_B} name="checked_B" color="primary" />} label="B" /></ListItem>
                    <Divider />
                    <ListItem><ListItemText primary={"Admin Only"} /></ListItem>
                    <ListItem alignItems='center'>

                        {!myAccount ? (
                            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}>管理</StyledFirebaseAuth>
                        ) :
                            <div><SecurityIcon /><Button variant="contained">Manual Update</Button></div>}
                    </ListItem>
                </List>
            </div>
        );
    };

    return (
        <div>
            {(['left'] as Anchor[]).map((anchor) => (
                <React.Fragment key={anchor}>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
                        onClick={toggleDrawer(anchor, true)}><MenuIcon /></IconButton>
                    <SwipeableDrawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        onOpen={toggleDrawer(anchor, true)}
                    >
                        {list(anchor)}
                    </SwipeableDrawer>
                </React.Fragment>
            ))}
        </div>
    );
}