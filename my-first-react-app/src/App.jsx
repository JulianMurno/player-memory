// App.js
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Button} from "@nextui-org/react";
import React, { useState, useEffect } from 'react';
import './App.css';
import players from '../components/data';

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

  useEffect(() => {
    // Duplicar las cartas para que haya dos de cada jugador
    const duplicatedPlayers = [...players, ...players];
    const shuffledPlayers = shuffleArray(duplicatedPlayers);
    setCards(shuffledPlayers.map((player) => ({ ...player, flipped: false, matched: false })));
  }, []);

  const handleCardClick = (index) => {
    if (flippedIndices.length === 2 || isGameWon) {
      // Ya hay dos cartas volteadas o se ha ganado el juego, no hacer nada
      return;
    }

    setFlippedIndices((prevFlippedIndices) => [...prevFlippedIndices, index]);

    if (flippedIndices.length === 1) {
      // Comprobar si las dos cartas coinciden
      if (cards[flippedIndices[0]].name === cards[index].name) {
        setMatchedPairs((prevMatchedPairs) => [...prevMatchedPairs, cards[flippedIndices[0]].name]);
        setFlippedIndices([]);
        // Incrementar el puntaje por cada pareja coincidente
        setScore((prevScore) => prevScore + 1);

        // Verificar si se ha ganado el juego
        if (score + 1 === cards.length / 2) {
          setIsGameWon(true);
        }
      } else {
        // Voltear las cartas después de un breve tiempo y reiniciar el puntaje
        setTimeout(() => {
          setFlippedIndices([]);
          setScore(0);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    // Reiniciar el juego conservando el mejor puntaje
    setCards(shuffleArray([...players, ...players]).map((player) => ({ ...player, flipped: false, matched: false })));
    setFlippedIndices([]);
    setMatchedPairs([]);
    setScore(0);
    setIsGameWon(false);
  };

  useEffect(() => {
    // Actualizar el mejor puntaje cuando se alcanza un nuevo máximo
    if (score > bestScore) {
      setBestScore(score);
    }
  }, [score, bestScore]);

  return (
    <div className="App">
      <Navbar>
        <NavbarBrand>
          <p className="font-bold text-inherit">ACME</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
        {isGameWon ? (
          <div className="win-message">¡Felicidades, has ganado!</div>
        ) : (
          <div className="score-container">
            <div className="score"></div>
            <div className="best-score"></div>
          </div>
        )}
        </NavbarItem>
        <NavbarItem>
            <h1>Points: {score}</h1>
          </NavbarItem>
          <NavbarItem>
            <h1>
              Best: {bestScore}
            </h1>
          </NavbarItem>
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
      </div>
    </div>
  );
};

export default App;
