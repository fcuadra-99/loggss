import React from 'react';
import { useState } from 'react';

let { sensi, maVol, sdVol, muVol, mode } = {
    sensi: 0,
    maVol: 0,
    sdVol: 0,
    muVol: 0,
    mode: 'dark'
}

let theme: any = {
    mcol: 'rgba(0, 0, 0, 0.575)',
    scol: 'rgb(24, 24, 24)',
    tcol: 'rgb(255, 255, 255)'
}

setCookie('mode', 'light', 30);

if (isSet('sensitivity') && isSet('mainvol') &&
    isSet('soundvol') && isSet('musvol') && isSet('mode')) {
    sensi = +getCookie('sensitivity');
    maVol = +getCookie('mainvol');
    sdVol = +getCookie('soundvol');
    muVol = +getCookie('musvol');
    mode = getCookie('mode');
    console.log(mode);
} else {
    sensi = 0.002;
    maVol = 75;
    sdVol = 80;
    muVol = 80;
    mode = 'light';
    setCookie('sensitivity', sensi, 30);
    setCookie('mainvol', maVol, 30);
    setCookie('soundvol', sdVol, 30);
    setCookie('musvol', muVol, 30);
    setCookie('mode', mode, 30);
}

if (mode == 'light') {
    theme = {
        mcol: 'rgba(255, 255, 255, 0.57)',
        scol: 'rgb(243, 243, 243)',
        tcol: 'rgb(0, 0, 0)'
    }
} else if (mode == 'dark') {
    theme = {
        mcol: 'rgba(0, 0, 0, 0.575)',
        scol: 'rgb(24, 24, 24)',
        tcol: 'rgb(255, 255, 255)'
    }
}


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
            backgroundColor: `${theme.mcol}`
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
        } as React.CSSProperties,
        optiC: {
            position: 'fixed',
            backgroundColor: `${theme.scol}`,
            width: '40vw',
            minWidth: '300px',
            height: '330px',
            zIndex: '12',
            pointerEvents: 'all',
            borderRadius: '20px'
        } as React.CSSProperties,
    };

    return (
        <>
            <div onClick={tPause} className={`${toggle(ctrlon)}`} style={styles.pbg} />
            <section className={`${toggle(ctrlon)}`} style={styles.pmenu}>
                <h1 style={styles.pmenuLabe}>Paused</h1>
                <p style={styles.pmenuLabe}>Click to Continue</p>
                <Btns />
                <div style={styles.optiC} className={`${opt ? "active" : "inactive"}`} >
                    <h3 style={styles.h3}>Options</h3>
                    {SensiSlider()}
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

    function SensiSlider() {
        const handleInputChange = (event: { target: { value: any; }; }) => {
            setSens(Number(event.target.value));
            sensi = sensit;
            setCookie('sensitivity', sensi, 30);
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
            setCookie('mainvol', maVol, 30);

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
            setCookie('musvol', muVol, 30);
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
            setCookie('soundvol', sdVol, 30);
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

function setCookie(cname: string, cvalue: any, exdays: number) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname: string) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function isSet(cname: string) {
    let user = getCookie(cname);
    if (user != "") {
        return true;
    } else {
        if (user != "" && user != null) {
            setCookie("username", user, 365);
            return false;
        }
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