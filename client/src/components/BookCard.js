import React, { Component } from 'react';

class BookCard extends Component {
    state = {}
    render() {
        const { book, onClick } = this.props

        return (
            <div style={{ display: "flex", border: "1px solid grey", margin: "20px 10px", width: "350px", boxShadow: "0 2px 2px 0 rgba(0,0,0,.16), 0 0 0 1px rgba(0,0,0,.08)" }}>
                <div style={{ padding: "5px" }}>
                    <img src={book.cover} style={{ maxHeight: "200px", maxWidth: "100px", border: "1px solid grey" }} alt="cover" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "10px 10px", width: "100%" }}>
                    <div>Name: {book.name}</div>
                    <div>Author: {book.author}</div>
                    <div>Publication year: {book.publication_year}</div>
                    <div>In stock: {book.in_stock}</div>
                    <div
                        style={{ textAlign: "center", padding: "5px", cursor: "pointer", backgroundColor: "#acacda", width: "90px", borderRadius: "5px", marginLeft: "auto" }}
                        onClick={() => onClick(book._id)} >View more</div>
                </div>
            </div>
        );
    }
}

export default BookCard;