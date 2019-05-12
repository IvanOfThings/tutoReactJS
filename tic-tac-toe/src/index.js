import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Board extends React.Component {

    renderSquare(i, remarked) {
        return <Square key={"line-" + i} remarked={remarked} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
    }

    render() {
        var lista = [];
        const winline = this.props.winline;
        console.log(winline);
        for (var i = 0; i < 3; i++) {
            var sublista = [];
            for (var j = 0; j < 3; j++) {
                let remarked = false;
                if (winline && winline.includes((i + (j * 3)))) {
                    remarked = true;
                }
                sublista.push(this.renderSquare(j * 3 + i, remarked));
            }
            lista.push(
                <div className="board-row" key={"row-" + i}>{sublista}</div>
            )
        }
        return (
            <div>{lista}</div>
        );
    }
}


function Square(props) {
    return (
        <button className={props.remarked ? "square remarcado" : "square"} onClick={props.onClick} >
            {props.value}
        </button >
    );
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                lastMove: null,
            }],
            stepNumber: 0,
            xIsNext: true,
        }
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner_ret = calculateWinner(current.squares);

        if (winner_ret) {
            var [winner, winline] = winner_ret;
        }

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + ` { ${step.lastMove[0]}, ${step.lastMove[1]} } ` :
                'Go to game start';
            return (
                <li key={move}>
                    <button className={this.state.stepNumber === move ? "bold" : "regular"} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        });

        let status;
        if (winner) {
            status = 'Winner ' + winner;
        } else {
            status = 'Next player: ' + (this.props.xIsNext ? 'X' : '0');
        }

        return (
            <div className="game" >
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winline={winline}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const lastMove = [((i - (i % 3)) / 3) + 1, (i % 3) + 1];

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : '0';
        this.setState({
            history: history.concat([{
                squares: squares,
                lastMove: lastMove,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            console.log(lines[i]);
            return [squares[a], lines[i].slice()];
        }
    }
    return null;
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);