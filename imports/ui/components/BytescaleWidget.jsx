import React from 'react';
import { UploadDropzone } from "@bytescale/upload-widget-react";

const BytescaleWidget = ({ onUpload, accept, initialUrl }) => {
  const options = {
    apiKey: "public_223k2HsCqgSwzuimeQDZjvxhXFw2",
    maxFileCount: 1,
    editor: {
      images: {
        crop: false,
      }
    },
    mimeTypes: accept ? [accept] : ["image/*"],
    onComplete: files => {
      if (files.length > 0) {
        onUpload(files[0].fileUrl);
      }
    }
  };

  return (
    <UploadDropzone options={options} onUpdate={({ uploadedFiles }) => {
      if (uploadedFiles.length > 0) {
        onUpload(uploadedFiles[0].fileUrl);
      }
    }} />
  );
};

export default BytescaleWidget;
