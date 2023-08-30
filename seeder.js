const mongoose = require('mongoose');
const fs = require('fs')

const pathConfig        = require('./path');
global.__base           = __dirname + '/';
global.__path_app       = __base + pathConfig.folder_app + '/';
global.__path_configs   = __path_app + pathConfig.folder_configs + '/';
global.__path_schemas   = __path_app + pathConfig.folder_schemas + '/';

const databaseConfig  = require(__path_configs + 'database');

mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@cluster0.iaykfrj.mongodb.net/${databaseConfig.database}`,{ useNewUrlParser: true, useUnifiedTopology: true })
 
// get items file
const product = JSON.parse(
    fs.readFileSync(`${__dirname}/app/_data/product.json`, 'utf-8')
)


// get careers file
const category = JSON.parse(
    fs.readFileSync(`${__dirname}/app/_data/category.json`, 'utf-8')
)

// get careers file
const user = JSON.parse(
    fs.readFileSync(`${__dirname}/app/_data/user.json`, 'utf-8')
)

// save mongo
const productShemas = require(__path_schemas + 'product')
const categoryShemas = require(__path_schemas + 'category')
const userShemas = require(__path_schemas + 'user')

const importData = async () =>{
    try {
       await productShemas.create(product)
       await categoryShemas.create(category)
       await userShemas.create(user)
        console.log('importData...');
        process.exit()
        
    } catch (error) {
        console.log(error);
    } 
}

const deleteData = async () =>{
    try {
        await  productShemas.deleteMany({})
        await  categoryShemas.deleteMany({})
        await  userShemas.deleteMany({})
        console.log('deleteData...');
        process.exit()
    } catch (error) {
        console.log(error);
    } 
}

if (process.argv[2] === '-i') {
    importData()
} else if(process.argv[2] === '-d') {
    deleteData()
}