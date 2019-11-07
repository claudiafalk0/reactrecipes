const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const recipeRoutes = express.Router();
const PORT = 4000;

let Recipe = require('./recipe.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/Recipes', { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

recipeRoutes.route('/').get(function(req, res) {
    Recipe.find(function(err, recipes) {
        if (err) {
            console.log(err);
        } else {
            res.json(recipes);
        }
    });
});

recipeRoutes.route('/update/:id').post(function(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        if (!recipe)
            res.status(404).send("data is not found");
        else
            recipe.name = req.body.name;
            recipe.ingredients = req.body.ingredients;
            recipe.steps = req.body.steps;
            recipe.save().then(recipe => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

recipeRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Recipe.findById(id, function(err, recipe) {
        res.json(recipe);
    });
});


recipeRoutes.route('/add').post(function(req, res) {
    let recipe = new Recipe(req.body);
    recipe.save()
        .then(recipe => {
            res.status(200).json({'Recipe': 'Recipe added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new recipe failed');
        });
});

app.use('/recipes', recipeRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});