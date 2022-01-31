class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if(this.text.startsWith("Just completed") == true || this.text.startsWith("Just posted") == true)
          return "completed_event";
        else if(this.text.startsWith("Achieved") == true)
          return "achievement";
        else if(this.text.startsWith("Watch") == true)
          return "live_event";
        else
          return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        if(this.source == 'miscellaneous')
          return true;
        else if(this.source == 'completed_event'){
          var filtered_text = this.text;
          filtered_text.replace("#Runkeeper", "");
          filtered_text.replace("@Runkeeper", "");
          var urlCharAt = filtered_text.indexOf("https://t.co");
          var url = filtered_text.substring(urlCharAt,urlCharAt+22);
          filtered_text.replace(url, "");
          if(filtered_text.includes(" - "))
            return true;
        }
        return false;
        //TODO: identify whether the tweet is written
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        var filtered_text = this.text;
        if(filtered_text.includes(" - ")){
          return filtered_text.substring(  filtered_text.indexOf("- ")+ 2,filtered_text.indexOf(" https"));
        }
          
        //TODO: parse the written text from the tweet
        return "";
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        var kilo = this.text.match(/(\d{1,2}\.\d{2})\s(km)/);
        var mile = this.text.match(/(\d{1,2}\.\d{2})\s(mi)/);
        if (kilo != null && kilo.length > 0) {
            var start = this.text.search(kilo[0]) + kilo[0].length +1;
            var split_with = this.text.substring(start, this.text.indexOf(' with', start));
            var split_dash = this.text.substring(start, this.text.indexOf(' -', start));
            if (split_with.length < split_dash.length)
                return split_with;
            return split_dash;
        }
        else if (mile != null && mile.length > 0) {
            var start = this.text.search(mile[0]) + mile[0].length +1;
            var split_with = this.text.substring(start, this.text.indexOf(' with', start));
            var split_dash = this.text.substring(start, this.text.indexOf(' -', start));
            if (split_with.length < split_dash.length)
                return split_with;
            return split_dash;
        }
        //TODO: parse the activity type from the text of the tweet
        return "unknown";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        var kilo = this.text.match(/(\d{1,2}\.\d{2})\s(km)/);
        var mile = this.text.match(/(\d{1,2}\.\d{2})\s(mi)/);
        if (kilo != null) {
            return parseFloat(kilo[0].substr(0,kilo[0].indexOf(' ')));
        }
        else if (mile != null) {
            return parseFloat(mile[0].substr(0,mile[0].indexOf(' '))) *1.60934 ;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        var linkstart = this.text.indexOf("https://");
        var linkend = this.text.indexOf(" ", linkstart);
        var writ = this.writtenText;
        var intro = this.text.substring(0, linkstart);
        var hashtag = this.text.substring(linkend);
        var link = this.text.substring(linkstart, linkend);
        var str = "<tr><td><b>" + rowNumber + "</b></td>" +
            "<td>" + this.activityType + "</td>" +
            "<td>" + intro + "<a href =" + link + ">" + link + "</a>" + hashtag + "</td></tr>";
        return str;
    }
}