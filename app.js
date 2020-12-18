// app.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connection = require('./connection');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
     res.json({message: "Hello World!"});
});

app.post('/bookmarks', (req, res) => {
    const {title,url} = req.body
    if(!title || !url){
        return res.status(422).json({error: "required field(s) missing"});
    }
    connection.query(
        "INSERT INTO bookmark SET ?",
        [req.body],
        (err, results) => {
            if (err) {
                res.status(500).send("Error post");
            } else {
                connection.query(
                    "SELECT * from bookmark WHERE id = ?",
                    [results.insertId],
                    (err, records) => {
                        if (err) {
                            res.status(500).send("Error display post");
                        } else {
                            res.status(201).json(records[0]);
                        }
                    }
                )
            }
        }
    )
});

app.get('/bookmarks/:id',(req,res) =>{
        connection.query(
        "SELECT * FROM bookmark WHERE id = ?",
        [req.params.id],
        (err, results) => {
            if (results.length === 0) {
                res.status(404).send({ error: 'Bookmark not found' });
            } else {
                res.status(200).json(results[0]);
            }
        }
    )
})

module.exports = app;
