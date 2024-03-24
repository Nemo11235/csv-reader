import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function FileDropZone({ onFileDrop }) {
  const sendFile = async () => {
    try {
      let result = await axios.post("http://localhost:3001/handleFile");
    } catch (e) {
      console.log("处理文件时出现错误", e);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      // Execute the callback with the dropped file
      onFileDrop(acceptedFiles[0]);
    },
    [onFileDrop]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".csv",
  });

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
      <p>将文件拖入此处，或点击选择文件</p>
      <input {...getInputProps()} />
    </div>
  );
}

export default FileDropZone;
