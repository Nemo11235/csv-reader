import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function FileDropZone({ onFileDrop }) {
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
        border: "1px dashed #ccc",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input {...getInputProps()} />
      <p>Drag & drop CSV file here, or click to select file</p>
    </div>
  );
}

export default FileDropZone;
