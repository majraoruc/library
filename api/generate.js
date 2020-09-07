/* Import data */
let data = require('./data.json');

const mongojs = require('mongojs');
let mongoURL = `mongodb://localhost:27017/makeup-final-exam`;
const db = mongojs(mongoURL);
const bcrypt = require('bcrypt');

/* Generate passwords */
for (let i = 0; i < data.users.length; i++) {
    data.users[i].password = bcrypt.hashSync(data.users[i].password, 10);
}

/* Drop old collections */
db.books.drop();
db.users.drop();

/* Insert books */
db.books.insert(data.books, (error, docs) => {
    console.log(`Successfully inserted ${data.books.length} books.`);
});

/* Insert users */
db.users.insert(data.users, (error, docs) => {
    console.log(`Successfully inserted ${data.users.length} users.`);
});

console.log(`MongoDB URL: ${mongoURL}`)
console.log('-----------------------------------------------');
console.log('Admin e-mail: admin@bookshop.ba');
console.log('User password: adminpass');
console.log();

/* Create a config file */
const fs = require('fs');
let config = `module.exports = {
    MONGODB_URL: '${mongoURL}',
    JWT_SECRET: '${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}'
}
`;
fs.writeFileSync('./config.js', config);

setTimeout(() => {
    console.log('SUCCESS');
    process.exit();
}, 5000);
