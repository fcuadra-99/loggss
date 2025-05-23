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
            <h1>{`Sensitivity: ${(value * 1000).toFixed(2)}`}</h1>
            <input type="range"
                min={0.00001} max={0.005}
                step={0.00001}
                value={value}
                onChange={handleInputChange}
                className="slider"
            />
        </>)
    }

    return (
        <>
            <div onClick={tPause} className={`pbg ${ctrlon ? "active" : "inactive"}`} />
            <section className={`pmenu ${ctrlon ? "active" : "inactive"}`}>
                <h2 className='labe'>Paused</h2>
                <div className='slaida'>
                    {Slider()}
                </div>
            </section>
        </>
    )
}

export function sens() {
    console.log(val)
    return val;
}

export default PauseMenu