
function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
    
    
    var activ = tweet_array.map(activitiesItem => {
      return {"a": activitiesItem.activityType, "b": activitiesItem.time, "c": activitiesItem.distance}
    });
  
    var top3={};
    activ.forEach(function(item){
      top3[item.a] ? top3[item.a]++ :  top3[item.a] = 1;
    });
    var sorted_top = Object.entries(top3).sort((a,b) => b[1]-a[1]).map(act =>act[0]);
    var first = sorted_top[0];
    var sec = sorted_top[1];
    var third = sorted_top[2];
    
    var output =  activ.filter(act => act["a"] == first ||act["a"] == sec ||act["a"] == third); 
    
    var topdist={};
    var topdistdate={};
    activ.forEach(function(item){
      switch(item.a){
        case first:
          if(topdist[first] == null){
            topdist[first] = item.c;
            topdistdate[first] = item.b;
          }
          else if(topdist[first] < item.c){
            topdist[first] = item.c;
            topdistdate[first] = item.b;
          }
          break;
        case sec:
          if(topdist[sec] == null){
            topdist[sec] = item.c;
            topdistdate[sec] = item.b;
            }
          else if(topdist[sec] < item.c){
            topdist[sec] = item.c;
            topdistdate[sec] = item.b;
            }
          break;
        case third:
          if(topdist[third] == null){
            topdist[third] = item.c;
            topdistdate[third] = item.b;
            }
          else if(topdist[third] < item.c){
            topdist[third] = item.c;
            topdistdate[third] = item.b;
            }
          break;
      }
    });
    var sorted_dist = Object.entries(topdist).sort((a,b) => b[1]-a[1]).map(act =>act[0]);
    
    var weekdays = new Array(
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    );
    
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v4.0.0-beta.8.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activ
	  },
      "mark": "bar",
      "encoding": {
        "x": {"field": "a", "type": "nominal", "axis": {"labelAngle": 90}},
    "y": {"aggregate": "count", "field": "a"}
      }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when
  
    distanceVis_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v4.0.0-beta.8.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": output
      },
      "mark": "point",
      "encoding": {
        "x": {timeUnit: "day", "field": "b", "type": "ordinal", "axis": {"labelAngle": 90}},
    "y": {"field": "c", "type": "quantitative"}, "color":{ "field":"a", "type": "nominal"}
      }
	};
	vegaEmbed('#distanceVis', distanceVis_vis_spec, {actions:false});
  
    meanVis_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v4.0.0-beta.8.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": output
      },
      "mark": "point",
      "encoding": {
        "x": {timeUnit: "day", "field": "b", "type": "ordinal", "axis": {"labelAngle": 90}},
    "y": {"aggregate": "mean", "field": "c"},"color":{ "field":"a", "type": "nominal"}
      }
	};
	vegaEmbed('#distanceVisAggregated', meanVis_vis_spec, {actions:false});
  
  
    $('#numberActivities').text(activ.length);
	$('#firstMost').text(first);
	$('#secondMost').text(sec);
	$('#thirdMost').text(third);

	$('#longestActivityType').text(sorted_dist[0]);
	$('#shortestActivityType').text(sorted_dist[2]);
	$('#weekdayOrWeekendLonger').text(weekdays[topdistdate[sorted_dist[0]].getDay()]);

    $('#distanceVisAggregated').hide();
  
    var aggreON=true;
    $('#aggregate').click(function () {
        if(aggreON) {
            aggreON=false;
            $('#aggregate').text("Show means");
            $('#distanceVis').show();
            $('#distanceVisAggregated').hide();
        }else{
            aggreON=true;
            $('#aggregate').text("Show all activities");
            $('#distanceVis').hide();
            $('#distanceVisAggregated').show();
        }
    });
}

//Wait for the DOM to load
$(document).ready(function() {
	loadSavedRunkeeperTweets().then(parseTweets);
});