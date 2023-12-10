$(document).ready(

	function(){

		$("form").submit(function(e) {

			e.preventDefault();

		})

		var getTakenURL = "http://secret-garden-35595.herokuapp.com/getTaken/";

		$.get(getTakenURL, function(taken_slots, status) {

			var friday_start_time = new Date("August 30, 2019 16:46:00");

			var friday_end_time = new Date("August 30, 2019 22:00:00");

			var saturday_start_time = new Date("August 31, 2019 9:05:00");

			var saturday_end_time = new Date("August 31, 2019 15:00:00");

			var audition_length = 7;

			var timeslots = []

			var flag = true

			while(flag){

				var copy = new Date();

				copy.setTime(friday_start_time.getTime())

				if(copy <= friday_end_time){

					timeslots.push(copy);

					friday_start_time.setMinutes(friday_start_time.getMinutes() + 7);

				}

				else {

					flag = false

				}

				

			}

			var flag = true

			while(flag){

				var copy = new Date();

				copy.setTime(saturday_start_time.getTime())

				if(copy <= saturday_end_time){

					timeslots.push(copy);

					saturday_start_time.setMinutes(saturday_start_time.getMinutes() + 7);

				}

				else {

					flag = false

				}

				

			}

			var intervals = []; 

			var takenCopy = [];

			for (i in taken_slots){

				takenCopy.push( taken_slots[i].slice(0, 24));

			}



			for (i in timeslots) {

				var inArray = $.inArray(timeslots[i].toString().slice(0, 24), takenCopy);

				if (inArray == -1) { 

					var copy = new Date();

					copy.setTime(timeslots[i].getTime())

					intervals.push(copy);

				}

			}

			populateDates(intervals);

			

		});

		

		$("#submitBtn").click(function(){

			var name = document.getElementById("name").value;

			var kerberos = document.getElementById("kerberos").value;

			var year = document.getElementById("year").value;

			var radios = document.getElementsByTagName('schedule');

			var postURL; 

			var timeslot = $('.selected input:first-child').val();

			var confirmation;

			d = new Date(timeslot);

			swal({

		  		title: "You are signing up for an audition with the Chorallaries on " + d.toLocaleString('en-US') + ".",

		  		showCancelButton: true,

		  		confirmButtonColor: "#E00000",

		  		confirmButtonText: "Confirm",

		  		closeOnConfirm: false,

		  		html: false

				}, function(){

		  			postURL = "http://secret-garden-35595.herokuapp.com/takeSlot/" + name + "/" + year + "/" + kerberos + "/" + timeslot; 

					$.ajax({

					  type: "POST",

					  url: postURL,

					  dataType:"text",

					  success: function(results, status) { 

						if (results == "true") {

							swal({

								title: "Thanks for signing up for an audition!",

								text: "Your audition is at " + timeslot + ". See you then!",

								confirmButtonColor: "#E00000",

								confirmButtonText: "OK"

							});

						$("#sign-up").children().fadeOut(500, function(){

							$("#sign-up").empty();

							confHTML="<h4 style='padding:0 19%;' class='text-center'>"

							confHTML+="Thanks! You've signed up for an audition on " + d.toLocaleString('en-US')

							confHTML+=". We'll see you at Building 4. Just look for our giant red banner! Please make sure you "

							confHTML+="note this date and time for your records, and email choral-info@mit.edu with any questions."

							confHTML+="</h4>"

							

							//SKETCHY AF CALENDAR STUFF <- took this out cause its bad

							calLink="http://www.google.com/calendar/event?action=TEMPLATE&text=Chorallaries%20Audition&dates=20160210T"

							var d = new Date();

							var time = timeslot.match(/(\d+)(?::(\d\d))?\s*([Pp]?)/);

							d.setHours( parseInt(time[1]) + (time[3] ? 12 : 0) );

							d.setMinutes( parseInt(time[2]) || 0 );

							d.setSeconds(0);

							calLink+=d.toLocaleTimeString('en-GB').split(":").join('')+"/20160210T"

							d=new Date(d.getTime() + 7*60000);

							calLink+=d.toLocaleTimeString('en-GB').split(":").join('')

							calLink+="&details="

							var info ="Each audition is 7 minutes long, including a few warm-ups followed by a solo of your choice."

							info+="This is where you really get to strut your stuff, so pick a song that really shows off your voice!"

							info+="The solo is the only thing you need to prepare in advance. If you have any questions, just email us at choral-info@mit.edu!"

							calLink+= encodeURIComponent(info).replace(/[!'()*]/g,function(c){return '%' + c.charCodeAt(0).toString(16);});

							calLink+="&location=4-158&trp=false&sprop=&sprop=name:"

							//END SKETCHY (Max Goldman have mercy on my soul)

							//confHTML+="<a href='"+calLink+"'>"

							//confHTML+="<button id='submitBtn' class='btn btn-default center-block'"

							//confHTML+="style='background-color:#ca010b;color:#fff;border-color:#ca010b'>Add to your Google Calendar</button></a> <br>"

							

							$("<img src=http://guitarhippies.com/wp-content/uploads/2015/04/music-meme-c-major41.jpg class='center-block' /><br>").appendTo("#sign-up" , {

									css: {

										opacity: 0

									}

								}).animate({ opacity: 1  });

							$(confHTML).appendTo("#sign-up" , {

									css: {

										opacity: 0

									}

								}).animate({ opacity: 1  });

							$("#main-title").hide()

							$("#end-title").show()

						});

					} else {

						swal({

							title: "Sorry, that timeslot isn't available anymore.",

							text: "Refresh the page and select another timeslot. We apologize for the inconvenience!",

							type: "error",

							confirmButtonColor: "#E00000",

							confirmButtonText: "OK"

						});

					}

				},

				error: function(j,e,s){

					swal({

							title: "Error",

							text: "Please try again later, or email choral-info@mit.edu. We apologize for the inconvenience.",

							type: "error",

							confirmButtonColor: "#E00000",

							confirmButtonText: "OK"

					});

				}

				});

		  		}

			);

		});

	});







function populateDates(available_slots) { 

	for (i in available_slots) { 

	

		timeString=available_slots[i].toLocaleTimeString().split(":")

		timeString=[timeString[0],":"+timeString[1]," "+timeString[2].substring(3)].join('')

		var radioHtml = "<div class='timeBox'><input type='radio'"

		radioHtml +=" value='"+available_slots[i]+"'>"

		radioHtml +=timeString+"</input></div>"

		if(available_slots[i].getDay() == 5){

		 $('#friday').show();

		 $(radioHtml).appendTo("#schedule")

		}

		else if(available_slots[i].getDay() == 6){

		 $('#saturday').show();

		 $(radioHtml).appendTo("#schedule2")

		}



		

	}

    $('.timeBox input[type="radio"]').each(function(i) {

        $(this).attr('id', 'radio' + i);

        var label = $('<label />', {'for': 'radio' + i}).html($(this).parent().html());

        $(this).parent().empty().append(label);

    });

	$('.timeBox:first').children().addClass('selected')

	$('#loading').hide(100);

	$('#r2').prepend('<br>');

	$('#r2').prepend('<br>');

	$('#r2').prepend('<br>');

	$('#r2').prepend('<br>');

	$('.timeBox label').show(100);

    $('.timeBox label').click(function () {

       $('.timeBox label').removeClass('selected');

       $(this).addClass('selected');

    });

    

}

