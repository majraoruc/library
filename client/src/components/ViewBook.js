import React, { Component } from 'react';
import Axios from 'axios';
import jwtDecode from 'jwt-decode'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Button from "./NormalButton"

class ViewBook extends Component {

    state = {
        book: null,
        userInfo: {},
        isUserLogedIn: false,
    }

    componentDidMount = () => {
        this.getBook()
        this.getLogedUserInfo()
    }

    render() {

        const { book, userInfo, isUserLogedIn } = this.state

        return (
            <div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button name="Home" onClick={this.backHandler} />
                </div>
                {book ?
                    <div style={{ display: "flex", border: "1px solid grey", margin: "20px 10px", boxShadow: "0 2px 2px 0 rgba(0,0,0,.16), 0 0 0 1px rgba(0,0,0,.08)" }}>
                        <div style={{ padding: "5px" }}>
                            <img src={book.cover} style={{ maxHeight: "500px", maxWidth: "500px", border: "1px solid grey" }} alt="cover" />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "20px 10px" }}>
                            <div>Name: {book.name}</div>
                            <div>Author: {book.author}</div>
                            <div>Publication year: {book.publication_year}</div>
                            <div>In stock: {book.in_stock}</div>

                            <div style={{ margin: "50px 0 20px 0" }}>Summary</div>
                            <div style={{ display: "flex", flexGrow: "1" }}>
                                {book.summary}
                            </div>

                            {isUserLogedIn ?
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    {book.checked_out
                                        ? book.reader === userInfo.id
                                            ? <Button name="Return" onClick={this.handleReturn} />
                                            : <div>Book is already checked out by someone else</div>
                                        : <Button name="Checkout" onClick={this.handleCheckout} />
                                    }

                                </div>
                                : null}
                        </div>
                    </div>
                    : <div>Loading</div>}

                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={true}
                    newestOnTop={true}
                />

            </div>
        );
    }

    backHandler = () => {
        this.props.history.push('/home')
    }

    getBook = () => {

        let bookId = this.props.match.params.id || 0

        Axios.get(`http://localhost:4000/books/${bookId}`).then(response => {
            this.setState({ book: response.data });
        }).catch(err => {
            console.log(err)
            console.log(err.response)

            let message = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : "Unknown error. Please try again later"
            toast.error(message)
            this.setState({ serverError: message });
        })

    }

    getLogedUserInfo = () => {
        let token = localStorage.getItem('jwt')
        if (token) {
            let decoded = jwtDecode(token)
            this.setState({ userInfo: { email: decoded.email, id: decoded._id }, isUserLogedIn: true });
        }
    }

    handleCheckout = () => {

        let bookId = this.props.match.params.id || 0
        let userId = this.state.userInfo && this.state.userInfo.id ? this.state.userInfo.id : 0

        Axios.get(`http://localhost:4000/books/${bookId}/checkout/${userId}`).then(response => {
            let message = response.data.message || "Unknown error. Please try again later"
            toast.success(message)
            this.getBook()
        }).catch(err => {
            console.log(err)
            console.log(err.response)

            let message = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : "Unknown error. Please try again later"
            toast.error(message)
            this.setState({ serverError: message });
        })

    }

    handleReturn = () => {

        let bookId = this.props.match.params.id || 0
        let userId = this.state.userInfo && this.state.userInfo.id ? this.state.userInfo.id : 0

        Axios.get(`http://localhost:4000/books/${bookId}/return/${userId}`).then(response => {
            let message = response.data.message || "Unknown error. Please try again later"
            toast.success(message)
            this.getBook()
        }).catch(err => {
            console.log(err)
            console.log(err.response)

            let message = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : "Unknown error. Please try again later"
            toast.error(message)
            this.setState({ serverError: message });
        })

    }
}

export default ViewBook;