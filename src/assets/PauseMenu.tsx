import { useState } from 'react';

let val = 0.002;

function PauseMenu(ctrlon: boolean) {
    const [value, setValue] = useState(val);
    const [opt, togopt] = useState(false);

    return (
        <>
            <div onClick={tPause} className={`pbg ${ctrlon ? "active" : "inactive"}`} />
            <section className={`pmenu ${ctrlon ? "active" : "inactive"}`}>
                <h1 className='labe'>Paused</h1>
                <p className='labe'>Click to Continue</p>
                <Btns />
                {Slider()}
            </section>
        </>
    )

    function ShowOption() {
        togopt(!opt);
    }

    function Btns() {
        return (
            <>
                <div className='btns'>
                    <div className='exit'></div>
                    <div className='opti' onClick={ShowOption}></div>
                    <div className='info'></div>
                </div>
            </>
        )
    }

    function Slider() {
        const style = {
            slider: {
                position: 'fixed',
                display: 'flex',
                top: '0',
                right: '0',
                margin: '30px',
                padding: '0px 20px',
                justifyContent: 'space-between'
            } as React.CSSProperties,

            label: {
                fontSize: 'medium',
                alignSelf: 'flex-end',
                marginRight: '10px'
            } as React.CSSProperties
        }

        const handleInputChange = (event: { target: { value: any; }; }) => {
            setValue(Number(event.target.value));
            val = value;
            val = value;
        };

        return (<>
            <div className={`slaida ${opt ? "active" : "inactive"}`} style={style.slider}>
                <h1 style={style.label}>
                    {`Sensitivity: ${(value * 1000).toFixed(2)}`}
                </h1>
                <input type="range"
                    min={0.00001} max={0.005}
                    step={0.00001}
                    value={value}
                    onChange={handleInputChange}
                    className="slider"
                />
            </div>

        </>)
    }

    function tPause() {
        document.body.requestPointerLock({ 
            unadjustedMovement: true 
        }).then(() => togopt(false))
    }

}
export function sens() {
    //console.log(val)
    return val;
}

export default PauseMenu