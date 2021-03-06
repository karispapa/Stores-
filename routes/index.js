const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const {catchErrors} = require('../handlers/errorHandlers')

// Do work here
router.get('/',catchErrors(storeController.getStores));

router.get('/stores',catchErrors(storeController.getStores));

router.get('/add',storeController.addStore);

router.post('/add',storeController.upload, 
  catchErrors(storeController.resize), 
  catchErrors(storeController.createStore));

router.post('/add/:id',catchErrors(storeController.updateStore));

router.get('/stores/:id/edit',catchErrors(storeController.editStore));

// route for getting the store using a slug
router.get('/store/:slug',catchErrors(storeController.getStoreBySlug));
router.get('/tags',catchErrors(storeController.getStoreByTag));
router.get('/tags/:tag',catchErrors(storeController.getStoreByTag));




module.exports = router;
