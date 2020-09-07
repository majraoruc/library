module.exports = (router, db, mongojs) => {

    /**
    * @swagger
    * /books:
    *   get:
    *     tags:
    *       - books
    *     name: getBooks
    *     summary: Get all books in system
    *     parameters:
    *       - name: offset
    *         in: query
    *         description: The offset of the book list.
    *         type: integer
    *         default: 0
    *       - name: limit
    *         in: query
    *         description: The limit of the book list.
    *         type: integer
    *         default: 5
    *     produces:
    *       - application/json
    *     responses:
    *       200:
    *         description: List of all books in the system.
    *       500:
    *         description: Something is wrong with the service. Please contact a system administrator.
    */
    router.get('/books', (req, res) => {
        let limit = Number(req.query.limit) || 5; // the number of results per page; defaults to 5
        let skip = Number(req.query.skip) || 0; // how many results to 'skip' - which page you are on; defaults to 0 (first page)
        db.books.find({}).skip(skip).limit(limit, (error, docs) => {
            if (error) {
                res.status(400).send({ message: 'Cannot load books.' });
            }
            res.json(docs);
        });
    });

    /**
    * @swagger
    * /books/count:
    *   get:
    *     tags:
    *       - books
    *     name: getBookCount
    *     summary: Get the number of all books in the system
    *     produces:
    *       - application/json
    *     responses:
    *       200:
    *         description: Number of all books in the system.
    *       500:
    *         description: Something is wrong with the service. Please contact a system administrator.
    */
    router.get('/books/count', (req, res) => {
        db.books.aggregate([
            { $group: { _id: null, count: { $sum: 1 } } }
        ], (error, docs) => {
            if (error) {
                res.status(400).send({ message: 'Cannot load book count.' });
            }
            res.json({ book_count: docs[0].count });
        });
    });

    /**
    * @swagger
    * /books/{book_id}:
    *   get:
    *     tags:
    *       - books
    *     name: getBookById
    *     summary: Get a book from the system by its ID
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: book_id
    *         in: path
    *         description: ID of the book
    *         required: true
    *         type: string
    *         default: '5db704ef3864c7524cd291ff'
    *     responses:
    *       200:
    *         description: List a single book from the system
    *       400:
    *           description: Invalid user request.
    *       401:
    *           description: Unauthorized access.
    *       500:
    *         description: Something is wrong with the service. Please contact the system administrator.
    */
    router.get('/books/:id', (req, res) => {
        let id = req.params.id;
        db.books.findOne({ _id: mongojs.ObjectId(id) }, (error, docs) => {
            if (error) {
                res.status(400).send({ message: 'Cannot load this book.' });
            }
            res.json(docs);
        });
    });

    /**
    * @swagger
    * /books/{book_id}/buy:
    *   get:
    *     tags:
    *       - books
    *     name: buyBook
    *     summary: Buys a book from the system (using its ID)
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: book_id
    *         in: path
    *         description: ID of the book
    *         required: true
    *         type: string
    *         default: '5db704ef3864c7524cd291ff'
    *     responses:
    *       200:
    *         description: Buy a single book from the system
    *       400:
    *           description: Invalid user request.
    *       500:
    *         description: Something is wrong with the service. Please contact the system administrator.
    */
    router.get('/books/:id/buy', (req, res) => {
        let id = req.params.id;
        db.books.findOne({ _id: mongojs.ObjectId(id) }, (error, book) => {
            if (error) {
                res.status(400).send({ message: 'Cannot load this book.' });
            }
            if (book.in_stock === 0) {
                res.status(400).json({ message: 'This book has been sold out.' });
            } else {
                /* Buy the book */
                db.books.findAndModify({
                    query: { _id: mongojs.ObjectId(id) },
                    update: { $set: { in_stock: book.in_stock - 1 } },
                    new: false
                }, function (err, doc) {
                    if (err) {
                        res.status(400).json({ message: 'Could not buy this book.' });
                    }
                    res.json({ message: `You have successfully bought '${book.name}'.` });
                });
            }
        });
    });

    router.get('/books/:id/checkout/:userId', (req, res) => {
        let id = req.params.id;
        let userId = req.params.userId;
        db.books.findOne({ _id: mongojs.ObjectId(id) }, (error, book) => {
            if (error) {
                res.status(400).send({ message: 'Cannot load this book.' });
            }
            if (book.checked_out === true) {
                res.status(400).json({ message: 'This book has been checked out.' });
            } else {
                /* Check out the book */
                db.books.findAndModify({
                    query: { _id: mongojs.ObjectId(id) },
                    update: { $set: { checked_out: true, reader: userId } },
                    new: false
                }, function (err, doc) {
                    if (err) {
                        res.status(400).json({ message: 'Could not check out this book.' });
                    }
                    res.json({ message: `You have checked out '${book.name}'.` });
                });
            }
        });
    });

    router.get('/books/:id/return/:userId', (req, res) => {
        let id = req.params.id;
        let userId = req.params.userId;
        db.books.findOne({ _id: mongojs.ObjectId(id) }, (error, book) => {
            if (error) {
                res.status(400).send({ message: 'Cannot load this book.' });
            }
            if (book.reader !== userId) {
                res.status(400).json({ message: 'This book has not been checked out by you.' });
            } else {
                /* Return the book */
                db.books.findAndModify({
                    query: { _id: mongojs.ObjectId(id) },
                    update: { $set: { checked_out: false, reader: "" } },
                    new: false
                }, function (err, doc) {
                    if (err) {
                        res.status(400).json({ message: 'Could not check out this book.' });
                    }
                    res.json({ message: `You have returned '${book.name}'.` });
                });
            }
        });
    });
}