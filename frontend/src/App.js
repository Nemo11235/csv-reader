import FileDropZone from "./FileDropZone";
import "./App.scss";
import React, { useState, useCallback } from "react";

function App() {
  const [response, setResponse] = useState([]); // store user input data
  const [moistBadRows, setMoistBadRows] = useState([]); // rows not meeting moisture requirements around 12:30 am/pm
  const [moistBadRows2, setMoistBadRows2] = useState([]); // rows not meeting moisture requirements around 2:30 am/pm
  const [validMoistDiff, setMoistDiff] = useState(1); // allowed moist diff +-
  const [validECDiff, setECDiff] = useState(1); // allowed ec diff +-
  const [showData, setShowData] = useState(true); // show data read from file or not
  const [set, setSet] = useState(new Set()); // columns indices that doesn't meet moisture requirements around 12:30 am/pm
  const [set2, setSet2] = useState(new Set()); // columns indices that doesn't meet moisture requirements around 2:30 am/pm
  set2.add(0); // must show first col timestamp
  set.add(0); // must show first col timestamp

  function clearAll() {
    setSet(new Set());
    setSet2(new Set());
    setMoistBadRows([]);
    setMoistBadRows2([]);
  }

  const handleFileDrop = useCallback((result) => {
    clearAll();
    setResponse(result);
  }, []);

  function validRow(row, index, array, keyString, upper, lower) {
    if (row[0].includes(keyString)) return true;
    for (let i = index - upper; i < index + lower + 1; i++) {
      if (i > 0 && i < array.length && array[i][0].includes(keyString))
        return true;
    }
    return false;
  }

  function avg(a, b) {
    return (a + b) / 2;
  }

  const onAnalyze = () => {
    // clearAll();
    const allowedMoistDiff = 1;

    const rows1230 = response
      .filter((row, index, array) => validRow(row, index, array, "12:30", 2, 2))
      .map((row) => row);

    const rows230 = response
      .filter((row, index, array) => validRow(row, index, array, "02:30", 2, 2))
      .map((row) => row);

    const moistColumns = [];
    const ecColumns = [];

    for (let i = 0; i < response[0].length; i++) {
      if (response[0][i].includes("Mois")) {
        moistColumns.push(i);
      } else {
        ecColumns.push(i);
      }
    }
    // 5 对应12:10 - 12:50共五个时间点
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < moistColumns.length; j++) {
        const first = parseInt(rows1230[i][moistColumns[j]]);
        const second = parseInt(rows1230[i + 10][moistColumns[j]]);
        const third = parseInt(rows1230[i + 20][moistColumns[j]]);
        const avgDiff = Math.abs(avg(first, second) - third);
        if (avgDiff > allowedMoistDiff) {
          setMoistBadRows([
            ...moistBadRows,
            rows1230[i],
            rows1230[i + 10],
            rows1230[i + 20],
          ]);
          set.add(moistColumns[j]);
        }
      }
    }
    // 分析2:30
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < moistColumns.length; j++) {
        const first = parseInt(rows230[i][moistColumns[j]]);
        const second = parseInt(rows230[i + 10][moistColumns[j]]);
        const third = parseInt(rows230[i + 20][moistColumns[j]]);
        const avgDiff = Math.abs(avg(first, second) - third);
        if (avgDiff > allowedMoistDiff) {
          setMoistBadRows2([
            ...moistBadRows2,
            rows230[i],
            rows230[i + 10],
            rows230[i + 20],
          ]);
          set2.add(moistColumns[j]);
        }
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header"></header>
      <FileDropZone onFileDrop={handleFileDrop} />
      <button onClick={onAnalyze}>analyze</button>
      {response.length !== 0 && <h1>早晚12:10 - 12:50数据：</h1>}

      <table className="data-table">
        <tbody>
          {response.length > 0 && (
            <tr>
              {response[0].map((column, columnIndex) => (
                <th key={columnIndex}>{column}</th>
              ))}
            </tr>
          )}
          {response
            .filter((row, index, array) =>
              validRow(row, index, array, "12:30", 2, 2)
            )
            .map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((column, columnIndex) => (
                  <td key={columnIndex}>{column}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      {response.length !== 0 && <h1>早晚2:10 - 2:50数据：</h1>}
      <table className="data-table">
        <tbody>
          {response.length > 0 && (
            <tr>
              {response[0].map((column, columnIndex) => (
                <th key={columnIndex}>{column}</th>
              ))}
            </tr>
          )}
          {response
            .filter((row, index, array) =>
              validRow(row, index, array, "02:30", 2, 2)
            )
            .map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((column, columnIndex) => (
                  <td key={columnIndex}>{column}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>

      <h1>Moisture 12:30 Problem Rows: </h1>

      <table className="data-table">
        <tbody>
          {moistBadRows.length > 0 && (
            <tr>
              {response[0].map((column, columnIndex) =>
                set.has(columnIndex) ? (
                  <th key={columnIndex}>{column}</th>
                ) : null
              )}
            </tr>
          )}
          {moistBadRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((column, columnIndex) =>
                set.has(columnIndex) ? (
                  <td key={columnIndex}>{column}</td>
                ) : null
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <h1>Moisture 2:30 Problem Rows: </h1>

      <table className="data-table">
        <tbody>
          {moistBadRows2.length > 0 && (
            <tr>
              {response[0].map((column, columnIndex) =>
                set2.has(columnIndex) ? (
                  <th key={columnIndex}>{column}</th>
                ) : null
              )}
            </tr>
          )}
          {moistBadRows2.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((column, columnIndex) =>
                set2.has(columnIndex) ? (
                  <td key={columnIndex}>{column}</td>
                ) : null
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
