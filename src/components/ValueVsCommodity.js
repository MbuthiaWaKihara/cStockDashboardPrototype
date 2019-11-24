import React, { useState, useEffect } from 'react';
import { HorizontalBar } from 'react-chartjs-2';

const ValueVsCommodity = ({endpoint, name, display}) => {

    //state variable to hold all incoming data from dhis
    const [allData, setAllData] = useState({});

    //fetch all data from dhis
    useEffect(
        () => {
            let url = endpoint;
    
            fetch(url, {
                headers: {
                    Authorization: `Basic ${btoa('albertagoya@gmail.com:Pa$$word1')}`,
                }
            })
            .then(response => response.json())
            .then(
                result => {
                    setAllData({...result});
                }
            )
        }, [endpoint]
    );

    //state variable that stores the month
    const [month, setMonth] = useState('');
    //state variable that stores the org units
    const [orgUnits, setOrgUnits] = useState([]);
    //state variable that stores the  commodities
    const [commodities, setCommodities] = useState([]);
    //state variable that holds the rows information
    const [initialRows, setInitialRows] = useState([]);

    // populate the above state variables when the data fetches
    useEffect(
        () => {
            if(allData.rows){
                setMonth(allData.metaData.dimensions.pe[0]);
                setOrgUnits([...allData.metaData.dimensions.ou]);
                setCommodities([...allData.metaData.dimensions.dx]);
                setInitialRows([...allData.rows])
            }
        },[allData]
    );

    //state variable that stores the initial rows sorted by org unit
    const [sortedRows, setSortedRows] = useState([]);

    //populate the sorted rows state variable
    useEffect(
        () => {
            if(initialRows.length){
                let initialRowsDuplicate = initialRows;
                let sortedRowsDuplicate = [];

                orgUnits.forEach(
                   orgUnit => {
                       initialRowsDuplicate.forEach(
                           initialRow => {
                               if(orgUnit === initialRow[1]){
                                   sortedRowsDuplicate = [...sortedRowsDuplicate, initialRow];
                               }
                           }
                       )
                   }
                );

                setSortedRows([...sortedRowsDuplicate]);
            }
        },[initialRows, orgUnits]
    );

    //state variable that holds rows per org
    const [rowsPerOrg, setRowsPerOrg] = useState([]);
    //populate the rows per org state variable
    useEffect(
        () => {
            let rowsPerOrgDuplicate = [];
            let holdrows = [];

            orgUnits.forEach(
                (orgUnit, index) => {
                    sortedRows.forEach(
                        row => {
                            if(orgUnit === row[1]){
                                holdrows = [...holdrows, row];
                                rowsPerOrgDuplicate[index] = [...holdrows];
                            }
                        }
                    );
                    holdrows = [];
                }
            );
            
            setRowsPerOrg([...rowsPerOrgDuplicate]);
        }, [sortedRows]
    );

    //state variable that holds the rates in order of commodity and org unit
    const [ratesPerOrg, setRatesPerOrg] = useState([]);

    //populate the rates per commodity per org unit state variable
    useEffect(
        () => 
        {
            let currentRatePerCommodity = [];
            let ratesPerOrgDuplicate = [];

            rowsPerOrg.forEach(
                (orgUnit, orgIndex) => {
                    commodities.forEach(
                        (commodity, commodityIndex) => {
                            orgUnit.forEach(
                                (orgRow) => {
                                    if(commodity === orgRow[0]){
                                        currentRatePerCommodity[commodityIndex] = orgRow[3];
                                    }
                                }
                            );

                            if(!currentRatePerCommodity[commodityIndex]){
                                currentRatePerCommodity[commodityIndex] = '0.0';
                            }
                        }
                    );
                    ratesPerOrgDuplicate[orgIndex] = [...currentRatePerCommodity];
                    currentRatePerCommodity = [];
                }
            );

            setRatesPerOrg([...ratesPerOrgDuplicate]);
        },[rowsPerOrg]
    );

    //state variable that holds the commodities names
    const [commoditiesNames, setCommoditiesNames] = useState([]);

    //populate the commodities names state variable
    useEffect(
        () => {
            commodities.forEach(
                commodity => {
                    let url = `dataElements/${commodity}`;
    
                    fetch(url, {
                        headers: {
                            Authorization: `Basic ${btoa('albertagoya@gmail.com:Pa$$word1')}`,
                        }
                    })
                    .then(response => response.json())
                    .then(
                        result => {
                            setCommoditiesNames(
                                previousCommoditiesNames => {
                                    return([...previousCommoditiesNames, result.displayName]);
                                }
                            );
                        }
                    )
                }
            );

        }, [commodities]
    );

    //state variable that stores names of the org units
    const [orgNames, setOrgNames] = useState([]);

    //populate the org names state variable
    useEffect(
        () => {

            let orgNamesDuplicate = [];
            orgUnits.forEach(
                (orgUnit, index) => {
                    let orgName;
                    let url = `organisationUnits/${orgUnit}`;
                    fetch(url, {
                        headers: {
                            Authorization: `Basic ${btoa('albertagoya@gmail.com:Pa$$word1')}`,
                        }
                    })
                    .then(
                        response => response.json()
                    )
                    .then(
                        result => {
                            orgName = result.displayName;
                            orgNamesDuplicate[index] = orgName;
                            setOrgNames([...orgNamesDuplicate]);
                        }
                    )

                }
            );

        },[orgUnits]
    );

    //state variable to hold data that goes into a chart
    const [chartData, setChartData] = useState({labels: [], datasets: []});
    //state variable that holds the formatted month
    const [humanReadableMonth, setHumanReadableMonth] = useState('')

    //populate the chart data state variable
    useEffect(
        () => {

            let chartDataDuplicate = {labels: [], datasets: []};
            //format the current month
            let year = month.slice(0,4);
            let monthValue = month.slice(4,6);
            let monthName = '';

                switch(monthValue){
                    case '01':
                        monthName = 'January ';
                        break;
                    case '02':
                        monthName = 'February ';
                        break;
                    case '03':
                        monthName = 'March ';
                        break;
                    case '04':
                        monthName = 'April ';
                        break;
                    case '05':
                        monthName = 'May ';
                        break;
                    case '06':
                        monthName = 'June ';
                        break;
                    case '07':
                        monthName = 'July ';
                        break;
                    case '08':
                        monthName = 'August ';
                        break;
                    case '09':
                        monthName = 'September ';
                        break;
                    case '10':
                        monthName = 'October ';
                        break;
                    case '11':
                        monthName = 'November ';
                        break;
                    case '12':
                        monthName = 'December ';
                        break;
                    default:
                        break;
                }

                let formattedMonth = `${monthName} ${year}`;
                setHumanReadableMonth(formattedMonth);

            //create the datasets
            let dataSetsDuplicate = [];
            let dataSet = {label: [], data: [], backgroundColor: ''};

            orgUnits.forEach(
                (orgUnit, index) => {
                    dataSet.label = orgNames[index];
                    dataSet.data = [...ratesPerOrg[index]];
                    
                    let R = Math.floor(Math.random() * 255 ) + 1;
                    let G = Math.floor(Math.random() * 255 ) + 1;
                    let B = Math.floor(Math.random() * 255 ) + 1;

                    dataSet.backgroundColor = `rgb(${R}, ${G}, ${B})`;

                    dataSetsDuplicate = [...dataSetsDuplicate, dataSet];
                    dataSet = {label: [], data: [], backgroundColor: ''};
                }
            );

            chartDataDuplicate.labels = [...commoditiesNames];
            chartDataDuplicate.datasets = [...dataSetsDuplicate];
            setChartData(chartDataDuplicate);
            
        }, [orgNames]
    );

    //options for the table then
    const chartOptions = {
        maintainAspectRatio: true,
        title : {
            display: true,
            text : `${name} For ${humanReadableMonth}`,
            fontSize : '25',
        },
      }

    //state variable to hold table body
    const [tableBody, setTableBody] = useState();

    //populate the table body state variable when everything is ready
    useEffect(
        () => {
            
            if(orgNames.length){
                let bodyDuplicate = orgNames.map(
                    (org, orgIndex) => {
                        return(
                            <tr>
                                <td>{org}</td>
                                {commoditiesNames.map(
                                    (commodity, commodityIndex) => {
                                        return(
                                            <td style={{textAlign: 'center'}}>{ratesPerOrg[orgIndex][commodityIndex]}</td>
                                        )
                                    }
                                )}
                            </tr>
                        )
                    }
                );
                
                setTableBody(bodyDuplicate);
            }

        },[chartData]
    );

    return(
        <>
            {display === "chart" &&
            <HorizontalBar
            data={chartData}
            options={chartOptions}
            />
            }
            {display === "table" &&
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th colSpan={commoditiesNames.length+1} style={{textAlign: 'center'}}>{`${name} For ${humanReadableMonth}`}</th>
                        </tr>
                        <tr>
                            <th style={{textAlign: 'center'}}>Organisation Unit</th>
                            {commoditiesNames.map(commodity => <th>{commodity}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {tableBody}
                    </tbody>
                </table>
            </div>
            }
        </>
    )
}

export default React.memo(ValueVsCommodity);