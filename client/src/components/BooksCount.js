import React, { Component } from 'react';

class BookCount extends Component {
    render() {
        return (<div style={{ backgroundColor: "beige", margin: "20px 0", padding: "10px 20px" }}>Current book count: {this.props.count}</div>);
    }
}

export default BookCount;