import React, { useState, useEffect } from 'react';
import ReportVsPeriod from './ReportVsPeriod';
import ValueVsCommodity from './ValueVsCommodity';
import TypeVsPeriod from './TypeVsPeriod';

const App = () =>
{
    //state variable to hold desired period of months
    const[period, setPeriod] = useState({months: 12, range: 'LAST_12_MONTHS'});
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
            {/* <div>
                <select onChange={changePeriod}>
                    <option>Select a period</option>
                    <option value='3'>Last 3 Months</option>
                    <option value='6'>Last 6 Months</option>
                    <option value='12'>Last 12 Months</option>
                </select>
            </div> */}
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
                        {toggleMount && 
                        <ReportVsPeriod 
                        months={period.months}
                        range={period.range}
                        name="ozYIEpvgLnb.REPORTING_RATE"
                        display="table"
                    />}
                    </div>
            </div>
       </div>
       <div className="container container-fluid">
            {/* <div>
                <select onChange={changePeriod}>
                    <option>Select a period</option>
                    <option value='3'>Last 3 Months</option>
                    <option value='6'>Last 6 Months</option>
                    <option value='12'>Last 12 Months</option>
                </select>
            </div> */}
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
                        {toggleMount && 
                        <ReportVsPeriod 
                        months={period.months}
                        range={period.range}
                        name="ozYIEpvgLnb.REPORTING_RATE"
                        display="chart"
                    />}
                    </div>
            </div>
       </div>
       <hr />
       <div className="container container-fluid">
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
                    <TypeVsPeriod 
                        endpoint={`26/analytics.json?dimension=dx:z2slLbjn7PM.EXPECTED_REPORTS;z2slLbjn7PM.ACTUAL_REPORTS;z2slLbjn7PM.ACTUAL_REPORTS_ON_TIME&dimension=pe:LAST_6_MONTHS&filter=ou:USER_ORGUNIT&displayProperty=NAME&user=Fsw9jvRNAGL&outputIdScheme=UID`}
                        range="12"
                    />
                    </div>
            </div>
       </div>
       <hr />
       <div className="container container-fluid">
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
                        endpoint={`26/analytics.json?dimension=dx:Sb51kbfB5pZ;nRF6iAawMUQ;hzDGo5nqjfH;nt54bcq9NQT;KFHneeBlqlg;kXVqr26t8Gw;fmjRhjO45FQ;UQpO4EcgrIN;Y5fpEJ7f0Hs;vzQkdDBreBo;JT43z2pnLtC;T2ivg5iNkIt;fLZe90RKZdJ;pBizBK6cxTU;alNOqvIBVMI;IQtIhSffFeY;fig2PxDEVb7;uf2s8KKvQCk&dimension=ou:USER_ORGUNIT&dimension=pe:LAST_MONTH&displayProperty=NAME&user=Fsw9jvRNAGL&outputIdScheme=UID`}
                        name="CHV Dispensed"
                        />
                    </div>
            </div>
       </div>
       </>
    )
}

export default App;
