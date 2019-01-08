import React from 'react';

export default function Upload(props) {

    return (
    <div id="upload-wrapper">
        <div id="upload">
            Upload your photo
        </div>
        <input
            name="file"
            id="file"
            type="file"
            accept="image/*"
            onChange={props.onChange}
        />
        <label className="uploader-label"   htmlFor="file">upload</label>
    </div>
    )

}
