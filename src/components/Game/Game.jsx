import React, { Component } from "react";
import Board from "../Board/Board";
import calculateWinner from "../helpers/CalculateWinner";
import "./game.css";
import position from "../helpers/Position";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          position: {
            row: 0,
            column: 0,
          },
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares, position: position(i) }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  handleReset() {
    this.setState({
      history: [
        {
          squares: Array(9).fill(null),
          position: {
            row: 0,
            column: 0,
          },
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? `Go to move #${move}.` : "Go to Game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          {move ? (
            <>
              <b> {move % 2 === 0 ? "O" : "X"}</b> in [
              {history[move].position.row}, {history[move].position.column}]
            </>
          ) : (
            ""
          )}
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            handleReset={() => this.handleReset()}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

export { Game };
