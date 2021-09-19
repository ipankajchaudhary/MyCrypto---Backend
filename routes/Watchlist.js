const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser')
const Watchlist = require('../Models/Watchlist')
const { body, validationResult } = require('express-validator');

// Route 1: Get All Watchlist using : GET

router.get('/fetchallwatchlists', fetchuser, async (req, res) => {

    try {
        const watchlists = await Watchlist.find({ user: req.user.id });
        res.json(watchlists)

    } catch (error) {
        res.status(500).send("Some Error Occurred")
    }
})

// ROUTE 2: Add a new Watchlist using: POST "/api/auth/addwatchlist". Login required
router.post('/addwatchlist', fetchuser, async (req, res) => {
        try {

            const { coinid } = req.body;

            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const watchlist = new Watchlist({
                coinid,user: req.user.id
            })
            const savedWatchlist = await watchlist.save()

            res.json(savedWatchlist)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
})
    // ROUTE 3: Update an existing Watchlist using: POST "/api/watchlist/updatewatchlist". Login required

router.put('/updatewatchlist/:id', fetchuser, async (req, res) => {
    try {
    const {coinid} = req.body;
    // Create a newWatchlist object
    const newWatchlist = {};
    if(coinid){newWatchlist.coinid = coinid};
   
        

    // Find the watchlist to be updated and update it
    let watchlist = await Watchlist.findById(req.params.id);
    if(!watchlist){return res.status(404).send("Not Found")}

    if(watchlist.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    watchlist = await Watchlist.findByIdAndUpdate(req.params.id, {$set: newWatchlist}, {new:true})
        res.json({ watchlist });
    }
    catch (error) {
        res.status(500).send("Some Error Occurred")
    }

})
    
 // ROUTE 4: Delete an existing Watchlist using: POST "/api/watchlist/deletewatchlist". Login required

 router.delete('/deletewatchlist/:id', fetchuser, async (req, res) => {
    const {coinid} = req.body;

    // Find the watchlist to be deleted and delete it
    let watchlist = await Watchlist.findById(req.params.id);
    if(!watchlist){return res.status(404).send("Not Found")}

    //  Allow deletion only if user owns this watchlist 
    if(watchlist.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    watchlist = await Watchlist.findByIdAndDelete(req.params.id)
    res.json({"Success" : "Watchlist deleted"});

    })


module.exports = router