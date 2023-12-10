// Hello.
//
// This is The Scripts used for ___________ Theme
//
//

function main() {

(function () {
   'use strict';

   /* ==============================================
  	Testimonial Slider
  	=============================================== */

  	$('a.page-scroll').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top - 40
            }, 900);
            return false;
          }
        }
      });

    /*====================================
    Show Menu on Book
    ======================================*/
    $(window).bind('scroll', function() {
        var navHeight = $(window).height() - 100;
        if ($(window).scrollTop() > navHeight) {
            $('.navbar-default').addClass('on');
        } else {
            $('.navbar-default').removeClass('on');
        }
    });

    $('body').scrollspy({
        target: '.navbar-default',
        offset: 80
    })

  	$(document).ready(function() {
  	  $("#team").owlCarousel({

  	      navigation : false, // Show next and prev buttons
  	      slideSpeed : 300,
  	      paginationSpeed : 400,
  	      autoHeight : true,
  	      itemsCustom : [
				        [0, 1],
				        [450, 2],
				        [600, 2],
				        [700, 2],
				        [1000, 4],
				        [1200, 4],
				        [1400, 4],
				        [1600, 4]
				      ],
  	  });

  	  $("#announcements").owlCarousel({

  	      navigation : false, // Show next and prev buttons
          pagination: false,
          center: true,
          loop: true,
  	      slideSpeed : 300,
  	      paginationSpeed : 400,
  	      autoHeight : true,
  	      itemsCustom : [ // How many items per screen resolution
				        [0, 1],
				        [450, 2],
				        [600, 2],
				        [700, 2],
				        [1000, 4],
				        [1200, 5],
				        [1400, 5],
				        [1600, 5]
				      ],
  	  });

      $("#testimonial").owlCarousel({
        navigation : false, // Show next and prev buttons
        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem:true
        });

  	});

  	/*====================================
    Mailing List Sign-Up
    ======================================*/
    var formstr = '<div class="container audition-form">' +
        '<form id="email-form"><div class="row"><div class="col-md-4 col-md-offset-4"><div class="form-group"><label for="exampleInputPassword1">Name</label></br><input type="text" class="form-control" id="exampleInputPassword1" name="name" placeholder="Name"></div><div class="form-group"><label for="exampleInputEmail1">Email address</label></br><input name="email" type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter email"></div></div></div><button type="submit" id="emailSubmitButton" class="btn tf-btn btn-default">Submit</button></form></div>';

    $("#mailing-btn").click(function() {
        $("#audition-display").remove();
        $("#audition-wrapper").append(formstr);
	$("#email-form").submit(function(event) {
		$.getJSON('http://choral.scripts.mit.edu/email/subscribe_2015.php?callback=?', {'email' : $('#exampleInputEmail1').val(), 'name' : $('#exampleInputPassword1').val()});
		var successDiv = $("div");
		//successDiv.addClass("emailSuccess").text("Thanks for signing up!");
		//$(".audition-form").html("");
		//$(".audition-form").append(successDiv);
		$(".audition-form").text("Thanks for signing up!");
		event.preventDefault();
	    });
    });

  	/*====================================
    Portfolio Isotope Filter
    ======================================*/
    $(window).load(function() {
        var $container = $('#lightbox');
        $container.isotope({
            filter: '*',
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
        });
        $('.cat a').click(function() {
            $('.cat .active').removeClass('active');
            $(this).addClass('active');
            var selector = $(this).attr('data-filter');
            $container.isotope({
                filter: selector,
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });
            return false;
        });

    });



}());


}
main();
