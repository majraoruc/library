module.exports = (router, db, mongojs, jwt, config) => {

    router.use((req, res, next) => {
        /* Check for proper JWT */
        let authorization = req.get('Authorization');
        if (authorization) {
            jwt.verify(authorization, config.JWT_SECRET, (error, decoded) => {
                if (error) {
                    res.status(401).send({ message: 'Unauthorized access: ' + error.message });
                } else {
                    let userType = decoded.user_type;
                    if (userType === 'admin') {
                        next();
                    } else {
                        res.status(401).send({ message: 'Unauthorized access: improper privileges'});
                    }
                }
            });
        } else {
            res.status(401).send({ message: 'Unauthorized access: no token' });
        }
    })

    /**
    * @swagger
    * /books:
    *   post:
    *     tags:
    *       - books
    *     name: addBooks
    *     summary: Add a new book to the system
    *     security:
    *       - bearerAuth: []
    *     consumes:
    *       - application/json
    *     parameters:
    *       - in: body
    *         name: body
    *         description: Book object
    *         required: true
    *         schema:
    *             $ref: "#/definitions/Book"
    *     responses:
    *       200:
    *         description: Return a new book.
    *       400:
    *           description: Invalid user request.
    *       500:
    *         description: Something is wrong with the service. Please contact the system administrator.
    */
    router.post('/books', (req, res) => {
        db.books.insert(req.body, (error, docs) =>{
            if (error) {
                res.status(400).send({ message: 'Cannot insert this book.' });
            }
            res.json(docs);
        });
    });
    
    /**
    * @swagger
    * /books/{book_id}:
    *   put:
    *     tags:
    *       - books
    *     name: updateBook
    *     summary: Update book details.
    *     security:
    *       - bearerAuth: []
    *     consumes:
    *       - application/json
    *     produces:
    *       - application/json
    *     parameters:
    *       - in: path
    *         name: book_id
    *         description: ID of the book
    *         required: true
    *         type: string
    *         default: '5db704ef3864c7524cd291ff'
    *       - in: body
    *         name: body
    *         description: Book object
    *         required: true
    *         schema:
    *             $ref: "#/definitions/Book"
    *     responses:
    *       200:
    *         description: Return the updated book.
    *       500:
    *         description: Something is wrong with the service. Please contact the system administrator.
    */
    router.put('/books/:id', (req, res) => {
        var id = req.params.id;
        var object = req.body
    
        db.books.findAndModify({
            query: { _id: mongojs.ObjectId(id) },
            update: { $set: object },
            new: true
        }, function (err, doc) {
            if (err) {
                res.status(400).json({ message: 'Could not update this book.' });
            }
           res.json(doc);
        });
    });
    
    /**
    * @swagger
    * /books/{book_id}:
    *   delete:
    *     tags:
    *       - books
    *     name: deleteBookById
    *     summary: Delete a book from the system by its ID
    *     security:
    *       - bearerAuth: []
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
    *         description: Successfully deletes a single book from the system
    *       400:
    *           description: Invalid user request.
    *       401:
    *           description: Unauthorized access.
    *       500:
    *         description: Something is wrong with the service. Please contact the system administrator.
    */
    router.delete('/books/:id', (req, res) => {
        var id = req.params.id;
        db.books.remove({ _id: mongojs.ObjectId(id) }, [true], function(err, docs) {
            if (err) {
                res.status(400).json({ message: 'Could not delete this book.' });
            }
            res.json({ message: 'Successfully deleted the book.' });
        });
    });
}