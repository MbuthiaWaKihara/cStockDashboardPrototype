import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const TypeVsPeriod = () =>
{
    //state variable to hold all incoming data from dhis
    const [allData, setAllData] = useState({});

    //fetch all data from dhis
    useEffect(
        () => {
            let url = `26/analytics.json?dimension=dx:ozYIEpvgLnb.REPORTING_RATE;ozYIEpvgLnb.REPORTING_RATE_ON_TIME&dimension=ou:USER_ORGUNIT&dimension=pe:LAST_6_MONTHS&displayProperty=NAME&user=Fsw9jvRNAGL&outputIdScheme=UID`;
    
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

    //state variable that stores the types of reports available
    const [reportTypes, setReportTypes] = useState([]);
    //state variable that stores the available periods
    const [periods, setPeriods] = useState([]);
    //state variable that holds the original rows
    const [rows, setRows] = useState([]);

    //populate the above variables
    useEffect(
        () => {
            if(allData.rows){
                setReportTypes([...allData.metaData.dimensions.dx]);
                setPeriods([...allData.metaData.dimensions.pe]);
                setRows([...allData.rows]);
            }
        },[allData]
    );

    //state variable that will hold sorted rows by type of report
    const [rowsPerReport, setRowsPerReport] = useState([]);

    //sort the rows by report
    useEffect(
        () => {
            let rowsDuplicate = [...rows];
            let rowsPerReportDuplicate = [];
            let currentReportData = [];

            reportTypes.forEach(
                (reportType) => {
                    rowsDuplicate.forEach(
                        row => {
                            if(reportType === row[0]){
                                currentReportData = [...currentReportData, row];
                            }
                        }
                    );

                    rowsPerReportDuplicate = [...rowsPerReportDuplicate, currentReportData];
                    currentReportData = [];
                }
            );

            setRowsPerReport([...rowsPerReportDuplicate]);
        }, [rows]
    );

     //state variable that holds sorted rows per org
     const [sortedRowsPerReport, setSortedRowsPerReport] = useState([]);

     //sort the rows per org by month from earliest to latest
     useEffect(
         () => {
             let rowsPerReportDuplicate = [...rowsPerReport];
             
             rowsPerReportDuplicate.forEach(
                 currentReport => {
                     let temporary;
                     let swapped;
 
                     while(true){
                         swapped = false;
 
                         for(let i = 0; i < currentReport.length-1; i++){
 
                             if(currentReport[i][1] > currentReport[i + 1][1]){
                                 temporary = currentReport[i];
                                 currentReport[i] = currentReport[i + 1];
                                 currentReport[i + 1] = temporary;
 
                                 swapped = true;
                             }
                         }
 
                         if(!swapped){
                             break;
                         }
                     }
                 }
             );
 
             setSortedRowsPerReport([...rowsPerReportDuplicate]);
         }, [rowsPerReport]
     );

     //state variable that holds the rates per report
     const [ratesPerReport, setRatesPerReport] = useState([]);

     //populate rates per report
     useEffect(
         () => {
            let sortedRowsPerReportDuplicate = [...sortedRowsPerReport];
            let currentRates = [];
            let ratesPerReportDuplicate = [];

            sortedRowsPerReportDuplicate.forEach(
                report => {
                    report.forEach(
                        reportRow => {
                            currentRates = [...currentRates, reportRow[2]];
                        }
                    );

                    ratesPerReportDuplicate = [...ratesPerReportDuplicate, currentRates];
                    currentRates = [];
                }
            );

            setRatesPerReport([...ratesPerReportDuplicate]);
         },[sortedRowsPerReport]
     );

    //state variable that stores names of the reports
    const [reportNames, setReportNames] = useState([]);

    //populate the org names state variable
    useEffect(
        () => {

            let reportNamesDuplicate = [];
            reportTypes.forEach(
                (reportType) => {
                    console.log("report type:", reportType);
                    let start = reportType.indexOf(".") + 1;
                    let reportName = reportType.slice(start, reportType.length + 1);

                    reportNamesDuplicate = [...reportNamesDuplicate, reportName];
                    
                }
            );

            setReportNames([...reportNamesDuplicate]);
        },[reportTypes]
    );

    //state variable to hold data that goes into a chart
    const [chartData, setChartData] = useState({labels: [], datasets: []});

    //populate the chart data state variable
    useEffect(
        () => {

            let chartDataDuplicate = {labels: [], datasets: []};
            let humanReadableMonthsDuplicate = [];
            
            periods.forEach(
                month => {
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
                        humanReadableMonthsDuplicate = [...humanReadableMonthsDuplicate, formattedMonth];
                        }
            );

            //create the datasets
            let dataSetsDuplicate = [];
            let dataSet = {label: [], data: [], backgroundColor: ''};

            reportTypes.forEach(
                (reportType, index) => {
                    dataSet.label = reportNames[index];
                    if(ratesPerReport.length) dataSet.data = [...ratesPerReport[index]];
                    
                    let R = Math.floor(Math.random() * 255 ) + 1;
                    let G = Math.floor(Math.random() * 255 ) + 1;
                    let B = Math.floor(Math.random() * 255 ) + 1;
                    let opacity = Math.floor(Math.random() * 5 ) + 1;

                    dataSet.backgroundColor = `rgba(${R}, ${G}, ${B}, ${opacity})`;

                    dataSetsDuplicate = [...dataSetsDuplicate, dataSet];
                    dataSet = {label: [], data: [], backgroundColor: ''};
                }
            );

            chartDataDuplicate.labels = [...humanReadableMonthsDuplicate];
            chartDataDuplicate.datasets = [...dataSetsDuplicate];
            setChartData(chartDataDuplicate);
            
        }, [ ratesPerReport]
    );

    //options for the table then
    const chartOptions = {
        maintainAspectRatio: true,
        title : {
            display: true,
            text : `Something`,
            fontSize : '25',
        },
      }

    return(
        <>
            <Line
                data={chartData}
                options={chartOptions}
            />
        </>
    )
}

export default React.memo(TypeVsPeriod);