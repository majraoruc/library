import React, { Component } from 'react';
import Axios from 'axios';
import jwtDecode from 'jwt-decode'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import BookCard from "./BookCard"
import Button from "./AdmissionButton"
import BooksCount from "./BooksCount"

class DisplayBooks extends Component {
    state = {
        books: [],
        limit: 2,
        skip: 0,
        count: 0,
        serverError: "",
        userInfo: "",
        isUserLogedIn: false,
    }

    componentDidMount = () => {
        this.getBooks()
        this.getBookCount()
        this.getLogedUserInfo()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.limit !== this.state.limit || prevState.skip !== this.state.skip) this.getBooks()
    }


    render() {
        const { books, limit, count, serverError, userInfo, isUserLogedIn } = this.state

        let currentPage = this.calculateCurrentPage()
        let totalPages = this.calculateTotalPages()
        let disablePreviousButton = this.disablePreviousButton()
        let disableNextButton = this.disableNextButton()

        return (
            <div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ fontSize: "30px", paddingLeft: "20px" }}>
                            BOOK STORE
                        </div>

                    </div>
                    {!isUserLogedIn
                        ? <div style={{ display: "flex" }}>
                            <Button name="Login" onClick={this.loginHandler} />
                            <Button name="Register" onClick={this.registerHandler} />
                        </div>
                        : <Button name="Logout" onClick={this.logoutHandler} />
                    }
                </div>

                <BooksCount count={count} />


                <div style={{ padding: "20px", display: "flex" }}>
                    <div style={{ display: "flex" }}>
                        <div style={{ marginRight: "10px" }} > Books per page</div>
                        <select name="limit" value={limit} onChange={this.handleLimitChange}>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", marginLeft: "50px" }}>
                        <div
                            style={{ cursor: disablePreviousButton ? "default" : "pointer", border: "1px solid grey", backgroundColor: disablePreviousButton ? "grey" : "white" }}
                            onClick={this.handlePreviousPage}>Previous page</div>
                        <div style={{ margin: "0 10px" }}>({currentPage}) / ({totalPages})</div>
                        <div
                            style={{ cursor: disableNextButton ? "default" : "pointer", border: "1px solid grey", backgroundColor: disableNextButton ? "grey" : "white" }}
                            onClick={this.handleNextPage}>Next page</div>
                    </div>
                </div>

                {serverError
                    ? <div style={{ fontSize: "16px", color: "red", marginTop: "10px" }}>{serverError}</div>
                    : null
                }


                <div style={{ padding: "20px", display: "flex", flexWrap: "wrap" }}>
                    {
                        books.map(book => <BookCard key={book._id} book={book} onClick={this.viewBookHandler} />)
                    }
                </div>

                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={true}
                    newestOnTop={true}
                />

            </div >
        );
    }

    handleLimitChange = (e) => {
        this.setState({ [e.target.name]: parseInt(e.target.value), skip: 0 });
    }

    calculateCurrentPage = () => {
        const { limit, skip } = this.state

        return (Math.floor(skip / limit)) + 1
    }

    calculateTotalPages = () => {
        const { limit, count } = this.state

        return (Math.floor(count / limit))
    }

    handlePreviousPage = () => {
        const { limit, skip } = this.state

        let previousPageSkip = (skip - limit)

        !this.disablePreviousButton() && this.setState({ skip: previousPageSkip });
    }

    handleNextPage = () => {
        const { limit, skip } = this.state

        let nextPageSkip = skip + limit

        !this.disableNextButton() && this.setState({ skip: nextPageSkip });
    }

    disablePreviousButton = () => {
        const { limit, skip } = this.state
        let previousPageSkip = (skip - limit)
        if (previousPageSkip === 0 || previousPageSkip > 0) return false
        else return true
    }

    disableNextButton = () => {
        const { limit, skip, count } = this.state

        let nextPageSkip = skip + limit

        if (nextPageSkip < count) return false
        else return true
    }

    getBooks = () => {

        let skip = this.state.skip ? this.state.skip : 0
        let limit = this.state.limit ? this.state.limit : 5

        this.getBookCount()

        Axios.get(`http://localhost:4000/books?skip=${skip}&limit=${limit}`).then(response => {
            this.setState({ books: response.data });
        }).catch(err => {
            console.log(err)
            console.log(err.response)

            let message = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : "Unknown error. Please try again later"
            toast.error(message)
            this.setState({ serverError: message });
        })

    }

    getBookCount = () => {
        Axios.get(`http://localhost:4000/books/count`).then(response => {
            this.setState({ count: response.data.book_count });
        }).catch(err => {
            console.log(err)
            console.log(err.response)

            let message = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : "Unknown error. Please try again later"
            toast.error(message)
            this.setState({ serverError: message });
        })
    }

    viewBookHandler = (id) => {
        this.props.history.push(`/book/${id}`)
    }

    loginHandler = () => {
        this.props.history.push('/login')
    }

    registerHandler = () => {
        this.props.history.push('/register')
    }

    logoutHandler = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user_type');
        window.location.reload(false);
    }

    getLogedUserInfo = () => {
        let token = localStorage.getItem('jwt')
        if (token) {
            let decoded = jwtDecode(token)
            this.setState({ userInfo: { email: decoded.email, id: decoded._id }, isUserLogedIn: true });
        }
    }
}

export default DisplayBooks;