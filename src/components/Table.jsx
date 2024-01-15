
/**
 * Returns a dynamically generated Table component. Structure is informed by tableMetadata.
 * @param {string} id of <table> element
 * @param {Object} tableMetadata is metadata that informs the structure of the table
 *  should agree with the following:
 *    - Object with index keys ("0": {}, "1": {}, ... "n": {}) that imply left-to-right
 *        column ordering
 *    - the objects should have name and displayName specified at minimum
 *        - name informs field to pull in table data
 *        - displayName is corresponding column name
 *    - can also specify a formatter function
 *    - should have at least one index object marked with "keyCandidate": true, which will
 *        be used to create the table row keys (the object marked with this should have a
 *        unique value per row)
 * @param {Array} tableData is an array of objects each of which have properties that responed to name
 *  'name' properties in tableMetadata
 * @param {any} ...props are any other props to be applied to <table> element
 * @returns resulting Table component, if tableData length is greater than 0
 */
const Table = ({ id = "result", tableMetadata, tableData = [], ...props }) => {
  /**
   * Constructs the <thead> element with columns named according to displayName in tableMetadata.
   * @returns the <thead> element
   */
  const getTableHeader = () => (
    <thead>
      <tr>
        {tableMetadata && Object.keys(tableMetadata).map(
          (key, index) => (
            <th key={tableMetadata[index]?.displayName + "Head"}>
              {tableMetadata[index].displayName}
            </th>
          )
        )}
      </tr>
    </thead>
  );

  /**
   * Gets the <td> element populated with data from tableData. Can be formatted with formatter function
   *  provided to tableMetadata.
   * @param {Object} dataRow the current row from tableData
   * @param {string} rowKey is a string guaranteed to be unique per row
   * @returns a <td> element with corresponding data from tableData
   */
  const getTableCell = (dataRow, rowKey) => {
    return tableMetadata && Object.keys(tableMetadata).map(
      (key, index) => {
        const colName = tableMetadata[index].name;
        const cellValue = dataRow[colName];
        const formatter = tableMetadata[index].formatter
        const hasFormatter = typeof formatter === "function";
        return (
          <td key={rowKey + colName}>{hasFormatter ? formatter(cellValue) : cellValue}</td>
        )
      }
    );
  }

  /**
   * Constructs the <tbody> element by iterating through the table data and creating a new row
   *  per data entry. It calls getTableCell() to get the properly constructed cell value.
   * @returns table row with 
   */
  const getTableBody = () => {
    return (<tbody>
      {
        tableData && tableData.map((dataRow, rowIndex) => {
          const rowKeyCandidateIndexes = Object.keys(tableMetadata).filter(
            (key, index) => tableMetadata[index].keyCandidate
          );

          // use rowIndex as last resort
          const uniqueRowProp = rowKeyCandidateIndexes.length > 0 ? tableMetadata[rowKeyCandidateIndexes].name : rowIndex;
          console
          const rowKeyPrefix = dataRow[uniqueRowProp];
          return (
            <tr key={rowKeyPrefix + "Row"}>
              {getTableCell(dataRow)}
            </tr>
          );
        })
      }
    </tbody>)
  };

  return (tableData?.length > 0 &&
    <div>
      <table id={id} {...props}>
        {getTableHeader()}
        {getTableBody()}
      </table>
    </div>
  )
};

export default Table;
