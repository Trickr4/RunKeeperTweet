function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	$('#numberTweets').text(tweet_array.length);
    var oldest = tweet_array[0].time;
    var newest = tweet_array[0].time;
    var comp = 0;
    var live = 0;
    var ach = 0;
    var misc = 0;
    var writ = 0;
    tweet_array.forEach(tweets);
  
    function tweets(item){
      if(item.time.getTime() < oldest.getTime())
        newest = item.time;
      if(item.time.getTime() > oldest.getTime())
        oldest = item.time;
      if(item.written)
        writ += 1;
      if (item.source == 'completed_event')
        comp += 1;
      else if (item.source == "achievement")
        ach += 1;
      else if (item.source == "live_event")
        live += 1;
      else
        misc += 1;
    }
    var n = newest.toDateString();
    $('#firstDate').text(n);  
    var o = oldest.toDateString();
    var tot = tweet_array.length;
    $('#lastDate').text(o);
    $('.completedEvents').text(comp);
    $('.completedEventsPct').text(math.format((comp/tot)*100,{notation: 'fixed', precision: 2}) + '%');
    $('.liveEvents').text(live);
    $('.liveEventsPct').text(math.format((live/tot)*100,{notation: 'fixed', precision: 2}) + '%');
    $('.achievements').text(ach);
    $('.achievementsPct').text(math.format((ach/tot)*100,{notation: 'fixed', precision: 2}) + '%');
    $('.miscellaneous').text(misc);
    $('.miscellaneousPct').text(math.format((misc/tot)*100,{notation: 'fixed', precision: 2}) + '%');
    $('.written').text(writ);
    $('.writtenPct').text(math.format((writ/comp)*100,{notation: 'fixed', precision: 2}) + '%');
}

//Wait for the DOM to load
$(document).ready(function() {
	loadSavedRunkeeperTweets().then(parseTweets);
});