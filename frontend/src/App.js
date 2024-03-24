import FileDropZone from "./FileDropZone";
import "./App.scss";
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [response, setResponse] = useState("");

  const handleInput = async () => {
    try {
      let result = await axios.post("http://localhost:3001/response");
      setResponse(result.data);
    } catch (e) {
      console.error("发生错误", e);
    }
  };
  return (
    <div className="App">
      <header className="App-header"></header>
      <FileDropZone />
      <button onClick={handleInput}>处理</button>
      <h1>{response}</h1>
    </div>
  );
}

export default App;
