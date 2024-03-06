import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [card1, setCard1] = useState(null);
  const [card2, setCard2] = useState(null);
  const [result, setResult] = useState('');
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.scryfall.com/cards/random');
        setCard1(response.data);

        const response2 = await axios.get('https://api.scryfall.com/cards/random');
        setCard2(response2.data);

      } catch (error){
        console.log(error);
      }
    };
    fetchData();
  }, [counter]);

  function comparePrices() {
    card1.prices.usd >= card2.prices.usd ? setResult('card 1 is more expensive ' + card1.prices.usd) : setResult('card 2 is more expensive ' + card2.prices.usd);
  }
  function nextCards() {
    setCounter(prevCounter => prevCounter+1);
  }


  return (
    <div className="App">
      <div>
        {card1 && card2 ? (
          <div>
            <img src = {card1.image_uris.normal} />
            <p>{card1.prices.usd}</p>
            <img src = {card2.image_uris.normal} />
            <p>{card2.prices.usd}</p>
          </div>
          
        ) : 
        (<p>loading...</p>)}
      </div>

      <button onClick={comparePrices}>
          comparePrices
      </button>
      <button onClick={nextCards}>
          next
      </button>
      <p>{result}</p>
    </div>
    
  );
}

export default App;
