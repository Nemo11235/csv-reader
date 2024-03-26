import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function FileDropZone({ onFileDrop }) {
  function CSVToArray(csvData) {
    const rows = csvData.split("\n");
    const result = [];
    rows.forEach(function (row) {
      result.push(row.split(","));
    });
    return result;
  }

  const onDrop = useCallback(
    (acceptedFiles) => {
      const reader = new FileReader();
      // 处理文件读取完成事件
      reader.onload = function (event) {
        // 读取到的文件数据在 event.target.result 中
        const fileData = event.target.result;
        // 使用 csv-parser 解析 CSV 数据
        const csvArray = CSVToArray(fileData);
        // 调用回调函数，并将解析后的二维数组传递给它
        onFileDrop(csvArray);
      };
      // 读取文件内容
      reader.readAsText(acceptedFiles[0]);
    },
    [onFileDrop]
  );

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
  });
  const files = acceptedFiles.map((file) => (
    <div>
      <p>已接收的文件：</p>
      <p>文件名：{file.name}</p>
      <p>文件类型：{file.type}</p>
    </div>
  ));

  return (
    <div
      {...getRootProps()}
      style={{
        border: "none",
        borderRadius: "3px",
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        justifyContent: "center",
        height: "200px",
        width: "30%",
        boxShadow: "2px 2px 5px 2px rgba(0,0,0,0.4)",
      }}
    >
      <p>将文件拖入此处，或点击此处选择文件</p>
      <input {...getInputProps()} />
      {acceptedFiles && <p>{files}</p>}
    </div>
  );
}

export default FileDropZone;
