import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function FileDropZone({ onFileDrop }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      // 如果定义了onFileDrop回调函数，则调用它并传递接收的文件列表
      onFileDrop("hahaa");
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
