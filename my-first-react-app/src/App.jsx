// App.js
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@nextui-org/react";
import React, { useState, useEffect } from 'react';
import './App.css';
import players from '../components/data';
import Confetti from 'react-confetti';
import Modal from 'react-modal';
import PlayerListModalContent from '../components/PlayerListModal';

const shuffleArray = (array) => {
  let shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const App = () => {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const duplicatedPlayers = [...players, ...players];
    const shuffledPlayers = shuffleArray(duplicatedPlayers);
    setCards(shuffledPlayers.map((player, index) => ({ ...player, id: index, flipped: false, matched: false })));
  }, []);

  const handleCardClick = (index) => {
    if (flippedIndices.length === 2 || isGameWon) {
      return;
    }

    setFlippedIndices((prevFlippedIndices) => [...prevFlippedIndices, index]);

    if (flippedIndices.length === 1) {
      if (cards[flippedIndices[0]].name === cards[index].name) {
        setMatchedPairs((prevMatchedPairs) => [...prevMatchedPairs, cards[flippedIndices[0]].name]);
        setFlippedIndices([]);
        setScore((prevScore) => prevScore + 1);

        if (score + 1 === cards.length / 2) {
          setIsGameWon(true);
        }
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
          setScore(0);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setCards(shuffleArray([...players, ...players]).map((player, index) => ({ ...player, id: index, flipped: false, matched: false })));
    setFlippedIndices([]);
    setMatchedPairs([]);
    setScore(0);
    setIsGameWon(false);
  };

  useEffect(() => {
    if (isGameWon) {
      setModalIsOpen(true);
    }
  }, [isGameWon]);

  return (
    <div className="App">
      <Navbar>
        <NavbarBrand>
          <p className="font-bold text-inherit">ACME</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {isGameWon ? (
            <div className="win-message">¡Felicidades, has ganado!</div>
          ) : (
            <div className="score-container">
              <div className="score">Puntaje actual: {score}</div>
              <div className="best-score">Mejor puntaje: {bestScore}</div>
            </div>
          )}
          <NavbarItem>
            <Button onClick={resetGame} color="primary" variant="flat">
              Reiniciar Juego
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <h1>Juego de Memoria de Cartas de Jugadores</h1>

      <div className="card-container">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card ${flippedIndices.includes(index) || matchedPairs.includes(card.name) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            {flippedIndices.includes(index) || matchedPairs.includes(card.name) ? (
              <img src={card.image} alt={card.name} />
            ) : (
              <div className="card-back"></div>
            )}
          </div>
        ))}
        {isGameWon && (
          <div className="confetti-container">
            <Confetti width={window.innerWidth} height={window.innerHeight} colors={['#87CEEB', '#FFFFFF', '#FFFF00']} />
          </div>
        )}
      </div>

      {/* Modal para mostrar la lista de jugadores al finalizar el juego */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Lista de Jugadores"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            width: '400px',
            margin: 'auto',
            borderRadius: '8px',
            padding: '20px',
          },
        }}
      >
        <PlayerListModalContent players={players} />
        <Button onClick={() => setModalIsOpen(false)} color="primary" variant="flat">
          Cerrar
        </Button>
      </Modal>
    </div>
  );
};

export default App;
