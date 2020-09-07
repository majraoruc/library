import React, { Component } from 'react';

class Button extends Component {
    render() {
        const { name, onClick } = this.props
        return (
            <div
                name={name}
                style={{
                    cursor: "pointer",
                    width: "100px",
                    margin: "10px",
                    padding: "10px 5px",
                    textAlign: "center",
                    color: "white",
                    backgroundColor: name === "Login" ? "#a6d4a6" : name === "Register" ? "#acacda" : "#ee9595",
                    border: name === "Login" ? "1px solid green" : name === "Register" ? "1px solid blue" : "1px solid red",
                    boxShadow: "0 2px 2px 0 rgba(0,0,0,.16), 0 0 0 1px rgba(0,0,0,.08)"
                }}
                onClick={onClick}>{name}</div>
        );
    }
}

export default Button;