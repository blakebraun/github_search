const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
const port = 8080;
let cache = {};

app.use(cors());

let cacheMiddleware = (req, res, next) => {
    const key = req.url;
    if(cache[key]) {
        console.log("Sending cached response");
        res.send(cache[key]);
    } else {
        console.log("Sending response from GitHub")
        
        // redefine express res.send in order to intercept it for caching
        res.sendResponse = res.send;
        res.send = (body) => {
            cache[key] = body;
            res.sendResponse(body);
        }
        next();
    }
}

app.get('/search/:query', cacheMiddleware, (req, res) => {
    const query = req.params.query;
    let url = "https://api.github.com/search/repositories?q=" + query;
    console.log("Received query for " + query);

    const sort = req.query.sort;
    const language = encodeURIComponent(req.query.language);
    if(language !== undefined) {
        url += "+language:" + language;
    }
    if(sort !== undefined) {
        url += "&sort=" + sort;
    }

    axios.get(url)
        .then(res => parseData(res.data))
        .then(parsedData => res.send(parsedData))
        .catch(err => {
            console.log(err);
            res.send(400, "Something went wrong.");
        })
});

const parseData = (data) => {
    const parsedItems = data.items.map(item => {
        return {
            "name" : item.name,
            "description" : item.description,
            "url" : item.html_url,
            "stars" : item.stargazers_count,
            "language" : item.language,
            "owner" : item.owner.login,
            "score" : item.score
        }
    })

    return {
        "total_count" : data.total_count,
        "items" : parsedItems
    }
}

let server = app.listen(port, () => console.log(`Proxy application listening on port ${port}!`));

module.exports = app;