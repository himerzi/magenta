var words = 3
var wordCount = 0
var timeSet = false
var interval;
var minutes = 0;
var seconds = 3;
var sent = false;
var duration = 0;

$(document).ready(function() {
	timer = setInterval(function() {
		duration ++;
	}, 1000);

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
		$(".message").innerHTML = "Submiting your words...";
		//send to parse
		var Entries = Parse.Object.extend("Entries");
		var entry = new Entries;
		
		entryText = $("#block").val();
		entry.set("entryText",entryText);
		entry.set("duration", duration);
		entry.set("wordCount", wordCount);
		
		entry.save(null, {
			success: function(entry) {
				console.log("entry added to db");
				$("#state").html("Thanks, your entry has been securely saved");
				$("#block").attr("disabled","disabled");
				sent = true;
			},
			error: function(entry, error) {

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
			$("#countdown-words").hide();
			$("#submit_button").fadeIn('slow');
		}
	    $('#progress-words > div').css('width', (wordCount / words) * 100 + '%')
	    $('#countdown-words').html(words - wordCount + ' words to go');
	});
});