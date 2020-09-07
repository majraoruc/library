const express = require('express');
const mongojs = require('mongojs');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const port = 4000;
const config = require('./config');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/* MongoDB */
const db = mongojs(config.MONGODB_URL);

/* Body processing */
app.use(bodyParser.json());

/* CORS */
app.use(cors());

// const generate = require("./generate")

/** Swagger setup */
const swaggerDefinition = {
    info: {
        title: 'GranApp Swagger API Documentation',
        version: '1.0.0',
    },
    basePath: '/',
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            scheme: 'bearer',
            in: 'header',
        },
    },
};

const options = {
    swaggerDefinition,
    apis: [
        './index.js',
        './routes/*.js',
        './models/*.js'
    ],
};

const swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
    res.json({ message: 'Library.ba backend.' });
});

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - auth
 *     name: login
 *     summary: Login to the library system.
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Login object
 *         required: true
 *         schema:
 *             $ref: '#/definitions/Login'
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful login
 *       500:
 *         description: Something is wrong with the service. Please contact the system administrator.
 */
app.post('/login', (req, res) => {
    /* Check for empty data */

    if (!req.body.email || !req.body.password) {
        res.status(400).send({ message: 'Invalid user credentials.' });
        return;
    }
    db.users.findOne({ email: req.body.email }, (error, user) => {
        if (error) {
            throw error;
        }
        /* Check whether an actual user has been found. */
        if (user) {
            /* Check for valid password */
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.json({
                    user_type: user.user_type,
                    token: jwt.sign({
                        _id: user._id, email: user.email, user_type: user.user_type
                    }, config.JWT_SECRET, { expiresIn: '1h' })
                });
            } else {
                res.status(401).send({ message: 'You have entered an invalid password.' })
            }
        } else {
            res.status(404).send({ message: 'This user does not exist.' });
        }
    })
});

app.post('/register', (req, res) => {
    /* Check for empty data */

    if (!req.body.email || !req.body.password || !req.body.name) {
        res.status(400).send({ message: 'Invalid user info.' });
        return;
    }

    let user = {
        "name": "Administrator",
        "email": "admin@bookshop.ba",
        "password": bcrypt.hashSync(req.body.password, 10),
        "user_type": "admin"
    }

    db.users.insert(user, (error, user) => {
        if (error) {
            res.status(400).send(error);
        }
        else res.status(200).send();

    })
});



/* Express Routers */
let public_router = express.Router();
require('./routes/public.js')(public_router, db, mongojs);
app.use('/', public_router);

let user_router = express.Router();
require('./routes/user.js')(user_router, db, mongojs, jwt, config);
app.use('/', user_router);

let admin_router = express.Router();
require('./routes/admin.js')(admin_router, db, mongojs, jwt, config);
app.use('/', admin_router);

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, './../frontend/build/index.html'), function (err) {
        if (err) {
            res.status(500).send(err)
        }
    })
})

/* Starting the server */
app.listen(port, () => console.log(`Example app listening on port ${port}!`)) 