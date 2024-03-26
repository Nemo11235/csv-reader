import FileDropZone from "./FileDropZone";
import "./App.scss";
import React, { useState, useCallback } from "react";

function App() {
  const [response, setResponse] = useState([]);

  const handleFileDrop = useCallback((result) => {
    console.log("接收到了", result);
    setResponse(result);

    // 在这里可以处理接收到的文件列表，或者将信息传递到主页面的其他组件
  }, []);

  return (
    <div className="App">
      <header className="App-header"></header>
      <FileDropZone onFileDrop={handleFileDrop} />
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
            .filter((row, index) => row[0].includes("12:30") && index !== 0)
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
  );
}

export default App;
