import FileDropZone from "./FileDropZone";
import "./App.scss";
import React, { useState, useCallback } from "react";

function App() {
  const [response, setResponse] = useState("这里");

  const handleFileDrop = useCallback((result) => {
    console.log("接收到了", result);
    setResponse(result);

    // 在这里可以处理接收到的文件列表，或者将信息传递到主页面的其他组件
  }, []);

  return (
    <div className="App">
      <header className="App-header"></header>
      <FileDropZone onFileDrop={handleFileDrop} />
      <h1>{response}</h1>
    </div>
  );
}

export default App;
