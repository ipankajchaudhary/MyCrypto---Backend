const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser')
const Portfolio = require('../Models/Portfolio')
const { body, validationResult } = require('express-validator');

// Route 1: Get All Portfolio using : GET

router.get('/fetchallportfolios', fetchuser, async (req, res) => {

    try {
        const portfolios = await Portfolio.find({ user: req.user.id });
        res.json(portfolios)

    } catch (error) {
        res.status(500).send("Some Error Occurred")
    }
})

// ROUTE 2: Add a new Portfolio using: POST "/api/auth/addportfolio". Login required
router.post('/addportfolio', fetchuser, async (req, res) => {
        try {

            const { coinid, amount } = req.body;

            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const portfolio = new Portfolio({
                coinid, amount, user: req.user.id
            })
            const savedPortfolio = await portfolio.save()

            res.json(savedPortfolio)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
})
    // ROUTE 3: Update an existing Portfolio using: POST "/api/portfolio/updateportfolio". Login required

router.put('/updateportfolio/:id', fetchuser, async (req, res) => {
    const {coinid,amount} = req.body;
    // Create a newPortfolio object
    const newPortfolio = {};
    if(coinid){newPortfolio.coinid = coinid};
    if(amount){newPortfolio.amount = amount};
   

    // Find the portfolio to be updated and update it
    let portfolio = await Portfolio.findById(req.params.id);
    if(!portfolio){return res.status(404).send("Not Found")}

    if(portfolio.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    portfolio = await Portfolio.findByIdAndUpdate(req.params.id, {$set: newPortfolio}, {new:true})
    res.json({portfolio});

})
    
 // ROUTE 4: Delete an existing Portfolio using: POST "/api/portfolio/deleteportfolio". Login required

 router.delete('/deleteportfolio/:id', fetchuser, async (req, res) => {
    const {coinid,amount} = req.body;

    // Find the portfolio to be deleted and delete it
    let portfolio = await Portfolio.findById(req.params.id);
    if(!portfolio){return res.status(404).send("Not Found")}

    //  Allow deletion only if user owns this portfolio 
    if(portfolio.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    portfolio = await Portfolio.findByIdAndDelete(req.params.id)
    res.json({"Success" : "Portfolio deleted"});

    })


module.exports = router