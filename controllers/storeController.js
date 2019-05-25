const mongoose = require ('mongoose');
const Store = mongoose.model('Store');

//Multer is a node.js middleware for handling multipart/form-data, 
//which is primarily used for uploading files
const multer = require('multer')
// jim is a package to help us resize images
const jimp = require('jimp')
// uuid is a package to help us create unique identifiers for our uploaded files 
const uuid = require('uuid')
// set up multer options before creatin the middleware routes 
const multerOptions ={
// define where the files will be stored 
// we want to read the file into memory then resize it then store the resised version
    storage: multer.memoryStorage(),
// define what types of files are allowed 
    fileFilter(req, file, next) { 
        // you can use the shorthand es6 since fileFilter is a function by eliminatin the : function
        // either say the filetype is okay or say the file type is not allowed
        const isPhoto = file.mimetype.startsWith('image/');
        // mime(multipurpose internet mail extensions) is an internet standard that extends the 
        // the format of emai to support, images, audio (non-text attachments), non ascii text formats
        if(isPhoto){
            next(null, true);// call bak function 
        } else {
            next({message: 'That file isnt supported'}, false);
        }

    }

};


exports.homepage = (req, res) =>{
    console.log(req.name);
    res.render('index');
};

exports.addStore = (req, res) => {
    res.render('editStore', {title: 'Add Store'});

};
// raises the photo into memory, doesnt store the file in disk but rather in memory
exports.upload = multer(multerOptions).single('photo');

// no rendeering or sending data back, resize and store 
exports.resize = async(req, res, next) =>{
    // check if there is no new file to resize
    if(!req.file){
        next(); // skip to the next middleware 
        return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    // resize now
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    // once we have written the photo to our filesystem, keep going
    next();
};

exports.createStore = async(req, res)=> {
    const store = await(new Store(req.body)).save();
    req.flash('Success', `Successfully created ${store.name}. care leaving a review`);
    res.redirect(`/store/${store.slug}`);
    //res.redirect(/stores/);

};

exports.getStores = async (req, res) => {
    const stores = await Store.find();
    res.render('stores', {title:'Stores', stores});
};

exports.editStore = async(req, res) =>{
    // find the store given the id
    const store = await Store.findOne({ _id: req.params.id});
    //res.json(store);
    res.render('editStore', {title: `Edit ${store.name}`, store});
    // confirm they are the owners of the store
    // render the edit store form to enble the owner edit the store
    //res.render('editStore', {title: `Edit ${store.name}`, store: store});
};

exports.updateStore = async(req, res) =>{
    // set the location data to be a point
    //req.body.location.type = 'Point';// ****************come back later to sort this
    // find and update the store
    const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body,{
        new: true, // return the new store instead of the old one
        runValidators: true
    }).exec();
    req.flash('success', `Successfully updated <strong>${store.name}</strong>. 
        <a href="/stores/${store.slug}">View Store </a>`);
    res.redirect(`/stores/${store._id}/edit`);
};
// async fucntions when querying the database
exports.getStoreBySlug = async(req, res) =>{
    //res.send('sam is great')
    //res.json(req.params);
     const store = await Store.findOne({slug: req.params.slug});
     // if no store found skip and move to the next middleware - error hadnlers
     if (!store) return next();
     res.render('store', {store, title: store.name});
};

exports.getStoreByTag = async(req, res) =>{
    //res.send('Huray it works');
    const stores = await Store.getTagsList();
    res.json(stores)

};