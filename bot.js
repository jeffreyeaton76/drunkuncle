var twit = require('twit');
var config = require('./config.js');

var Twitter = new twit(config);


var getMentions = function (randomTweet) {
    let sinceId;
    Twitter.get('statuses/user_timeline', { screen_name: "askadrunkuncle", count: 1 }, function (err, data) {
        if (!err) {
            sinceId = data[0].id;
        }
        else {
            console.log(err);
        }
    });

    Twitter.get('statuses/mentions_timeline', { since_id: sinceId }, function (err, data) {
        if (!err) {
            ;
            postTweet(randomTweet, data);
        }
        else {
            console.log("no mentions");
        }
    });
}

var getDT = function () {
    var dt_options = {
        user_id: 25073877,
        trim_user: true
    }

    Twitter.get('statuses/user_timeline', dt_options, function (err, data) {
        if (!err) {
            let randomTweet = ranDom(data);
            if (randomTweet.text.includes("@")) {
                getDT();
            }
            else {
                getMentions(randomTweet);
            }
        }
        else {
            console.log("error getting DT tweet");
        }
    });
}

function postTweet(randomTweet, mentions) {

    mentions.forEach(function (tweet) {
        var status = "@" + tweet.user.screen_name + " " + randomTweet.text;
        var truncatedStatus = status.substring(0, 140);

        let postParams = {
            status: truncatedStatus,
            in_reply_to_status_id: tweet.id,
            in_reply_to_user_id: tweet.user.id
        }

        Twitter.post('statuses/update', postParams, function (err, data) {
            if (!err) {
                console.log("looks good");
            }
            else {
                console.log(err);
            }
        });
    });
}


function ranDom(arr) {
    var index = Math.floor(Math.random() * arr.length);
    return arr[index];
};


getDT();