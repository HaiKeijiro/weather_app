// NPM
const express = require('express');
const https = require("https"); // gaperlu didownload krn ini native node module
const bodyParser = require("body-parser");

// Instance of express
const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
    const query = req.body.cityName; // cityName itu name dari input
    const unit = "metric";
    const apiKey = "b890d32168a40a91988291d0ee9eb455";
    // Live data using API
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

    // Get the data with http get request
    https.get(url, function(response) {
        console.log(response.statusCode);

        response.on("data", function(data) {
            const weatherData = JSON.parse(data); // format the data to JSON
            
            // parsing it and fetching the specific items we want
            const temp = weatherData.main.temp
            const weatherDescription = weatherData.weather[0].description
            const icon = weatherData.weather[0].icon
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

            // send to the browser
            res.write("<p>The weather is currently " + weatherDescription + "</p>");
            res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celcius. </h1>");
            res.write("<img src="+ imageURL + ">");
            res.send();
        });
    });
});

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});