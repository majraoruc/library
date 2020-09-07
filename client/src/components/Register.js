import React, { Component } from 'react';
import Axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Register extends Component {
    state = {
        name: "",
        email: "",
        password: "",
        success: false,
        registerError: ""
    }

    componentDidMount() {
        console.log("admin@bookshop.ba")
        console.log("adminpass")
    }
    render() {
        const { name, email, password, registerError } = this.state
        return (
            <div>
                <form style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "40%",
                    maxWidth: "400px",
                    minWidth: "200px",
                    margin: "100px auto 0 auto",
                    fontSize: "20px"
                }}
                    onSubmit={this.submitHandler}
                >

                    <div style={{ marginBottom: "40px", fontSize: "30px" }}>Register</div>

                    <div style={{ display: "flex", flexDirection: "column", marginBottom: "20px" }}>
                        <label>Enter name</label>
                        <input
                            onChange={this.onChangeHandler}
                            value={name}
                            name="name"
                            style={{ fontSize: "20px", padding: "10px" }}
                            placeholder="name"></input>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", marginBottom: "20px" }}>
                        <label>Enter email</label>
                        <input
                            onChange={this.onChangeHandler}
                            value={email}
                            name="email"
                            style={{ fontSize: "20px", padding: "10px" }}
                            placeholder="email"></input>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", marginBottom: "20px" }}>
                        <label>Enter password</label>
                        <input
                            onChange={this.onChangeHandler}
                            value={password}
                            name="password"
                            style={{ fontSize: "20px", padding: "10px" }}
                            type="password"
                            placeholder="password"></input>
                    </div>
                    <button
                        style={{ fontSize: "20px", padding: "10px", cursor: "pointer" }}
                        type="submit">Submit</button>
                    {registerError
                        ? <div style={{ fontSize: "16px", color: "red", marginTop: "10px" }}>{registerError}</div>
                        : null
                    }
                </form>

                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={true}
                    newestOnTop={true}
                />

            </div>
        );
    }

    onChangeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value, registerError: "" });
    }

    submitHandler = (e) => {
        const { name, email, password } = this.state
        e.preventDefault()

        Axios.post(`http://localhost:4000/register`, { name, email, password }).then(response => {

            toast.success("Successfully registered")

            setTimeout(() => this.props.history.push('/home'), 2000)


        }).catch(err => {

            let message = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : "Unknown error. Please try again later"
            toast.error(message)
            this.setState({ registerError: message });

        })

    }
}

export default Register;