// Create an Twitter object to connect to Twitter API
// npm install twit
var Twit = require('twit');

// Pulling all my twitter account info from another file
var config = require('./config.js');
// Making a Twit object for connection to the API
var T = new Twit(config);

// This is how I would do it manually, if I were doing it manually
// var T = new Twit({
//   consumer_key:         '', 
//   consumer_secret:      '',
//   access_token:         '',
//   access_token_secret:  ''
// });

// Setting up a user stream
var stream = T.stream('user');

// Anytime someone follows me
stream.on('follow', followed);

// Just looking at the event but I could tweet back!
function followed(event) {
  var name = event.source.name;
  var screenName = event.source.screen_name;
  console.log('I was followed by: ' + name + ' ' + screenName);
}

// Now looking for tweet events
// See: https://dev.twitter.com/streaming/userstreams
stream.on('tweet', tweetEvent);

// Here a tweet event is triggered!
function tweetEvent(tweet) {

  // If we wanted to write a file out
  // to look more closely at the data
  // var fs = require('fs');
  // var json = JSON.stringify(tweet,null,2);
  // fs.writeFile("tweet.json", json, output);

  // Who is this in reply to?
  var reply_to = tweet.in_reply_to_screen_name;
  // Who sent the tweet?
  var name = tweet.user.screen_name;
  // What is the text?
  var txt = tweet.text;

  // Ok, if this was in reply to me
  if (reply_to === 'a2zitp') {

    // Get rid of the @ mention
    txt = txt.replace(/@a2zitp/g,'');

    // Start a reply back to the sender
    var reply = '.@'+name + ' ';
    // Reverse their text
    for (var i = txt.length-1; i >= 0; i--) {
      reply += txt.charAt(i);
    }
  
    // Post that tweet!
    T.post('statuses/update', { status: reply }, tweeted);

    // Make sure it worked!
    function tweeted(err, reply) {
      if (err !== undefined) {
        console.log(err);
      } else {
        console.log('Tweeted: ' + reply);
      }
    };
  }

}