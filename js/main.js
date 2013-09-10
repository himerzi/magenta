var words = 150
var wordCount = 0
var timeSet = false
var interval;
var minutes = 6;
var seconds = 0;
var sent = false;
var duration = 0;

$(document).ready(function() {
	timer = setInterval(function() {
		duration ++;
	}, 1000);
	function getURLParameter(name) {
	    return decodeURI(
	        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
	    );
	}
	function countdown(element) {
	    interval = setInterval(function () {
	        var el = document.getElementById(element);
	        if (seconds == 0) {
	            if (minutes == 0) {
	                el.innerHTML = "";
					if (sent == false) {
						submitEntry();
					}
	                clearInterval(interval);
	                return;
	            } else {
	                minutes--;
	                seconds = 60;
	            }
	        }
	        if (minutes > 0) {
	            var minute_text = minutes + (minutes > 1 ? ' minutes' : ' minute');
	        } else {
	            var minute_text = '';
	        }
	        var second_text = seconds > 1 ? 'seconds' : 'second';
	        el.innerHTML = minute_text + ' ' + seconds + ' ' + second_text + ' remaining';
	        seconds--;

	    }, 1000);
	}

	function submitEntry() {
		$("#state").html("Saving...");

		var Entries = Parse.Object.extend("Entries");
		var Users = Parse.Object.extend("MagentaUser");
		var entry = new Entries;

		var userID = getURLParameter("uid")
		var user = undefined

		var query = new Parse.Query(Users);
		query.get(userID, {
		  success: function(usr) {
		  	user = usr;
		  	entryText = $("#block").val();
		  	encText = sjcl.encrypt(userID, entryText);
		  	entry.set("entryText",encText);
		  	entry.set("duration", duration);
		  	entry.set("wordCount", wordCount);
		  	entry.set("parent", user);
		  	entry.save(null, {
		  		success: function(entry) {
		  			console.log("entry added to db");
		  			$("#state").html("Thanks, your entry has been securely saved");
		  			$("#block").attr("disabled","disabled");
		  			sent = true;
		  		},
		  		error: function(entry, error) {
		  			$("#state").html("Saving failed, sorry");
		  		}
		  	});
		  },
		  error: function(object, error) {
		  	$("#state").html("No user id");
		  }
		});




	}

	$("#countdown-words").html(words + ' words to go')

	function countWords(s){
		s = s.replace(/(^\s*)|(\s*$)/gi,"");
		s = s.replace(/[ ]{2,}/gi," ");
		s = s.replace(/\n /,"\n");
		return s.split(' ').length;
	}

	$("#submit_button").click(function() {
		submitEntry();
	});

	$("#block").on('input propertychange', function () {
	    if (timeSet === false) {
	        timeSet = true;
	        countdown('countdown-time');
	    }

	    wordCount = countWords($("#block").val());
		if (wordCount >= words) {
			$('#countdown-words').html('0 words to go, you\'re done!');
			$("#submit_button").show();
		} else {
		    $('#progress-words > div').css('width', (wordCount / words) * 100 + '%')
		    $('#countdown-words').html(words - wordCount + ' words to go');
		}
	});
});