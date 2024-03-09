import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [card1, setCard1] = useState(null);
  const [card2, setCard2] = useState(null);
  const [result, setResult] = useState('');
  const [counter, setCounter] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const storeHighScore = localStorage.getItem('highscore');
    return storeHighScore ? 
    parseInt(storeHighScore) : 0});
  
  useEffect(() => {
    localStorage.setItem('highscore', highScore.toString());
  }, [highScore]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          await axios.get('https://api.scryfall.com/cards/random?q=%28game%3Apaper%29+usd%3E0+%28image_uris%3Anormal%29'),
          await axios.get('https://api.scryfall.com/cards/random?q=%28game%3Apaper%29+usd%3E0+%28image_uris%3Anormal%29')
        ]);
        setCard1(response1.data);
        setCard2(response2.data);

      } catch (error){
        console.log(error);
      }
    };
    fetchData();
  }, [counter]);

  function nextCards() {
    setCard1(null);
    setCard2(null);
    if (result === 'Incorrect'){setScore(0)};
    setCounter(prevCounter => prevCounter+1);
    setResult('')
  }

  function correct() {
    setResult('Correct');
    setScore(prevScore => prevScore + 1);
  }
  function incorrect() {
    setResult('Incorrect');
    setHighScore(prevHighscore => score > prevHighscore ? prevHighscore = score : prevHighscore);
  }

  function card1Clicked() {
    card1.prices.usd >= card2.prices.usd ? correct() : incorrect();
  }
  function card2Clicked() {
    card2.prices.usd >= card1.prices.usd ? correct() : incorrect();
  }


  return (
    <div className="App">
      <h1>Which card is more expensive?</h1>
      <h3>Score: {score}</h3>
      <h3>High Score: {highScore}</h3>
      <div>
        {card1 && card2 ? (
          <div className='cards'>
            <img src = {card1.image_uris.normal} onClick={card1Clicked} className='card1'/>
            <img src = {card2.image_uris.normal} onClick={card2Clicked} className='card2'/>
          </div>
          
        ) : 
        (<p>loading...</p>)}
      </div>
      
      <div className='menu'>
      <button disabled={result===''} onClick={nextCards}>
          {result === 'Incorrect' ? 'Restart' : 'Next'}
      </button>
      <p>{result}</p>
      {result !== '' ? <div><p>{card1.name}: {card1.prices.usd}</p> <p>{card2.name}: {card2.prices.usd}</p></div>: ''}
    </div>
    </div>
    
  );
}

export default App;
