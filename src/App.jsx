import { useState } from "react";
import confetti from "canvas-confetti";

// Definimos los turnos posibles: X y O
const Turns = {
  X: 'x',
  O: 'o'
}
// Componente que representa cada celda del tablero
const Square = ({ children, isSelected, updateBoard, index }) => {
  const className = `square ${isSelected ? 'is-selected' : ''}`;

  const handleClick = () => {
    updateBoard(index);
  }

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  )
}
// Combinaciones ganadoras posibles en el tablero de tres en raya
const WINNER_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

function App() {
  // Estado para el tablero, el turno actual y el ganador
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(Turns.X);
  const [winner, setWinner] = useState(null); // null no hay ganador, false = empate

  // Función para comprobar si hay un ganador en el tablero actual
  const checkWinner = (newBoard) => {
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo;
      if (
        newBoard[a] &&
        newBoard[a] === newBoard[b] &&
        newBoard[a] === newBoard[c]
      ) {
        return newBoard[a];
      }
    }
    // Comprobar si hay un empate
    if (newBoard.every(square => square !== null)) {
      return false;
    }
    return null;
  }
  // Función para actualizar el tablero y cambiar el turno
  const updateBoard = (index) => {
    if (board[index] || winner) return; // si la celda ya está marcada o hay ganador, no hacer nada
    const newBoard = [...board]; // crea una copia del tablero
    newBoard[index] = turn; // actualiza la celda con el turno actual
    setBoard(newBoard);
    const newTurn = turn === Turns.X ? Turns.O : Turns.X; // cambia el turno
    setTurn(newTurn);
    const newWinner = checkWinner(newBoard); // comprueba si hay un ganador
    if (newWinner !== null) {
      confetti()
      setWinner(newWinner);
    }
  }
  // Función para reiniciar el juego
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(Turns.X);
    setWinner(null);
  }
  return (
    <main className="board">      
      <h1>Tres en raya</h1>
      <button onClick={resetGame}>Empezar de nuevo</button>
      <section className="game">
        {
          board.map((square, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {board[index]}
              </Square>
            )
          })
        }
      </section>
      <section className="turn">
        <Square isSelected={turn === Turns.X}>
          {Turns.X}
        </Square>
        <Square isSelected={turn === Turns.O}>
          {Turns.O}
        </Square>
      </section>
      {
        winner !== null && (
          <section className="winner">
            <div className="text">
              <h2>{winner === false ? 'Empate' : `Ganó ${winner}`}</h2>
              <header className="win">
                {winner && winner !== false && <Square>{winner}</Square>}
              </header>
              <footer>
                <button onClick={resetGame}>Empezar de nuevo</button>
              </footer>
            </div>
          </section>
        )
      }
    </main>
  )
}

export default App;
