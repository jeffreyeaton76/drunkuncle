var twit = require('twit');
var config = require('./config.js');
var Twitter = new twit(config);

var getMentions = function (randomTweet) {

    // get mentions more recent than the last tweet sent by the drunk uncle
    let sinceId;
    Twitter.get('statuses/user_timeline', { screen_name: "askadrunkuncle", count: 1 }, function (err, data) {
        if (!err) {
            sinceId = data[0].id;
            Twitter.get('statuses/mentions_timeline', { since_id: sinceId }, function (err, data) {
                if (!err) {

                    // remove mentions caused by self
                    var mentions = data.filter(mention => mention.user.screen_name != "askadrunkuncle");

                    // pass good mentions on to next function
                    getDT(mentions);
                }
                else {
                    console.log("no mentions");
                }
            });
        }
        else {
            console.log(err);
        }
    });
}

var getDT = function (mentions) {
    var dt_options = {
        user_id: 25073877,
        trim_user: true,
        count: 100,
        include_rts: false
    }
    Twitter.get('statuses/user_timeline', dt_options, function (err, data) {

        if (!err) {
            // remove tweets that involve other accounts
            var goodTweets = data.filter(tweet => tweet.text.indexOf("@") < 0);

            // get a new random tweet from @realDonaldTrump for each mention
            mentions.forEach(function (mention) {
                let randomTweet = ranDom(goodTweets);

                // pass the mention and tweet to the post function
                postTweet(randomTweet, mention);
            });
        }
        else {
            console.log("error getting DT tweet");
        }
    });
}

function postTweet(randomTweet, mention) {

    var status = "@" + mention.user.screen_name + " " + randomTweet.text;
    var truncatedStatus = status.substring(0, 140);

    let postParams = {
        status: truncatedStatus,
        in_reply_to_status_id: mention.id,
        in_reply_to_user_id: mention.user.id
    }

    Twitter.post('statuses/update', postParams, function (err, data) {
        if (!err) {
            console.log("looks good");
        }
        else {
            console.log(err);
        }
    });
}

function ranDom(arr) {
    var index = Math.floor(Math.random() * arr.length);
    return arr[index];
};

getMentions();