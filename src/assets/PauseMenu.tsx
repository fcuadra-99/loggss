import React from 'react';
import { useState } from 'react';


// sessionStorage.setItem('my-key', JSON.stringify('red'));
// const storedData = JSON.parse(sessionStorage.getItem('my-key'));

let sensi = 0.002;
let maVol = 75;
let sdVol = 80;
let muVol = 80;

function PauseMenu(ctrlon: boolean) {
    const [sensit, setSens] = useState(sensi);
    const [mainv, setmav] = useState(maVol);
    const [sounv, setsv] = useState(sdVol);
    const [musv, setmuv] = useState(muVol);
    const [opt, togopt] = useState(false);

    const styles = {
        pbg: {
            pointerEvents: 'all',
            position: 'fixed',
            display: 'flex',
            alignItems: 'center',
            top: '0px',
            left: '0px',
            width: '100%',
            height: '100vh',
            justifyContent: 'space-evenly',
            margin: '0',
            padding: '0',
            zIndex: 9,
            backgroundColor: 'rgba(0, 0, 0, 0.575)'
        } as React.CSSProperties,

        pmenu: {
            zIndex: 10,
            pointerEvents: 'none',
            position: 'fixed',
            display: 'flex',
            alignItems: 'center',
            top: '0px',
            left: '0px',
            width: '100%',
            height: '100vh',
            padding: '0',
            flexWrap: 'wrap',
            flexDirection: 'column',
            justifyContent: 'center'
        } as React.CSSProperties,

        pmenuLabe: {
            pointerEvents: 'all',
            userSelect: 'none',
            zIndex: 11,
            margin: '10px'
        } as React.CSSProperties,

        h3: {
            margin: '20px 0px 0 0'
        } as React.CSSProperties,

        slider: {
            display: 'flex',
            margin: '0px 30px',
            paddingRight: '10px',
            justifyContent: 'space-between'
        } as React.CSSProperties,

        label: {
            fontSize: '15px',
            alignSelf: 'flex-end',
            marginRight: '10px',
            minWidth: '150px'
        } as React.CSSProperties,

        inp: {
            width: '100%'
        } as React.CSSProperties
    };

    return (
        <>
            <div onClick={tPause} className={`${toggle(ctrlon)}`} style={styles.pbg} />
            <section className={`${toggle(ctrlon)}`} style={styles.pmenu}>
                <h1 style={styles.pmenuLabe}>Paused</h1>
                <p style={styles.pmenuLabe}>Click to Continue</p>
                <Btns />
                <div className={`optiC ${opt ? "active" : "inactive"}`} >
                    <h3 style={styles.h3}>Options</h3>
                    {SensSlider()}
                    {maVolSlider()}
                    {muVolSlider()}
                    {sdVolSlider()}
                </div>
            </section>
        </>
    )

    function ShowOption() {
        togopt(!opt);
    }

    function Btns() {
        const styles = {
            btn: {
                position: 'fixed',
                padding: '10px',
                margin: '30px',
                pointerEvents: 'all',
                borderRadius: '10px'
            } as React.CSSProperties,
            exit: {
                backgroundColor: 'red',
                inset: 'auto auto 0 0',
            } as React.CSSProperties,

            opti: {
                backgroundColor: 'yellow',
                inset: 'auto 0 0 auto',
            } as React.CSSProperties,

            info: {
                backgroundColor: 'blue',
                inset: 'auto 0 0 auto',
                margin: '30px 90px',
            } as React.CSSProperties
        }
        return (
            <>
                <div style={{ ...styles.btn, ...styles.exit }}></div>
                <div style={{ ...styles.btn, ...styles.opti }} onClick={ShowOption}></div>
                <div style={{ ...styles.btn, ...styles.info }}></div>
            </>
        )
    }

    function SensSlider() {
        const handleInputChange = (event: { target: { value: any; }; }) => {
            setSens(Number(event.target.value));
            sensi = sensit;
        };

        return (<>
            <div style={styles.slider} className={`${toggle(opt)}`}>
                <h4 style={styles.label}>
                    {`Sensitivity: ${(sensit * 1000).toFixed(2)}`}
                </h4>
                <input type="range"
                    min={0.00001} max={0.005}
                    step={0.00001}
                    value={sensit}
                    onChange={handleInputChange}
                    style={styles.inp}
                />
            </div>

        </>)
    }

    function maVolSlider() {
        const handleInputChange = (event: { target: { value: any; }; }) => {
            setmav(Number(event.target.value));
            maVol = mainv;
        };

        return (<>
            <div style={styles.slider} className={`${toggle(opt)}`}>
                <h4 style={styles.label}>
                    {`Main Volume: ${(mainv)}`}
                </h4>
                <input type="range"
                    min={0} max={100}
                    step={1}
                    value={mainv}
                    onChange={handleInputChange}
                    style={styles.inp}
                />
            </div>

        </>)
    }

    function muVolSlider() {
        const handleInputChange = (event: { target: { value: any }; }) => {
            setmuv(Number(event.target.value));
            muVol = musv;
        };

        return (<>
            <div style={styles.slider} className={`${toggle(opt)}`}>
                <h4 style={styles.label}>
                    {`Music Volume: ${(musv)}`}
                </h4>
                <input type="range"
                    min={0} max={100}
                    step={1}
                    value={musv}
                    onChange={handleInputChange}
                    style={styles.inp}
                />
            </div>
        </>)
    }

    function sdVolSlider() {
        const handleInputChange = (event: { target: { value: any; }; }) => {
            setsv(Number(event.target.value));
            sdVol = sounv;
        };

        return (<>
            <div style={styles.slider} className={`${toggle(opt)}`}>
                <h4 style={styles.label}>
                    {`Sound Volume: ${(sounv)}`}
                </h4>
                <input type="range"
                    min={0} max={100}
                    step={1}
                    value={sounv}
                    onChange={handleInputChange}
                    style={styles.inp}
                />
            </div>

        </>)
    }

    function tPause() {
        document.body.requestPointerLock({
            unadjustedMovement: true
        }).then(() => { togopt(false) })
    }
}

// type CounterProps = {
//     header: string;
// };

// type CounterState = {
//     value: number;
// };

// class Counter extends React.Component<CounterProps, CounterState> {
//     state: CounterState = {
//         value: 0,
//     };

//     render() {
//         const styles = {
//             slider: {
//                 display: 'flex',
//                 margin: '0px 30px',
//                 justifyContent: 'space-between'
//             } as React.CSSProperties,

//             label: {
//                 fontSize: 'medium',
//                 alignSelf: 'flex-end',
//                 marginRight: '10px',
//                 minWidth: '150px'
//             } as React.CSSProperties,

//             inp: {
//                 width: '100%'
//             } as React.CSSProperties
//         }
//         const [val, setSens] = useState(sensi);
//         const { header } = this.props;
//         const { value } = this.state;
//         const handleInputChange = (event: { target: { value: any; }; }) => {
//             setSens(Number(event.target.value));
//             sensi = sensit;
//         };


//         return (
//             <div>
//                 <h4>{header}</h4>
//                 <input type="range"
//                     min={0.00001} max={0.005}
//                     step={0.00001}
//                     value={sensit}
//                     onChange={handleInputChange}
//                     style={styles.inp}
//                 />
//             </div>
//         );
//     }
// }

const toggle = (toggle: boolean) => toggle ? "active" : "inactive";

export function sens() {
    //console.log(sensi)
    return sensi;
}

export default PauseMenu