const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
console.log('requiring fortunes data');
const fortunes = require('./data/fortunes');

const app = express();

// use bodyParser in our app
app.use(bodyParser.json());

// getting all our fotunes
app.get('/fortunes', (req, res) => {
    res.json(fortunes);
});

// geting a random index
app.get('/fortunes/random', (req, res) => {
    res.json(fortunes[Math.floor(Math.random() * fortunes.length)]);
});

//get fortunes by Id
app.get('/fortunes/:id', (req, res) => {
    res.json(fortunes.find(f => f.id == req.params.id));
});

// write fortunes in a file with our helper-fuction
const writeFortunes = json => {
    fs.writeFile('./data/fortunes.json', JSON.stringify(json), err => console.log(err));
};

//add new input fotune to our fortunes list
app.post('/fortunes', (req, res) => {
    //add our input from request body to their property keys
    const {message, lucky_number, spirit_animal } = req.body;
    //grab existing fortunes id - put in an array
    const fortune_ids = fortunes.map(f => f.id);
    // concate return a new fotunes array, with added 'fotune- keys object'
    const new_fortunes = fortunes.concat({
        // add a new id count check and increment by 1
        id: (fortune_ids.length > 0 ? Math.max(...fortune_ids) : 0) + 1,
        message,
        lucky_number,
        spirit_animal
    });
    //write our new_fortunes into our fortunes json array file in our data directory
    writeFortunes(new_fortunes);
    // retun a new updated fotunes array (when a server restart - updating our global array)
    res.json(new_fortunes);
});

//edit existing fortunes
app.put('/fortunes/:id', (req, res) => {
    // grab the id input of the requested fortune
    const { id } = req.params;
    // find the requested fortune from "fortunes array" to be edited, by matching its 'id'
    const old_fortune = fortunes.find(f => f.id == id);
    // loop through our 'id' body 'key arrays'
    ['message', 'lucky_number', 'spirit_animal'].forEach(key => {
        //update the old_fortune reference (data key) if there is a input req data key
        if (req.body[key]) old_fortune[key] = req.body[key];
    });
    //write the updated file in our data/fotunes
    writeFortunes(fortunes);
    // send back the new data to our object
    res.json(fortunes);
});

// Delete a fortune
app.delete('/fortunes/:id', (req, res) => {
    // grab the requested id
    const { id } = req.params;
    //filter the fortunes array and return all fortunes with the id that does not match req id
    const new_fortunes = fortunes.filter(f => f.id != id);
    // write our retuned fortune
    writeFortunes(new_fortunes);
    //send back the new data to our object
    res.json(fortunes);
});

// exporting app to other files as a module
module.exports = app;
