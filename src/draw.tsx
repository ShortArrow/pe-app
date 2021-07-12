import React from 'react'
import architecture_draw from './svg/architecture_draw.svg'
import { Button, Card, Container } from '@material-ui/core';
import styles from './draw.module.sass'

class DrawApp extends React.Component {
    render() {
        return (
            <Container maxWidth="sm">
                <Card variant="outlined" elevation={3} className={styles.card}>
                    <img src={architecture_draw} alt="" />
                </Card>
                <Button onClick={(event) => { window.location.href = '/' }} color="primary" variant="contained">戻る</Button>
            </Container>
        );
    }
}

export default DrawApp;