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
                    if (userType === 'user' || userType === 'admin') {
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
}