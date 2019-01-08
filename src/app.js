import React from 'react';
import Upload from './upload';
import axios from '../axios';


export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            uploading: false,
            image: []
        };

        this.onChange = this.onChange.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
    };


    onChange(e) {
        e.preventDefault();
        console.log(e.target.files);

        let file = e.target.files[0];

        const fd = new FormData();
        fd.append('file', file);

        axios.post('/upload', fd)
            .then(res => res.json())
            .then(image => {
                this.setState({
                    uploading: false,
                    image
                })
            })
    }

    deleteImage() {
       this.setState({
           image: []
       })
   }




    render() {

        const { image, uploading } = this.state;

        if (!image.id) {
            return(
                <Upload onChange={this.onChange}/>
            );
        }

        return(
            <Image onClick={this.deleteImage}/>

        );
    }
}
