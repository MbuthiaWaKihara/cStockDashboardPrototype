import React, { useState, useEffect } from 'react';
import { HorizontalBar, Line } from 'react-chartjs-2';

const ReportVsPeriod = ({months, range, name, display}) => 
{
    //state variable to hold all incoming data from dhis
    const [allData, setAllData] = useState({});

    //fetch all data from dhis
    useEffect(
        () => {
            let url = `26/analytics?dimension=dx:${name}&dimension=pe:${range}&dimension=ou:USER_ORGUNIT&&order=DESC&timeField=EVENT_DATE`;
    
            fetch(url, {
                headers: {
                    Authorization: `Basic ${btoa('albertagoya@gmail.com:Pa$$word1')}`,
                }
            })
            .then(response => response.json())
            .then(
                result => {
                    setAllData(result);
                }
            )
        }, []
    );

    //state variable that holds only the row information
    const [allRows, setAllRows] = useState([]);
    //state variable that holds the org units
    const [orgUnits, setOrgUnits] = useState([]);
    //state variable that holds the period sorted from earliest to latest
    const [periods, setPeriods] = useState([]);
    //state variable that holds the chart title
    const [title, setTitle] = useState('');

    //set the rows and org units when the all data state is updated
    useEffect(
        () => {
            if(allData.rows){
                let url = `dataSets/${name}`;
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
                        setTitle(result.displayName)
                        setAllRows([...allData.rows]);
                        setOrgUnits([...allData.metaData.dimensions.ou]);
                        setPeriods([...allData.metaData.dimensions.pe]);
                    }
                );
            }
        }, [allData, name]
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

    //state variable to store the rows sorting by org unit
    const[sortedRows, setSortedRows] = useState([]);

    //populate the sorted rows state variable
    useEffect(
        () => {
            orgUnits.forEach(
                orgUnit => {
                    allRows.forEach(
                        row => {
                            if(row[2] === orgUnit){
                                setSortedRows(
                                    previousSortedRows => {
                                        return([...previousSortedRows, row])
                                    }
                                )
                            }
                        }
                    );
                }
            );
        }, [allRows, orgUnits]
    );

     //state variable that stores rows according to org unit
     const [rowsPerOrg, setRowsPerOrg] = useState([]);

     //populate rows per org unit
     useEffect(
         () => {
             if(sortedRows.length > 0){
                 let sortedRowsDuplicate = [...sortedRows];
                 let rowsPerOrgDuplicate = [];
 
                 while(sortedRowsDuplicate.length > 0){
                     rowsPerOrgDuplicate = [...rowsPerOrgDuplicate, sortedRowsDuplicate.slice(0,months)];
                     sortedRowsDuplicate.splice(0,months);
                 }
 
                 setRowsPerOrg([...rowsPerOrgDuplicate]);
             }
         }, [sortedRows, months]
     );

     //state variable that holds sorted rows per org
    const [sortedRowsPerOrg, setSortedRowsPerOrg] = useState([]);

    //sort the rows per org by month from earliest to latest
    useEffect(
        () => {
            let rowsPerOrgDuplicate = [...rowsPerOrg];
            
            rowsPerOrgDuplicate.forEach(
                currentOrg => {
                    let temporary;
                    let swapped;

                    while(true){
                        swapped = false;

                        for(let i = 0; i < currentOrg.length-1; i++){

                            if(currentOrg[i][1] > currentOrg[i + 1][1]){
                                temporary = currentOrg[i];
                                currentOrg[i] = currentOrg[i + 1];
                                currentOrg[i + 1] = temporary;

                                swapped = true;
                            }
                        }

                        if(!swapped){
                            break;
                        }
                    }
                }
            );

            setSortedRowsPerOrg([...rowsPerOrgDuplicate]);
        }, [rowsPerOrg]
    );

    //state variable that holds the sorted report values
    const [sortedValues, setSortedValues] = useState([]);

    //populate the sorted report values state variable
    useEffect(
        () => {
            let sortedValuesDuplicate = [];
            let currentRates = [];
            let sortedRowsPerOrgDuplicate = sortedRowsPerOrg;

           if(sortedRowsPerOrgDuplicate.length){
            sortedRowsPerOrgDuplicate.forEach(
                orgUnit => {
                    orgUnit.forEach(
                        row => {
                            currentRates = [...currentRates, row[3]]
                        }
                    );

                    sortedValuesDuplicate = [...sortedValuesDuplicate, currentRates];
                    currentRates = [];
                }
            );
           }
           setSortedValues([...sortedValuesDuplicate]);
        }, [sortedRowsPerOrg]
    );

     //state variable that holds the data for a line chart
     const [lineData, setLineData] = useState({});
     //state variable that holds the names of the formatted months
     const [formattedMonths, setFormattedMoths] = useState([]);

     //populate the line chart state variable
     useEffect(
         () => {
             let holdChartData = { labels: [], datasets: []};
             let holdSortedMonths = [...periods];
             let formattedMonths = [];
 
             holdSortedMonths.forEach(
                 originalMonth => {
                     let formattedMonth;
                     let year;
                     let monthValue;
                     let monthName;
 
                     year = originalMonth.slice(0,4);
                     monthValue = originalMonth.slice(4,6);
 
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
 
                     formattedMonth = `${monthName} ${year}`
                     formattedMonths = [...formattedMonths, formattedMonth];
                 }
             );
 
             holdChartData.labels = [...formattedMonths];
             setFormattedMoths([...formattedMonths]);
 
             let holdRows = sortedRowsPerOrg
             holdRows.forEach(
                 (row, index) => {
                     let singleOrgUnitData = {label: '', data: [], backgroundColor: ''};
                     let orgCode = row[0][2];
                     
                     if(orgNames.length > 0){
                         singleOrgUnitData.label = orgNames[index]; 
                         // singleOrgUnitData.label = orgCode;
                     }else{
                         singleOrgUnitData.label = orgCode; 
                     }                 
                     let rates = [];
                     row.forEach(
                         orgMonthInstance => {
                             rates = [...rates, orgMonthInstance[3]]
                         }
                     );
 
                     singleOrgUnitData.data = [...rates];
                     let R = Math.floor(Math.random() * 255 ) + 1;
                     let G = Math.floor(Math.random() * 255 ) + 1;
                     let B = Math.floor(Math.random() * 255 ) + 1;
                     let opacity = Math.floor(Math.random() * 5 ) + 1;
                     singleOrgUnitData.backgroundColor = `rgba(${R},${G},${B},.${opacity})`;
                     holdChartData.datasets = [...holdChartData.datasets, singleOrgUnitData];
                 }
             );
 
             setLineData({...holdChartData});
         }, [orgNames, periods, range, name]
     );

     //normal variable that holds constant options
    const lineOptions = {
        maintainAspectRatio: true,
        title : {
            display: true,
            text : `${title} For The Last ${months === 1 ? '' : months} ${months === 1 ? 'Month' : 'Months'}`,
            fontSize : '25',
        },
      }

    //state variable that will hold the body of the table
    const [tableBody, setTableBody] = useState([]);
    
    //create a table body
    useEffect(
        () => {   
           if(orgNames.length){
            let tableBodyDuplicate = [];
            orgNames.forEach(
                (orgName, orgIndex) => {
                    
                    let currentDisplayRow
                    if(formattedMonths.length && sortedValues.length){ 
                         currentDisplayRow = formattedMonths.map(
                            (month, monthIndex)=> {
                                return(
                                    <tr key={monthIndex}>
                                        {monthIndex === 0 && <td rowSpan={formattedMonths.length} style={{textAlign: 'center'}}>{orgName}</td>}
                                        <td>{month}</td>
                                        <td style={{textAlign: 'center'}}>{sortedValues[orgIndex][monthIndex]}</td>
                                    </tr>
                                )
                            }
                        );
                    }

                    tableBodyDuplicate = [...tableBodyDuplicate, currentDisplayRow];
                    console.log("what's this: ", tableBodyDuplicate);
                    setTableBody([...tableBodyDuplicate]);
                    currentDisplayRow = null;
                }
            );
             
           }
        },[lineData, formattedMonths, sortedValues]
    );


    console.log("sorted rows per org unit: ", sortedRowsPerOrg);
    console.log("sorted values", sortedValues);

    return(
        <>
           {display === "chart" && 
            <Line 
            data={lineData}  
            options={lineOptions}
            />
           }
           {
            display === "table" &&
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <th>Organisation Unit</th>
                        <th>Period</th>
                        <th>{title}</th>
                    </thead>
                    <tbody>
                        {tableBody.map( row => <>{row}</>)}
                    </tbody>
                </table>
            </div>
           }
        </>
    )
}

export default React.memo(ReportVsPeriod);