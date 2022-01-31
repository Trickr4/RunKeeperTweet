var written_tweet_array=[];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
    tweet_array = runkeeper_tweets.map(function(tweet) {
        return new Tweet(tweet.text, tweet.created_at);
    });
    written_tweet_array=[];
    
    tweet_array.forEach(function(item){
      if(item.written){
	        written_tweet_array.push(item);
        }
    });
}

// handle events
function addEventHandlerForSearch() {
    $('#textFilter').keyup(function () {
        var textsearch =document.getElementById("textFilter");
        var term = textsearch.value.toString();
        $('#tweetTable').empty();
        if(term.length>0) {
            var content="";
            var count=0;
            written_tweet_array.forEach(function(item){
              if(item.writtenText.includes(term)) {
                    count++;
                    content+=item.getHTMLTableRow(count.valueOf(),item.source.toString(),item.text.toString());
                }
            });
            $('#searchCount').text(count);
            $('#searchText').text(term);
            $('#tweetTable').append(content);
        }else {
            $('#searchCount').text("???");
            $('#searchText').text("???");
        }
    });
}

//Wait for the DOM to load
$(document).ready(function() {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});