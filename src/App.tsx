import Scene from './assets/Scene1.tsx'
import { useState } from 'react';
import './App.css'


function App() {
  const [ctrlon, setcon] = useState(true);

  document.addEventListener("pointerlockchange", () => {
    if (document.pointerLockElement === document.body) {
      setcon(false);
    } else {
      setcon(true);
    }
    ctrlon;
  });

  return (
    <>
      <main className='scene'>
        <Scene />
      </main>
    </>
  )
}

export default App