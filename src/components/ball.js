import React, { Component } from 'react';
import styles from '../styles/styles'


export default class extends Component {
   
    render() {
        return (
            <div style={{background: this.props.color, ...this.props.isBallSelected ? styles.ballStyles.selectedBall : styles.ballStyles.ball }}></div>
        )
    }
}