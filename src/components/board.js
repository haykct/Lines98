import React, { Component } from 'react';
import Ball from './ball';

export default class extends Component {
	constructor(props) {
		super(props);

		this.handleColumnClick = this.handleColumnClick.bind(this);
		this.colorArr = ['darkcyan', 'lightsalmon', 'crimson', 'seagreen', 'maroon', 'darkorange', 'steelblue'];
		
		var ballMatrixArr = this.initializeBallMatrixArr(props);
		
		for (let i = 0; i < 5; i++) {
			this.addBallAtRandomIndex(ballMatrixArr);
		}

		this.state = { 
			ballMatrixArr: ballMatrixArr
		}
	}

	initializeBallMatrixArr({boardSize}) {
		var ballMatrixArr = [];
		this.selectedBall = null;
		this.emptyCellIndexArr = [];

		for (let i = 0; i < boardSize; i++) {
			ballMatrixArr.push((new Array(boardSize)).fill(null));

			for (let j = 0; j < boardSize; j++) {
				this.emptyCellIndexArr.push(`${i}${j}`);
			}
		}

		return ballMatrixArr;
	}

	addBallAtRandomIndex(ballMatrixArr) {
		let randomColorIndex = Math.round(Math.random() * (this.colorArr.length - 1));
		let randomArrIndex = Math.round(Math.random() * (this.emptyCellIndexArr.length - 1));
		let randomBallMatrixArrIndex = this.emptyCellIndexArr[randomArrIndex];
		let randomRow = +randomBallMatrixArrIndex[0];
		let randomColumn = +randomBallMatrixArrIndex[1];

		ballMatrixArr[randomRow][randomColumn] = { row: randomRow, column: randomColumn, color: this.colorArr[randomColorIndex], isSelected: false };
		this.emptyCellIndexArr = this.emptyCellIndexArr.filter((item) => item !== randomBallMatrixArrIndex);
	}

	handleColumnClick(e) {
		const row = +e.currentTarget.getAttribute('row');
		const column = +e.currentTarget.getAttribute('column');

		var ballMatrixArr = this.state.ballMatrixArr.map(function (arr) {
			let newArr = [];

			arr.forEach((item) => {
				if(item instanceof Object) {
					newArr.push({...item});
				} else {
					newArr.push(item);
				}
			});

			return newArr;
		});

		if (e.currentTarget.hasChildNodes()) {
			if (e.target instanceof HTMLDivElement) {
				if (this.selectedBall != null) { ballMatrixArr[this.selectedBall.row][this.selectedBall.column].isSelected = false; }
				ballMatrixArr[row][column].isSelected = true;
				this.selectedBall = ballMatrixArr[row][column];

				this.setState({ ballMatrixArr: ballMatrixArr });
			}
		} else {
			if (this.selectedBall) {
				if (this.willPassTheWay(ballMatrixArr, row, column)) {
					this.emptyCellIndexArr.splice(this.emptyCellIndexArr.indexOf(`${row}${column}`), 1, `${this.selectedBall.row}${this.selectedBall.column}`);
					ballMatrixArr[this.selectedBall.row][this.selectedBall.column] = null;
					this.selectedBall.row = row;
					this.selectedBall.column = column;
					this.selectedBall.isSelected = false;
					ballMatrixArr[row][column] = this.selectedBall;
					this.selectedBall = null;

					for (let i = 0; i < 3; i++) {
						if (this.emptyCellIndexArr.length > 0) {
							this.addBallAtRandomIndex(ballMatrixArr);
						} else {
							ballMatrixArr = this.initializeBallMatrixArr(this.props);

							for (let i = 0; i < 5; i++) {
								this.addBallAtRandomIndex(ballMatrixArr);
							}

							break;
						}
					}
				}

				this.setState({ ballMatrixArr: ballMatrixArr });
			}
		}
	}

	willPassTheWay(ballMatrixArr, row, column) {
		var indexesArr = [];
		var numerationArr = ballMatrixArr.map(function (arr) {
			let newArr = [];

			arr.forEach((item) => {
				if(item instanceof Object) {
					newArr.push({...item});
				} else {
					newArr.push(item);
				}
			});

			return newArr;
		});

		while (true) {
			if (indexesArr.length === 0) {
				let numeratedIndexesArr = [];

				if ((this.selectedBall.row - 1 >= 0) && (numerationArr[this.selectedBall.row - 1][this.selectedBall.column] == null)) {
					if (this.selectedBall.row - 1 === row && this.selectedBall.column === column) {
						return true
					}
	
					numerationArr[this.selectedBall.row - 1][this.selectedBall.column] = 1;
					numeratedIndexesArr.push({ row: this.selectedBall.row - 1, column: this.selectedBall.column });
				}
	
				if ((this.selectedBall.column + 1 < this.props.boardSize) && (numerationArr[this.selectedBall.row][this.selectedBall.column + 1] == null)) {
					if (this.selectedBall.row === row && this.selectedBall.column + 1 === column) {
						return true
					}
	
					numerationArr[this.selectedBall.row][this.selectedBall.column + 1] = 1;
					numeratedIndexesArr.push({ row: this.selectedBall.row, column: this.selectedBall.column + 1 });
				}
	
				if ((this.selectedBall.row + 1 < this.props.boardSize) && (numerationArr[this.selectedBall.row + 1][this.selectedBall.column] == null)) {
					if (this.selectedBall.row + 1 === row && this.selectedBall.column === column) {
						return true
					}
	
					numerationArr[this.selectedBall.row + 1][this.selectedBall.column] = 1;
					numeratedIndexesArr.push({ row: this.selectedBall.row + 1, column: this.selectedBall.column });
				}
	
				if ((this.selectedBall.column - 1 >= 0) && (numerationArr[this.selectedBall.row][this.selectedBall.column - 1] == null)) {
					if (this.selectedBall.row === row && this.selectedBall.column - 1 === column) {
						return true
					}
	
					numerationArr[this.selectedBall.row][this.selectedBall.column - 1] = 1;
					numeratedIndexesArr.push({ row: this.selectedBall.row, column: this.selectedBall.column - 1 });
				}
	
				if (numeratedIndexesArr.length === 0) {
					return false
				}
				
				indexesArr = numeratedIndexesArr;
			} else {
				let numeratedIndexesArr = [];
	
				for (let i = 0; i < indexesArr.length; i++) {
					let item = indexesArr[i];
	
					if ((item.row - 1 >= 0) && (numerationArr[item.row - 1][item.column] == null)) {
						if (item.row - 1 === row && item.column === column) {
							return true
						}
	
						numerationArr[item.row - 1][item.column] = numerationArr[item.row][item.column] + 1;
						numeratedIndexesArr.push({ row: item.row - 1, column: item.column });
					}
	
					if ((item.column + 1 < this.props.boardSize) && (numerationArr[item.row][item.column + 1] == null)) {
						if (item.row === row && item.column + 1 === column) {
							return true
						}
	
						numerationArr[item.row][item.column + 1] = numerationArr[item.row][item.column] + 1;
						numeratedIndexesArr.push({ row: item.row, column: item.column + 1 });
					}
	
					if ((item.row + 1 < this.props.boardSize) && (numerationArr[item.row + 1][item.column] == null)) {
						if (item.row + 1 === row && item.column === column) {
							return true
						}
	
						numerationArr[item.row + 1][item.column] = numerationArr[item.row][item.column] + 1;
						numeratedIndexesArr.push({ row: item.row + 1, column: item.column });
					}
	
					if ((item.column - 1 >= 0) && (numerationArr[item.row][item.column - 1] == null)) {
						if (item.row === row && item.column - 1 === column) {
							return true
						}
	
						numerationArr[item.row][item.column - 1] = numerationArr[item.row][item.column] + 1;
						numeratedIndexesArr.push({ row: item.row, column: item.column - 1 });
					}

				}

				indexesArr = numeratedIndexesArr;
			}
		}
	}

	render() {
		var trElems = [];
		
		for (let i = 0; i < this.state.ballMatrixArr.length; i++) {
			let tdElems = [];

			for (let j = 0; j < this.state.ballMatrixArr[i].length; j++) {
				tdElems.push(this.state.ballMatrixArr[i][j] != null ? 
				<td key={i + j} row={i} column={j} onClick={this.handleColumnClick}><Ball isBallSelected={this.state.ballMatrixArr[i][j].isSelected} color={this.state.ballMatrixArr[i][j].color}/></td> : 
				<td key={i + j} row={i} column={j} onClick={this.handleColumnClick}></td>);
			}

			trElems.push(<tr key={i}>{tdElems}</tr>);
		}
		return (
			<table>
				<tbody>
					{trElems}
				</tbody>
			</table>
		);
	}
}