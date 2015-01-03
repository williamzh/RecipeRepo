var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: 'localhost:9200'
});

var data = require('./data.json');

// Meta info
client.create({
    index: 'reciperepo',
    type: 'meta',
    id: 'keys',
    body: data.meta
}, function (error, response) {
    if(!error) {
        process.stdout.write('.');
    }
    else {
        process.stdout.write('!');
        console.log(error);
    }
});

// Recipes
var recipes = data.recipes;
for(var i = 0; i < recipes.length; i++) {
    var recipe = recipes[i];
    recipe.id = i + 1;

    client.create({
        index: 'reciperepo',
        type: 'recipe',
        id: recipe.id,
        body: recipe
    }, function (error, response) {
        if(!error) {
            process.stdout.write('.');
        }
        else {
            process.stdout.write('!');
            console.log(error);
        }
    });
}