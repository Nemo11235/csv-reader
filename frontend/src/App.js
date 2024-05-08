import FileDropZone from "./FileDropZone";
import "./App.scss";
import React, { useState, useCallback } from "react";

function App() {
  const [response, setResponse] = useState([]); // store user input data
  const [rowSets, setRowSets] = useState(new Set());
  const [validMoistDiff, setMoistDiff] = useState(1); // allowed moist diff +-
  const [hideZero, setHideZero] = useState(false);
  const [validEcDrop, setEcDrop] = useState(0.5); // allowed ec diff +-
  const [showData, setShowData] = useState(true); // show data read from file or not
  const [badCells, setBadCells] = useState(new Set());

  function clearAll() {
    setBadCells(new Set());
    setRowSets(new Set());
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
      } else if (response[0][i].includes("EC")) {
        ecColumns.push(i);
      }
    }
    // 5 对应12:10 - 12:50共五个时间点
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < moistColumns.length; j++) {
        let first = parseFloat(rows1230[i][moistColumns[j]]);
        let second = parseFloat(rows1230[i + 10][moistColumns[j]]);
        let third = parseFloat(rows1230[i + 20][moistColumns[j]]);
        let avgDiff = (third - avg(first, second)).toFixed(2);
        let date1 = rows1230[i][0].split(" ");
        let date2 = rows1230[i + 10][0].split(" ");
        let date3 = rows1230[i + 20][0].split(" ");

        let dataArr = [
          response[0][moistColumns[j]],
          date1[0] + " " + date1[1] + ": " + first,
          date2[0] + " " + date1[1] + ": " + second,
          date3[0] + " " + date1[1] + ": " + third,
          avgDiff,
        ];
        if (hideZero && (first === 0 || second === 0 || third === 0)) continue;
        if (Math.abs(avgDiff) > validMoistDiff) {
          // 时间戳，测量仪名称，数据
          if (!rowSets.has(response[0][moistColumns[j]])) {
            rowSets.add(response[0][moistColumns[j]]);
            badCells.add(dataArr);
          } else {
            badCells.forEach((array) => {
              if (
                array.includes(response[0][moistColumns[j]]) &&
                array[4] < avgDiff
              ) {
                badCells.delete(array);
                badCells.add(dataArr);
              }
            });
          }
        }
      }
    }

    // 分析2:30
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < moistColumns.length; j++) {
        const first = parseFloat(rows230[i][moistColumns[j]]);
        const second = parseFloat(rows230[i + 10][moistColumns[j]]);
        const third = parseFloat(rows230[i + 20][moistColumns[j]]);
        const avgDiff = (avg(first, second) - third).toFixed(2);
        let date1 = rows1230[i][0].split(" ");
        let date2 = rows1230[i + 10][0].split(" ");
        let date3 = rows1230[i + 20][0].split(" ");
        let dataArr = [
          response[0][moistColumns[j]],
          date1[0] + ": " + first,
          date2[0] + ": " + second,
          date3[0] + ": " + third,
          avgDiff,
        ];
        if (hideZero && (first === 0 || second === 0 || third === 0)) continue;
        if (avgDiff > validMoistDiff) {
          if (Math.abs(avgDiff) > validMoistDiff) {
            // 时间戳，测量仪名称，数据
            if (!rowSets.has(response[0][moistColumns[j]])) {
              rowSets.add(response[0][moistColumns[j]]);
              badCells.add(dataArr);
            } else {
              badCells.forEach((array) => {
                if (
                  array.includes(response[0][moistColumns[j]]) &&
                  array[4] < avgDiff
                ) {
                  badCells.delete(array);
                  badCells.add(dataArr);
                }
              });
            }
          }
        }
      }
    }

    // // 分析ec 12:30ec
    // for (let i = 0; i < 10; i++) {
    //   for (let j = 0; j < ecColumns.length; j++) {
    //     const first = parseFloat(rows1230[i][ecColumns[j]]);
    //     const second = parseFloat(rows1230[i + 10][ecColumns[j]]);
    //     const third = parseFloat(rows1230[i + 20][ecColumns[j]]);
    //     const avgDiff = (avg(first, second) - third).toFixed(2);
    //     if (avgDiff > validEcDrop) {
    //       badCells.add([
    //         rows1230[i + 20][0],
    //         response[0][ecColumns[j]],
    //         first,
    //         second,
    //         third,
    //         -avgDiff,
    //       ]);
    //     }
    //   }
    // }

    // // ec 2:30
    // for (let i = 0; i < 10; i++) {
    //   for (let j = 0; j < ecColumns.length; j++) {
    //     const first = parseFloat(rows230[i][ecColumns[j]]);
    //     const second = parseFloat(rows230[i + 10][ecColumns[j]]);
    //     const third = parseFloat(rows230[i + 20][ecColumns[j]]);
    //     const avgDiff = (avg(first, second) - third).toFixed(2);
    //     if (avgDiff > validEcDrop) {
    //       badCells.add([
    //         rows230[i + 20][0],
    //         response[0][ecColumns[j]],
    //         first,
    //         second,
    //         third,
    //         -avgDiff,
    //       ]);
    //     }
    //   }
    // }
  };

  const onShowData = () => {
    setShowData(!showData);
  };

  const [moistInput, setMoistInput] = useState(1);
  const onMoistChangeClick = (event) => {
    setMoistInput(parseFloat(event.target.value));
  };

  const handleChangeMoistDiff = () => {
    setMoistDiff(moistInput);
  };

  const [ecInput, setEcInput] = useState(1);
  const onEcChangeClick = (event) => {
    setEcInput(parseFloat(event.target.value));
  };

  const handleChangeEcDiff = () => {
    setEcDrop(ecInput);
  };

  const onHideZeroClick = () => {
    setHideZero(!hideZero);
  };

  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="console-div">
        <FileDropZone onFileDrop={handleFileDrop} />
        <div
          className="right-div"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div className="btn-div">
            <button className="analyze-btn" onClick={onAnalyze}>
              分析
            </button>
            <button className="analyze-btn" onClick={onShowData}>
              {showData ? "隐藏完整数据" : "显示完整数据"}
            </button>
            <button className="analyze-btn" onClick={() => clearAll()}>
              清空数据
            </button>
          </div>
          <div className="set-range-div">
            <input
              className="moist-input"
              type="int"
              onChange={onMoistChangeClick}
              placeholder="此处输入湿度的正负误差值"
            ></input>
            <button className="analyze-btn" onClick={handleChangeMoistDiff}>
              修改湿度误差值
            </button>
            <input
              className="moist-input"
              type="int"
              onChange={onEcChangeClick}
              placeholder="此处输入EC的正负误差值"
            ></input>
            <button className="analyze-btn" onClick={handleChangeEcDiff}>
              修改EC误差值
            </button>
          </div>
          {hideZero ? (
            <button style={{ marginLeft: "10px" }} onClick={onHideZeroClick}>
              保留带有0的数据行（点击后需清空数据再点分析以使其生效）
            </button>
          ) : (
            <button style={{ marginLeft: "10px" }} onClick={onHideZeroClick}>
              忽略带有0的数据行（点击后需清空数据再点分析以使其生效）
            </button>
          )}
        </div>
      </div>
      {showData && (
        <div className="data-div">
          <h1>早晚12:10 - 12:50数据：</h1>

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

          <h1>早晚2:10 - 2:50数据：</h1>
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
        </div>
      )}
      <table className="data-table">
        <thead>
          <tr>
            <th>探测器编号</th>
            <th>第一天数据</th>
            <th>第二天数据</th>
            <th>第三天数据</th>
            <th>差值</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(badCells).map((array, index) => (
            <tr key={index}>
              {array.map((item, subIndex) => (
                <td key={subIndex}>{item}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* <h1>早晚12:30湿度误差过大的行数： </h1>

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

      <h1>早晚2:30湿度误差过大的行数：</h1>

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
      <h1>早晚12:30EC误差过大的行数：</h1>

      <table className="data-table">
        <tbody>
          {ecBadRows.length > 0 && (
            <tr>
              {response[0].map((column, columnIndex) =>
                setEc.has(columnIndex) ? (
                  <th key={columnIndex}>{column}</th>
                ) : null
              )}
            </tr>
          )}
          {ecBadRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((column, columnIndex) =>
                setEc.has(columnIndex) ? (
                  <td key={columnIndex}>{column}</td>
                ) : null
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <h1>早晚2:30EC误差过大的行数：</h1>

      <table className="data-table">
        <tbody>
          {ecBadRows2.length > 0 && (
            <tr>
              {response[0].map((column, columnIndex) =>
                setEc2.has(columnIndex) ? (
                  <th key={columnIndex}>{column}</th>
                ) : null
              )}
            </tr>
          )}
          {ecBadRows2.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((column, columnIndex) =>
                setEc2.has(columnIndex) ? (
                  <td key={columnIndex}>{column}</td>
                ) : null
              )}
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
}

export default App;
