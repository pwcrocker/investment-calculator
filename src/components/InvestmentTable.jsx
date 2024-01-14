import { formatter } from "../util/investment";

const InvestmentTable = ({ id = "result", tableMetadata, tableData = [] }) => {
  const getTableHeader = () => (
    <tr>
      {tableMetadata && Object.keys(tableMetadata).map(
        (key, index) => (
          <th key={tableMetadata[index]?.displayName + "Head"}>
            {tableMetadata[index].displayName}
          </th>
        )
      )}
    </tr>
  );

  const getTableCell = (dataRow) => {
    return tableMetadata && Object.keys(tableMetadata).map(
      (key, index) => {
        const colName = tableMetadata[index].name;
        const cellValue = dataRow[colName];
        return (
          <td key={dataRow.year + colName}>{colName !== "year" ? formatter.format(cellValue) : cellValue}</td>
        )
      }
    );
  }

  const getTableBody = () => {
    return tableData && tableData.map((dataRow) => {
      return (
        <tr key={dataRow.year + "Row"}>
          {getTableCell(dataRow)}
        </tr>
      );
    });
  };

  return (tableData?.length > 0 &&
    <table id={id}>
      <thead>
        {getTableHeader()}
      </thead>
      <tbody>
        {getTableBody()}
      </tbody>
    </table>
  )
};

export default InvestmentTable;
