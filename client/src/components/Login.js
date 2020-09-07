import React, { Component } from 'react';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Login extends Component {
    state = {
        email: "",
        password: "",
        success: false,
        loginError: ""
    }

    componentDidMount() {
        console.log("admin@bookshop.ba")
        console.log("adminpass")
    }
    render() {
        const { email, password, loginError } = this.state
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

                    <div style={{ marginBottom: "40px", fontSize: "30px" }}>Login</div>


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
                    {loginError
                        ? <div style={{ fontSize: "16px", color: "red", marginTop: "10px" }}>{loginError}</div>
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
        this.setState({ [e.target.name]: e.target.value, loginError: "" });
    }

    submitHandler = (e) => {
        const { email, password } = this.state
        e.preventDefault()

        Axios.post(`http://localhost:4000/login`, { email, password }).then(response => {

            localStorage.setItem('jwt', response.data.token);
            localStorage.setItem('user_type', response.data.user_type);

            toast.success("Successfully loged in")

            setTimeout(() => this.props.history.push('/home'), 2000)

        }).catch(err => {

            let message = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : "Unknown error. Please try again later"

            toast.error(message)

            this.setState({ loginError: message });

        })

    }
}

export default Login;