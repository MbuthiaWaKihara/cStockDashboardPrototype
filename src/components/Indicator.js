import React, { useState, useEffect } from 'react';

const Indicator = () => 
{
    //state variable to hold all incoming data from dhis
    const [allData, setAllData] = useState({});

    //fetch all data from dhis
    useEffect(
        () => {
            let url = `26/analytics.json?dimension=dx:hRPy94AwLok;QAYk3jxI7LX;Xo9mPYZjt4J;rRuVEPZEawW;BDbHpHd0Lrn;twzieUG9OM4;fvPq2gSS2OC;YjXe4zSCUtU;VUaJ1acN3Yh;EpSnF06kLt8;DMsMf3P1OyS;p7X07Uo3UOj;TvJdDFIoQ9f;ooaKHy8FxAD;BhFrfakoAM2&dimension=ou:USER_ORGUNIT&dimension=pe:LAST_12_MONTHS&displayProperty=NAME&user=Fsw9jvRNAGL&outputIdScheme=UID`;
    
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

    //state variable that holds the available org units
    const [orgUnits, setOrgUnits] = useState([]);
    //state variable that holds the months in the specified period
    const [months, setMonths] = useState([]);
    //state variable that holds the specified products
    const [indicators, setIndicators] = useState([]);
    //state variable that holds the rows
    const [rows, setRows] = useState([])

    //populate these state variable when all data has been fetched
    useEffect(
        () => {
            if(allData.rows){
                setOrgUnits(allData.metaData.dimensions.ou);
                setMonths(allData.metaData.dimensions.pe);
                setIndicators(allData.metaData.dimensions.dx);
                setRows(allData.rows);
            }
        },[allData]
    );

    //state variable that will hold the names of the months in the period
    const [monthNames, setMonthNames] = useState([]);
    
    //populate this state variable when months are fetched
    useEffect(
        () => {
            if(months.length){
                let monthNamesDuplicate = [];
                months.forEach(
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
                           monthNamesDuplicate = [...monthNamesDuplicate, formattedMonth];
                           }
                );

                setMonthNames([...monthNamesDuplicate]);
            }
        }, [months]
    );

    //state variable that holds the names of the org units
    const [orgNames, setOrgNames] = useState([]);

    //populate the org names once the org units have been fetched
    useEffect(
        () => {
            if(orgUnits.length){
                let orgNamesDuplicate = [];
                orgUnits.forEach(
                    (orgUnit, orgIndex) => {
                        let url = `organisationUnits/${orgUnit}`;
    
                        fetch(url, {
                            headers: {
                                Authorization: `Basic ${btoa('albertagoya@gmail.com:Pa$$word1')}`,
                            }
                        })
                        .then(response => response.json())
                        .then(
                            result => {
                                orgNamesDuplicate[orgIndex] = result.displayName;
                                setOrgNames(orgNamesDuplicate);
                            }
                        );
                    }
                );
            }
        }, [orgUnits]
    );

    //state variable that will hold the available products/indicators names
    const [indicatorsNames, setIndicatorsNames] = useState([]);

    //populate this state variable when the data is ready
    useEffect(
        () => {
            if(indicators.length){
                let indicatorsNamesDuplicate = [];
                indicators.forEach(
                    (indicator, indicatorIndex) => {
                        let url = `indicators/${indicator}`;
    
                        fetch(url, {
                            headers: {
                                Authorization: `Basic ${btoa('albertagoya@gmail.com:Pa$$word1')}`,
                            }
                        })
                        .then(response => response.json())
                        .then(
                            result => {
                                indicatorsNamesDuplicate[indicatorIndex] = result.displayName;
                                setIndicatorsNames(indicatorsNamesDuplicate);
                            }
                        );
                    }
                );
            }
        },[indicators]
    );

    //state variable that holds the rows sorted by org unit
    const [rowsPerOrg, setRowsPerOrg] = useState([]);

    //populate the rows per org unit state variable when data is ready
    useEffect(
        () => {
            if(rows.length){
                let rowsPerOrgDuplicate = [];
                let sortedRows = []

                orgUnits.forEach(
                    (orgUnit, orgIndex) => {
                        
                        rows.forEach(
                            (row) => {
                                if(row[1] === orgUnit){
                                    sortedRows = [...sortedRows, row];
                                }
                            }
                        );

                        rowsPerOrgDuplicate = [...rowsPerOrgDuplicate, sortedRows];
                        sortedRows = [];  
                    }

                );

                setRowsPerOrg(rowsPerOrgDuplicate);
            }

        },[rows]
    );

    //state variable that holds the rows per org per product
    const [rowsPerOrgProduct, setRowsPerOrgProducts] = useState([]);

    //populate this state variable when the rows per org is formed
    useEffect(
        () => {
            if(rowsPerOrg.length){
                let RowsPerOrgProductDuplicate = [];
                // let rowsPerOrgDuplicate = rowsPerOrg;
                let productPerOrg = []

                rowsPerOrg.forEach(
                    (orgUnit) => {
                        let currentOrgDuplicate = orgUnit;
                        let currentProduct = [];
                                                
                        while(currentOrgDuplicate.length > 0){
                            currentProduct = currentOrgDuplicate.slice(0, months.length);
                            productPerOrg = [...productPerOrg, currentProduct];
                            currentOrgDuplicate.splice(0,months.length);
                        }

                        RowsPerOrgProductDuplicate = [...RowsPerOrgProductDuplicate, productPerOrg];
                        productPerOrg = [];
                    }
                );
                setRowsPerOrgProducts(RowsPerOrgProductDuplicate);
            }

        },[rowsPerOrg, months]
    );

    // console.log("all data:", allData);
    // console.log("target data format:", rowsPerOrgProduct);
    // console.log("products:", indicators);
    // console.log("product names", indicatorsNames);
    return(
        <></>
    )
}

export default React.memo(Indicator);