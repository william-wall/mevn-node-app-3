let donations = require('../models/donations');
let express = require('express');
let router = express.Router();

router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(donations,null,5));
}

router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    var donation = getByValue(donations,req.params.id);

    if (donation != null)
        res.send(JSON.stringify(donation,null,5));
    else
        res.send('Donation NOT Found!!');

}

function getByValue(array, id) {
    var result  = array.filter(function(obj){return obj.id == id;} );
    return result ? result[0] : null; // or undefined
}

function getTotalVotes(array) {
    let totalVotes = 0;
    array.forEach(function(obj) { totalVotes += obj.upvotes; });
    return totalVotes;
}

router.addDonation = (req, res) => {
    //Add a new donation to our list
    var id = Math.floor((Math.random() * 1000000) + 1); //Randomly generate an id
    var currentSize = donations.length;

    donations.push({"id" : id, "paymenttype" : req.body.paymenttype, "amount" : req.body.amount, "upvotes" : 0});

    if((currentSize + 1) == donations.length)
        res.json({ message: 'Donation Added Successfully!'});
    else
        res.json({ message: 'Donation NOT Added!'});
}

router.incrementUpvotes = (req, res) => {
    // Find the relevant donation based on params id passed in
    // Add 1 to upvotes property of the selected donation based on its id
    var donation = getByValue(donations,req.params.id);

    if (donation != null) {
        donation.upvotes += 1;
        res.json({status : 200, message : 'UpVote Successful' , donation : donation });
    }
    else
        res.send('Donation NOT Found - UpVote NOT Successful!!');

}

router.deleteDonation = (req, res) => {
    //Delete the selected donation based on its id
    var donation = getByValue(donations,req.params.id);
    var index = donations.indexOf(donation);

    var currentSize = donations.length;
    donations.splice(index, 1);

    if((currentSize - 1) == donations.length)
        res.json({ message: 'Donation Deleted!'});
    else
        res.json({ message: 'Donation NOT Deleted!'});
}

router.findTotalVotes = (req, res) => {

    let votes = getTotalVotes(donations);
    res.json({totalvotes : votes});
}

module.exports = router;