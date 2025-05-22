import { useState } from 'react';

let val = 0.002;

function tPause() {
    document.body.requestPointerLock({ unadjustedMovement: true });
}

function PauseMenu(ctrlon: boolean, s: number) {
    const [value, setValue] = useState(val);
    console.log('s', s)

    function Slider() {
        const handleInputChange = (event: { target: { value: any; }; }) => {
            setValue(Number(event.target.value));
            val = value;
            val = value;
        };

        return (<>
            <input type="range"
                min={0} max={0.005}
                step={0.0001}
                value={value}
                onChange={handleInputChange}
                className="slider"
            />
        </>)
    }

    function a() {
        console.log(val / 10000)
        return val / 10000;
    }
    return (
        <>
            <div onClick={tPause} className="pbg" />
            <section className={`pmenu ${ctrlon ? "active" : "inactive"}`}>
                Paused
                <h1>{`Sensitivity: ${(a() * 10000000).toFixed(2)}`}</h1>
                {Slider()}
            </section>
        </>
    )
}

export function sens() {
    console.log(val)
    return val;
}

export default PauseMenu