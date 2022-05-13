import React, {useEffect, useState} from 'react';
import './App.css';
import {firstCall, secondCall, thirdCall} from "./simulator/asyncCalls";

function App() {

  const [localState, setLocalState] = useState({
    firstStatus: 'stand by',
    secondCall: 'stand by',
    thirdCall: 'stand by'
  });


  useEffect(() => {
    Promise.all([
        firstCall().then((res) => console.log('first succeeded')).catch(() => console.log('first failed')),
        secondCall().then((res) => console.log('second succeeded')).catch(() => console.log('first failed')),
        thirdCall().then((res) => console.log('third succeeded')).catch(() => console.log('first failed')),
    ])
  }, [])

  return (
    <div>

    </div>
  );
}

export default App;
