import React, { useState, useEffect } from 'react';
import RateVsPeriod from './RateVsPeriod';
import ValueVsCommodity from './ValueVsCommodity';
import TypeVsPeriod from './TypeVsPeriod';

const App = () =>
{
    //state variable to hold desired period of months
    const[period, setPeriod] = useState({months: 6, range: 'LAST_6_MONTHS'});
    //state variable that monitors component remounting
    const [toggleMount, setToggleMount] = useState(true);

    //change toggleMount everytime user inputs new period
    useEffect(
        () => {
            let interval = setInterval(
                () => {
                    setToggleMount(
                        previousToggleMount => {
                            return(!previousToggleMount)
                        }
                    );
                }, 500
            );

            setTimeout(
                () => {
                    clearInterval(interval);
                }, 1000
            );
        },[period]
    );

    const changePeriod = event => {
        let selectedPeriod = event.target.value;
        switch(selectedPeriod){
            case '1':
                setPeriod({
                    months: 1, range: 'LAST_MONTH'
                });
                break;
            case '3':
                setPeriod({
                    months: 3, range: 'LAST_3_MONTHS'
                });
                break;
            case '6':
                    setPeriod({
                        months: 6, range: 'LAST_6_MONTHS'
                    });
                    break;
            case '12':
                    setPeriod({
                        months: 12, range: 'LAST_12_MONTHS'
                    });
                    break;
            default: 
                    break;
        }
    }

    return(
       <>
       <div className="container container-fluid">
            <div>
                <select onChange={changePeriod}>
                    <option>Select a period</option>
                    <option value='1'>Last Month</option>
                    <option value='3'>Last 3 Months</option>
                    <option value='6'>Last 6 Months</option>
                    <option value='12'>Last 12 Months</option>
                </select>
            </div>
           <div style={{
                width: '100%',
                heigth: '100%'
                }}>
                    <div style={{
                        borderLeft: '1px solid #575859',
                        borderBottom: '2px solid #575859',
                        borderRadius: '5px',
                        width: '50%',
                        height: '100%',
                        margin: '10px',
                        backgroundColor: '#ffffff',
                        padding: '5px',
                    }}>
                        {toggleMount && 
                        <RateVsPeriod 
                        months={period.months}
                        range={period.range}
                        name="z2slLbjn7PM.REPORTING_RATE"
                    />}
                    </div>
            </div>
            <div style={{
                width: '100%',
                heigth: '100%'
                }}>
                    <div style={{
                        borderLeft: '1px solid #575859',
                        borderBottom: '2px solid #575859',
                        borderRadius: '5px',
                        width: '50%',
                        height: '100%',
                        margin: '10px',
                        backgroundColor: '#ffffff',
                        padding: '5px',
                    }}>
                        {toggleMount &&
                        <RateVsPeriod 
                        months={period.months}
                        range={period.range}
                        name="ozYIEpvgLnb.REPORTING_RATE"
                    />}
                    </div>
                    
            </div>

            <div style={{
                width: '100%',
                heigth: '100%'
                }}>
                    <div style={{
                        borderLeft: '1px solid #575859',
                        borderBottom: '2px solid #575859',
                        borderRadius: '5px',
                        width: '50%',
                        height: '100%',
                        margin: '10px',
                        backgroundColor: '#ffffff',
                        padding: '5px',
                    }}>
                        {toggleMount &&
                        <RateVsPeriod 
                        months={period.months}
                        range={period.range}
                        name="s4029egvhCv.REPORTING_RATE"
                    />}
                    </div>
            </div>

            <div style={{
                width: '100%',
                heigth: '100%'
                }}>
                    <div style={{
                        borderLeft: '1px solid #575859',
                        borderBottom: '2px solid #575859',
                        borderRadius: '5px',
                        width: '50%',
                        height: '100%',
                        margin: '10px',
                        backgroundColor: '#ffffff',
                        padding: '5px',
                    }}>
                    <TypeVsPeriod 
                    />
                    </div>
            </div>

            <div style={{
                width: '100%',
                heigth: '100%'
                }}>
                    <div style={{
                        borderLeft: '1px solid #575859',
                        borderBottom: '2px solid #575859',
                        borderRadius: '5px',
                        width: '100%',
                        height: '100%',
                        margin: '10px',
                        backgroundColor: '#ffffff',
                        padding: '5px',
                    }}>
                        <ValueVsCommodity
                        endpoint={`26/analytics.json?dimension=dx:IYVjjC42J0C;UriZTcAqQhS;Da2hUTlhuev;tlLJoasHsnx;KU1GdTyABV1;BnNTJQvpssM;GAWSnGyeBEp;hPRee4vfcHk;IpzMGXo8pSm;m72B7CKg78l;SrscdcMTFzi;MfIPOuz50f6;ObK4JLoDLNy;sHsyHc1kmIU;vHL3aYvAkhb;iH9jNGP7dQu;P0Cy5mBXijV;N8OFIqhmBjU&dimension=ou:USER_ORGUNIT&dimension=pe:LAST_MONTH&displayProperty=NAME&user=Fsw9jvRNAGL&outputIdScheme=UID`}
                        name="CHV Stock Status"
                        />
                    </div>
            </div>


            <div style={{
                width: '100%',
                heigth: '100%'
                }}>
                    <div style={{
                        borderLeft: '1px solid #575859',
                        borderBottom: '2px solid #575859',
                        borderRadius: '5px',
                        width: '100%',
                        height: '100%',
                        margin: '10px',
                        backgroundColor: '#ffffff',
                        padding: '5px',
                    }}>
                        <ValueVsCommodity
                        endpoint={`26/analytics.json?dimension=dx:KlPQhEdeXjW;xd1eOg9utBq;ZI6WCx9y3V6;fXrBhtTHovS;ep7kuLvJFki;WKQnu1mu1l8;enM2HwInwiN;fjjt4v5vbNo;HBpaJxbsekx;tzVSc4uexgb;a5fa5PxGqcW;GwCw3QtI1uu;Z1hF4wypKH6;UcsarNc1JRW;rUsbiWZzQ6s;ufJdWNHXS9N;OlH57cLuZ6N;SP3zGOlxuce&dimension=ou:USER_ORGUNIT&dimension=pe:LAST_MONTH&displayProperty=NAME&user=Fsw9jvRNAGL&outputIdScheme=UID`}
                        name="CHV Avarage Consumption"
                        />
                    </div>
            </div>

            <div style={{
                width: '100%',
                heigth: '100%'
                }}>
                    <div style={{
                        borderLeft: '1px solid #575859',
                        borderBottom: '2px solid #575859',
                        borderRadius: '5px',
                        width: '100%',
                        height: '100%',
                        margin: '10px',
                        backgroundColor: '#ffffff',
                        padding: '5px',
                    }}>
                        <ValueVsCommodity
                        endpoint={`26/analytics.json?dimension=dx:FCGlV1DQoAr;AEyG1X4kXnz;CVXGPFXfDLt;AkfJMdfCrbJ;roMeWQc8WTX;VR59AR3RUPQ;BnpkT4ScE1F;wXclU7457Qr;wUdZH6IZpPp;DlnVv9U3rSO;ZtXCsKknDTp;Gkcyqi8tjqK;T7OyqQpUpNd;dRPpmZImtz2;KRtf2dhfDVQ;yLMUqHSThLa;QYY98SdCtTJ;VyNUFZhD89j&dimension=ou:USER_ORGUNIT&dimension=pe:LAST_MONTH&displayProperty=NAME&user=Fsw9jvRNAGL&outputIdScheme=UID`}
                        name="CHV Stock on Hand"
                        />
                    </div>
            </div>
       </div>
       </>
    )
}

export default App;
