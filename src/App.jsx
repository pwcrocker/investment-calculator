import { useState, useEffect } from 'react';
import investImg from './assets/investment-calculator-logo.png';
import Table from './components/Table';
import { calculateInvestmentResults, formatter } from './util/investment';
import Header from './components/Header';
import InputSection from './components/InputSection';

const INITIAL_INVESTMENT_STR = "initialInvestment";
const ANNUAL_INVESTMENT_STR = "annualInvestment";
const EXPECTED_RETURN_STR = "expectedReturn";
const DURATION_STR = "duration";

const INPUT_SECTION_METADATA = {
  [INITIAL_INVESTMENT_STR]: {
    label: "Initial Investment",
    step: "1000",
    min: "0",
    max: "1000000",
  },
  [ANNUAL_INVESTMENT_STR]: {
    label: "Annual Investment",
    step: "1000",
    min: "0",
    max: "1000000",
  },
  [EXPECTED_RETURN_STR]: {
    label: "Expected Return",
    step: "0.5",
    min: "0",
    max: "200",
  },
  [DURATION_STR]: {
    label: "Duration",
    step: "1",
    min: "0",
    max: "200",
  },
}

const TABLE_METADATA = {
  "0": {
    name: "year",
    displayName: "Year",
    keyCandidate: true
  },
  "1": {
    name: "valueEndOfYear",
    displayName: "Investment Value",
    formatter: formatter.format
  },
  "2": {
    name: "interest",
    displayName: "Interest (Year)",
    formatter: formatter.format
  },
  "3": {
    name: "totalInterest",
    displayName: "Total Interest",
    formatter: formatter.format
  },
  "4": {
    name: "totalInvestedCapital",
    displayName: "Invested Capital",
    formatter: formatter.format
  },
};

function App() {
  const [investParams, setInvestParams] = useState({
    [INITIAL_INVESTMENT_STR]: 15000,
    [ANNUAL_INVESTMENT_STR]: 900,
    [EXPECTED_RETURN_STR]: 5.5,
    [DURATION_STR]: 12
  });

  const [derivedTableData, setDerivedTableData] = useState(null);

  useEffect(() => {
    if (investParams && readyToCalculate())
      setDerivedTableData(() => {
        const results = calculateInvestmentResults(investParams);
        results.map((resultEntry, index) => {
          resultEntry.totalInterest = (index > 0 ? resultEntry.interest + results[index - 1].totalInterest : resultEntry.interest);
          resultEntry.totalInvestedCapital = resultEntry.year * resultEntry.annualInvestment + investParams.initialInvestment;
        });
        return results;
      });
    else if (!readyToCalculate())
      setDerivedTableData(() => null);
  }, [investParams]);

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setInvestParams((prevInvestParams) => {
      return { ...prevInvestParams, [id]: Number(value === '' ? 0 : value) };
    });
  }

  // make sure all the investment parameters are set before attemting to calc results
  const readyToCalculate = () => {
    const filteredParams = Object.keys(investParams)
      .map(key => investParams[key])
      .filter(paramValue => paramValue && paramValue !== '' && paramValue > 0);

    return filteredParams.length >= 4;
  }

  return (<>
    <Header id="header" title="Investment Calculator" imgSrc={investImg} alt="investment image" />
    <InputSection investParams={investParams} onChangeHandler={handleInputChange} inputMetadata={INPUT_SECTION_METADATA}/>
    <Table tableMetadata={TABLE_METADATA} tableData={derivedTableData} />
  </>
  )
}

export default App;
