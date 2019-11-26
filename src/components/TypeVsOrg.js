import React, { useState, useEffect } from 'react';
import {Bar} from 'react-chartjs-2';

const TypeVsOrg = ({endpoint, name, display}) => {

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
        }, []
    );

    //state variable that holds the rows
    const [rows, setRows] = useState([]);
    //state variable that holds the month
    const [month, setMonth] = useState(null);
    //state variable that holds the types of report
    const [reportTypes, setReportTypes] = useState([]);
    //state variable that holds the org units
    const [orgUnits, setOrgUnits] = useState([]);

    //set all these state variables when the data is fetched
    useEffect(
        () => {
            if(allData.rows){
                setRows(allData.rows);
                setMonth(allData.metaData.dimensions.pe[0]);
                setReportTypes(allData.metaData.dimensions.dx);
                setOrgUnits(allData.metaData.dimensions.ou);
            }
        },[allData]
    );
    
    //state variable that holds the formatted month
    const [formattedMonth, setFormattedMonth] = useState(null);
    //state variable that holds the names of report
    const [reportNames, setReportNames] = useState([]);

    //format the month and the report types
    useEffect(
        () => {
            if(reportTypes.length && month){
                let year = month.slice(0,4);
                let monthValue = month.slice(4,6);
                let monthName;
            
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

                    setFormattedMonth(`${monthName} ${year}`);

                    let reportNamesDuplicate = [];
                    reportTypes.forEach(
                        (reportType) => {
                            let start = reportType.indexOf(".") + 1;
                            let reportName = reportType.slice(start, reportType.length + 1).replace(/_/g, " ");
        
                            reportNamesDuplicate = [...reportNamesDuplicate, reportName];
                            
                        }
                    );
        
                    setReportNames([...reportNamesDuplicate]);
            }
        },[reportTypes, month]
    );

    //state variable that will hold the org units names
    const [orgNames, setOrgNames] = useState([]);

    //populate this state variable once org units are fetched
    useEffect(
        () => {
            if(orgUnits.length){
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
                    });
                }
        },[orgUnits]
    );

    //state variable that will hold the rows arranged by org unit
    const [rowsPerOrg, setRowsPerOrg] = useState([]);

    //populate this state variable once the rows are ready
    useEffect(
        () => {
            if(rows.length){
                let rowsPerOrgDuplicate = [];
                let currentRow = []
                orgUnits.forEach(
                    (orgUnit, orgIndex) => {
                        rows.forEach(
                            (row, rowIndex) => {
                                if(orgUnit === row[1]){
                                    currentRow = [...currentRow, row];
                                }
                            }
                        );

                        rowsPerOrgDuplicate = [...rowsPerOrgDuplicate, currentRow];
                        currentRow = [];
                    }
                );
                setRowsPerOrg(rowsPerOrgDuplicate);
            }
        },[rows, orgUnits]
    );

    //state variable that will hold the rates according to the report types
    const [ratesPerReport, setRatesPerReport] = useState([]);

    //populate this state variable once rows per org is ready
    useEffect(
        () => {
            
            if(rowsPerOrg.length && reportTypes.length){
                let ratesPerReportDuplicate = [];
                let currentRates = [];
               reportTypes.forEach(
                   (report, reportIndex) => {
                       rowsPerOrg.forEach(
                           (org, orgIndex) => {
                               org.forEach(
                                (row, rowIndex) => {
                                    if(row[0] === report){
                                        currentRates = [...currentRates, row[3]];
                                    }
                                }
                               );
                           }
                       );

                       ratesPerReportDuplicate[reportIndex] = [...currentRates];
                       currentRates = [];
                   }
               );
                setRatesPerReport(ratesPerReportDuplicate);
            }

        }, [reportTypes, rowsPerOrg]
    );

    //state variable that will hold the rates according to the org units
    const [ratesPerOrg, setRatesPerOrg] = useState([]);

    //populate this state variable
    useEffect(
        () => {

            if(rowsPerOrg.length && reportTypes.length){
                let ratesPerOrgDuplicate = [];
                let currentRates = [];
                rowsPerOrg.forEach(
                    (org, orgIndex) => {
                        org.forEach(
                            (row, rowIndex) => {
                                reportTypes.forEach(
                                    (report, reportIndex) => {
                                        if(report === row[0]){
                                            currentRates[reportIndex] = row[3]
                                        }
                                    }
                                );
                            }
                        );

                        ratesPerOrgDuplicate = [...ratesPerOrgDuplicate, currentRates];
                        currentRates = [];
                    }
                );
                setRatesPerOrg(ratesPerOrgDuplicate);
            }

        },[reportTypes, rowsPerOrg]
    );

    //state variable to hold data that goes into a chart
    const [chartData, setChartData] = useState({labels: [], datasets: []});
    
    //populate the chart data state variable
    useEffect(
        () => {
            let chartDataDuplicate = {labels: [], datasets: []}
            chartDataDuplicate.labels = [...orgNames];
            let dataSets = [];

            //prepare datasets
            reportNames.forEach(
                (report, reportIndex) => {
                    let currentSet = {label: '', data: [], backgroundColor: ''};
                    let R = Math.floor(Math.random() * 255 ) + 1;
                    let G = Math.floor(Math.random() * 255 ) + 1;
                    let B = Math.floor(Math.random() * 255 ) + 1;
                    let opacity = Math.floor(Math.random() * 5 ) + 1;

                    currentSet.label = report;
                    currentSet.data = ratesPerReport[reportIndex];
                    currentSet.backgroundColor = `rgba(${R}, ${G}, ${B}, .${opacity})`;

                    dataSets = [...dataSets, currentSet];
                    currentSet = {label: '', data: [], backgroundColor: ''};
                }
            );
            
            chartDataDuplicate.datasets = dataSets;
            setChartData(chartDataDuplicate);
        }, [ratesPerReport, orgNames]
    );

    //options for the chart then
    const chartOptions = {
        maintainAspectRatio: true,
        title : {
            display: true,
            text : `${name} For ${formattedMonth}`,
            fontSize : '25',
        },
      }

    //state variable that holds the table body
    const [tableBody, setTableBody] = useState([]);

    //populate the table body when all data is ready
    useEffect(
        () => {
            let tableBodyDuplicate = orgNames.map(
                (org, orgIndex) => {
                    return(
                        <tr>
                            <td style={{textAlign: 'center'}}>{org}</td>
                            {reportNames.map((report, reportIndex) => <td style={{textAlign: 'center'}}>{ratesPerReport[reportIndex][orgIndex]}</td>)}
                        </tr>
                    )
                }
            )

            setTableBody(tableBodyDuplicate);
        },[orgNames, reportNames, chartData]
    );

    console.log("organisational units:", orgNames);
    console.log("month:", formattedMonth);
    console.log("reports:", reportNames);
    console.log("all data:", allData);
    console.log("rows per org", rowsPerOrg);
    console.log("rates per report:", ratesPerReport);
    console.log("rates per org:", ratesPerOrg);
    console.log("chart data:", chartData);

    return(
        <>
        {
            display === "chart" &&
            <Bar
            data={chartData}
            options={chartOptions}
            />
        }
        {
            display === "table" &&
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{textAlign: 'center'}} colSpan={reportNames.length + 1}>{`${name} For ${formattedMonth}`}</th>
                        </tr>
                        <tr>
                            <th style={{textAlign: 'center'}}>Organisational Unit</th>
                            {reportNames.map(report => <th style={{textAlign: 'center'}}>{report}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {tableBody.map(row => <>{row}</>)}
                    </tbody>
                </table>
            </div>
           }
        </>
    )
}

export default React.memo(TypeVsOrg);