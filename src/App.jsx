import { useState, useEffect } from 'react';
import investImg from './assets/investment-calculator-logo.png';
import NumberInput from './components/NumberInput';
import InvestmentTable from './components/InvestmentTable';
import { calculateInvestmentResults } from './util/investment';

const INITIAL_INVESTMENT_STR = "initialInvestment";
const ANNUAL_INVESTMENT_STR = "annualInvestment";
const EXPECTED_RETURN_STR = "expectedReturn";
const DURATION_STR = "duration";

const TABLE_METADATA = {
  "0": {
    name: "year",
    displayName: "Year"
  },
  "1": {
    name: "valueEndOfYear",
    displayName: "Investment Value"
  },
  "2": {
    name: "interest",
    displayName: "Interest (Year)"
  },
  "3": {
    name: "totalInterest",
    displayName: "Total Interest"
  },
  "4": {
    name: "totalInvestedCapital",
    displayName: "Invested Capital"
  },
};

function App() {
  const [investParams, setInvestParams] = useState({
    [INITIAL_INVESTMENT_STR]: '',
    [ANNUAL_INVESTMENT_STR]: '',
    [EXPECTED_RETURN_STR]: '',
    [DURATION_STR]: ''
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

  const readyToCalculate = () => {
    const filteredParams = Object.keys(investParams)
      .map(key => investParams[key])
      .filter(paramValue => paramValue !== '' && paramValue > 0);

    return filteredParams.length >= 4;
  }

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setInvestParams((prevInvestParams) => {
      return { ...prevInvestParams, [id]: Number(value === '' ? 0 : value) };
    });
  }

  return (<>
    <div id="header">
      <img src={investImg} alt="investment image" />
      <h1>Investment Calculator</h1>
    </div>
    <div id="user-input" className="input-group">
      <div>
        <NumberInput id={INITIAL_INVESTMENT_STR} label="Initial Investment" step="1000" min="0" max="1000000"
          onChange={handleInputChange} value={investParams[INITIAL_INVESTMENT_STR] === 0 ? '' : investParams[INITIAL_INVESTMENT_STR]} />
      </div>
      <div>
        <NumberInput id={ANNUAL_INVESTMENT_STR} label="Annual Investment" step="1000" min="0" max="1000000"
          onChange={handleInputChange} value={investParams[ANNUAL_INVESTMENT_STR] === 0 ? '' : investParams[ANNUAL_INVESTMENT_STR]} />
      </div>
      <div>
        <NumberInput id={EXPECTED_RETURN_STR} label="Expected Return" step="0.5" min="0.0" max="1000.0"
          onChange={handleInputChange} value={investParams[EXPECTED_RETURN_STR] === 0 ? '' : investParams[EXPECTED_RETURN_STR]} />
      </div>
      <div>
        <NumberInput id={DURATION_STR} label="Duration" step="1" min="0" max="200"
          onChange={handleInputChange} value={investParams[DURATION_STR] === 0 ? '' : investParams[DURATION_STR]} />
      </div>
    </div>
    <div>
      <InvestmentTable tableMetadata={TABLE_METADATA} tableData={derivedTableData} />
    </div>
  </>
  )
}

export default App;
