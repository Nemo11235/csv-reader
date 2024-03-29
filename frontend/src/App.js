import FileDropZone from "./FileDropZone";
import "./App.scss";
import React, { useState, useCallback } from "react";

function App() {
  const [response, setResponse] = useState([]);
  const [problemRows, setProblemRows] = useState([]);
  const [set, setSet] = useState(new Set());
  set.add(0);

  const handleFileDrop = useCallback((result) => {
    setResponse(result);

    // 在这里可以处理接收到的文件列表，或者将信息传递到主页面的其他组件
  }, []);

  function validRow(row, index, array, keyString, upper, lower) {
    if (row[0].includes(keyString)) return true;
    for (let i = index - upper; i < index + lower + 1; i++) {
      if (i > 0 && i < array.length && array[i][0].includes(keyString))
        return true;
    }
    return false;
  }

  const onAnalyze = () => {
    const rows1230 = response
      .filter((row, index, array) => validRow(row, index, array, "12:30", 2, 2))
      .map((row) => row);

    const rows230 = response
      .filter((row, index, array) => validRow(row, index, array, "2:30", 2, 2))
      .map((row) => row);

    const moistColumns = [];
    for (let i = 0; i < response[0].length; i++) {
      if (response[0][i].includes("Mois")) {
        moistColumns.push(i);
      }
    }

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < moistColumns.length; j++) {
        const first = Number(rows1230[i][moistColumns[j]]);
        const second = Number(rows1230[i + 10][moistColumns[j]]);
        const third = Number(rows1230[i + 20][moistColumns[j]]);
        const avgDiff = Math.abs(((first + second) / 2 - third).toFixed(2));
        // console.log(
        //   "first = " +
        //     first +
        //     ",second: " +
        //     second +
        //     ",third = " +
        //     third +
        //     ",avgDiff = " +
        //     avgDiff
        // );
        if (avgDiff > 1) {
          setProblemRows([
            ...problemRows,
            rows1230[i],
            rows1230[i + 10],
            rows1230[i + 20],
          ]);
          set.add(moistColumns[j]);
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
              validRow(row, index, array, "2:30", 2, 2)
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

      <h1>Problem Rows: </h1>

      <table className="data-table">
        <tbody>
          {problemRows.length > 0 && (
            <tr>
              {response[0].map((column, columnIndex) =>
                set.has(columnIndex) ? (
                  <th key={columnIndex}>{column}</th>
                ) : null
              )}
            </tr>
          )}
          {problemRows.map((row, rowIndex) => (
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
    </div>
  );
}

export default App;
