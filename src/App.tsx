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
  });

  return (
    <>
      <main className='scene'>
        <Scene />
        <div className='testoverlay'>
          TEST
        </div>
      </main>
    </>
  )
}

export default App