const mongoose = require ('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema ({
    name: {
        type: String,
        trim: true,
        required: 'Please Enter a Store name'
    },
    slug: String, 
    description: {
        type: String, 
        trim:true
    },
    tags: [String],
    created:{
        type: Date,
        default: Date.now
    },
    location:{
        type:{
            type: String,
            default: 'Point'
        },
        coordinates:[{
            type: Number,
            required: 'You must supply coordinates'
        }],
        address:{
            type: String,
            required: 'You must supply an address!'
        }
    },
    photo: String
});

storeSchema.pre('save', async function(next){
    if (!this.isModified('name')) {
        next(); // Skip it
        return; // stop the function from running 
    };
    this.slug = slug(this.name);
    // find other stores with names sam, sam-1, sam-2 etc
    const slugRegEx = new RegExp(`^(${this.slug})((-[0,9]*$)?$)`, 'i');
    // find if there is a store with above name 
    const storesWithSlug = await this.constructor.find({slug: slugRegEx});
    // if found add 1 to the suffix 
    if(storesWithSlug.length){
        this.slug = `${this.slug}-${storesWithSlug.length+1}`;
    }

    next();
    // Come late make the section more resilient and unique
});
// create aggregate function
storeSchema.statics.getTagsList = function() {
    return this.aggregate([
        {$unwind: {tags: "Licenced"}}
    
    ],
        {$cursor:{}}
    )};

module.exports = mongoose.model('Store', storeSchema);
