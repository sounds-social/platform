import React from 'react';
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/dist/react-uploader.css";

const UploadcareWidget = ({ onUpload, accept }) => {
  const handleChange = (info) => {
    // info contains file information, including the CDN URL
    if (info?.allEntries && info?.allEntries[0].cdnUrl) {
      onUpload(info.allEntries[0].cdnUrl);
    }
  };

  return (
    <div className="my-4">
      <FileUploaderRegular 
        pubkey="0340a6630cbea0325452" 
        onChange={handleChange}
        multiple={false}
        accept={accept || 'image/*'}
        clearable />
    </div>
  );
};

export default UploadcareWidget;
