import React from 'react';


export default props => {
    <div id="image-wrapper">
        <div id="image">
            <img src={image.url} />
        </div>

        <div id="controls">
            <div className="confirm">ok</div>
            <div className="cancel" onClick={props.deleteImage} >cancel</div>

        </div>


    </div>

}
