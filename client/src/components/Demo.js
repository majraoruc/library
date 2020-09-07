import React, { Component } from 'react'
import Axios from 'axios';

class Demo extends Component {
    componentDidMount = () => {
        Axios.get('http://localhost:4000/books').then(response => {
            console.log(response.data);
        });
    }

    render() {
        return (
            <h1>
                Good luck on the exam. :
            </h1>
        )
    }
}

export default Demo;
