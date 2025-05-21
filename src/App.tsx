import Scene from './assets/Scene1.tsx'
import { useEffect, useState } from 'react';
import './App.css'



function App() {
  const [ctrlon, setcon] = useState(true);

  document.addEventListener("click", () => {
    document.body.requestPointerLock();
  });

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
        <section className={`pmenu ${ctrlon ? "active" : "inactive"}`}>
          <h1>Paused</h1>
        </section>
      </main>
    </>
  )
}

export default App