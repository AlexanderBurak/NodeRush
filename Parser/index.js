var request = require('request');
var cheerio = require('cheerio');
var searchTerm = 'iphone6_16gb';
var url = 'http://catalog.onliner.by/mobile/apple/' + searchTerm;

request(url, function(err, resp, body){
    if (!err && resp.statusCode == 200){
        $ = cheerio.load(body);
        itemPrice = $('div.b-offers-desc__info-sub > a').text();
        console.log('Iphone price is ' + itemPrice);
    } else {
        console.log('Error');
    }
});