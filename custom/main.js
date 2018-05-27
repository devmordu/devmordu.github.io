// JavaScript Document

/* Bootstrap Carousel */

var $item = $('.carousel-item'); 
var $wHeight = $(window).height();
$item.eq(0).addClass('active');
$item.height($wHeight); 
$item.addClass('full-screen');

$('.carousel im').each(function() {
  var $src = $(this).attr('src');
  var $color = $(this).attr('data-color');
  $(this).parent().css({
    'background-image' : 'url(' + $src + ')',
    'background-color' : $color
  });
  $(this).remove();
});

$(window).on('resize', function (){
  $wHeight = $(window).height();
  $item.height($wHeight);
});

$('.carousel').carousel({
  interval: 4000,
  pause: "false"
});


/* Navbar Script */
jQuery(document).ready(function($){
	var isLateralNavAnimating = false;
	
	//open/close lateral navigation
	$('.cd-nav-trigger').on('click', function(event){
		event.preventDefault();
		//stop if nav animation is running 
		if( !isLateralNavAnimating ) {
			if($(this).parents('.csstransitions').length > 0 ) isLateralNavAnimating = true; 
			
			$('body').toggleClass('navigation-is-open');
			$('.cd-navigation-wrapper').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				//animation is over
				isLateralNavAnimating = false;
			});
		}
	});
});

/* tabbed options */

jQuery(document).ready(function($){
	//wrap each one of your filter in a .cd-gallery-container div container
	bouncy_filter($('.cd-gallery-container'));

	function bouncy_filter($container) {
		$container.each(function(){
			var $this = $(this);
			var filter_list_container = $this.children('.cd-filter'),
				filter_values = filter_list_container.find('li:not(.placeholder) a'),
				filter_list_placeholder = filter_list_container.find('.placeholder a'),
				filter_list_placeholder_text = filter_list_placeholder.text(), 
				filter_list_placeholder_default_value = 'Select',
				gallery_item_wrapper = $this.children('.cd-gallery').find('.cd-item-wrapper');

			//store gallery items
			var gallery_elements = {};
			filter_values.each(function(){
				var filter_type = $(this).data('type');
				gallery_elements[filter_type] = gallery_item_wrapper.find('li[data-type="'+filter_type+'"]');
			});

			//detect click event
			filter_list_container.on('click', function(event){
				event.preventDefault();
				//detect which filter item was selected
				var selected_filter = $(event.target).data('type');
					
				//check if user has clicked the placeholder item (for mobile version)
				if( $(event.target).is(filter_list_placeholder) || $(event.target).is(filter_list_container) ) {

					(filter_list_placeholder_default_value == filter_list_placeholder.text()) ? filter_list_placeholder.text(filter_list_placeholder_text) : filter_list_placeholder.text(filter_list_placeholder_default_value) ;
					filter_list_container.toggleClass('is-open');

				//check if user has clicked a filter already selected 
				} else if( filter_list_placeholder.data('type') == selected_filter ) {
					
					filter_list_placeholder.text($(event.target).text()) ;
					filter_list_container.removeClass('is-open');	

				} else {
					//close the dropdown (mobile version) and change placeholder text/data-type value
					filter_list_container.removeClass('is-open');
					filter_list_placeholder.text($(event.target).text()).data('type', selected_filter);
					filter_list_placeholder_text = $(event.target).text();
					
					//add class selected to the selected filter item
					filter_values.removeClass('selected');
					$(event.target).addClass('selected');

					//give higher z-index to the gallery items selected by the filter
					show_selected_items(gallery_elements[selected_filter]);

					//rotate each item-wrapper of the gallery
					//at the end of the animation hide the not-selected items in the gallery amd rotate back the item-wrappers
					
					// fallback added for IE9
					var is_explorer_9 = navigator.userAgent.indexOf('MSIE 9') > -1;
					
					if( is_explorer_9 ) {
						hide_not_selected_items(gallery_elements, selected_filter);
						gallery_item_wrapper.removeClass('is-switched');
					} else {
						gallery_item_wrapper.addClass('is-switched').eq(0).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function() {		
							hide_not_selected_items(gallery_elements, selected_filter);
							gallery_item_wrapper.removeClass('is-switched');
						});
					}
				}
			});
		});
	}
});

function show_selected_items(selected_elements) {
	selected_elements.addClass('is-selected');
}

function hide_not_selected_items(gallery_containers, filter) {
	$.each(gallery_containers, function(key, value){
  		if ( key != filter ) {	
			$(this).removeClass('is-visible is-selected').addClass('is-hidden');

		} else {
			$(this).addClass('is-visible').removeClass('is-hidden is-selected');
		}
	});
}

/* side modal*/

jQuery(document).ready(function($){
	var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;

	//open team-member bio
	$('#cd-team').find('ul a').on('click', function(event){
		event.preventDefault();
		var selected_member = $(this).data('type');
		$('.cd-member-bio.'+selected_member+'').addClass('slide-in');
		$('.cd-member-bio-close').addClass('is-visible');

		// firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
		if( is_firefox ) {
			$('.mainclass').addClass('slide-out').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				$('body').addClass('overflow-hidden');
			});
		} else {
			$('.mainclass').addClass('slide-out');
			$('body').addClass('overflow-hidden');
		}

	});

	//close team-member bio
	$(document).on('click', '.cd-overlay, .cd-member-bio-close', function(event){
		event.preventDefault();
		$('.cd-member-bio').removeClass('slide-in');
		$('.cd-member-bio-close').removeClass('is-visible');

		if( is_firefox ) {
			$('.mainclass').removeClass('slide-out').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				$('body').removeClass('overflow-hidden');
			});
		} else {
			$('.mainclass').removeClass('slide-out');
			$('body').removeClass('overflow-hidden');
		}
	});
});


/* Carousel Animate script */

(function($) {
  //Function to animate slider captions
  function doAnimations(elems) {
    //Cache the animationend event in a variable
    var animEndEv = "webkitAnimationEnd animationend";

    elems.each(function() {
      var $this = $(this),
        $animationType = $this.data("animation");
      $this.addClass($animationType).one(animEndEv, function() {
        $this.removeClass($animationType);
      });
    });
  }

  //Variables on page load
  var $myCarousel = $("#carouselExampleIndicators"),
    $firstAnimatingElems = $myCarousel
      .find(".carousel-item:first")
      .find("[data-animation ^= 'animated']");

  //Initialize carousel
  $myCarousel.carousel();

  //Animate captions in first slide on page load
  doAnimations($firstAnimatingElems);

  //Other slides to be animated on carousel slide event
  $myCarousel.on("slide.bs.carousel", function(e) {
    var $animatingElems = $(e.relatedTarget).find(
      "[data-animation ^= 'animated']"
    );
    doAnimations($animatingElems);
  });
})(jQuery);

/* Text animation */

jQuery(document).ready(function($){
	//set animation timing
	var animationDelay = 2500,
		//loading bar effect
		barAnimationDelay = 3800,
		barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
		//letters effect
		lettersDelay = 50,
		//type effect
		typeLettersDelay = 150,
		selectionDuration = 500,
		typeAnimationDelay = selectionDuration + 800,
		//clip effect 
		revealDuration = 600,
		revealAnimationDelay = 1500;
	
	initHeadline();
	

	function initHeadline() {
		//insert <i> element for each letter of a changing word
		singleLetters($('.cd-headline.letters').find('b'));
		//initialise headline animation
		animateHeadline($('.cd-headline'));
	}

	function singleLetters($words) {
		$words.each(function(){
			var word = $(this),
				letters = word.text().split(''),
				selected = word.hasClass('is-visible');
			for (i in letters) {
				if(word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
				letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>': '<i>' + letters[i] + '</i>';
			}
		    var newLetters = letters.join('');
		    word.html(newLetters).css('opacity', 1);
		});
	}

	function animateHeadline($headlines) {
		var duration = animationDelay;
		$headlines.each(function(){
			var headline = $(this);
			
			if(headline.hasClass('loading-bar')) {
				duration = barAnimationDelay;
				setTimeout(function(){ headline.find('.cd-words-wrapper').addClass('is-loading') }, barWaiting);
			} else if (headline.hasClass('clip')){
				var spanWrapper = headline.find('.cd-words-wrapper'),
					newWidth = spanWrapper.width() + 10
				spanWrapper.css('width', newWidth);
			} else if (!headline.hasClass('type') ) {
				//assign to .cd-words-wrapper the width of its longest word
				var words = headline.find('.cd-words-wrapper b'),
					width = 0;
				words.each(function(){
					var wordWidth = $(this).width();
				    if (wordWidth > width) width = wordWidth;
				});
				headline.find('.cd-words-wrapper').css('width', width);
			};

			//trigger animation
			setTimeout(function(){ hideWord( headline.find('.is-visible').eq(0) ) }, duration);
		});
	}

	function hideWord($word) {
		var nextWord = takeNext($word);
		
		if($word.parents('.cd-headline').hasClass('type')) {
			var parentSpan = $word.parent('.cd-words-wrapper');
			parentSpan.addClass('selected').removeClass('waiting');	
			setTimeout(function(){ 
				parentSpan.removeClass('selected'); 
				$word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
			}, selectionDuration);
			setTimeout(function(){ showWord(nextWord, typeLettersDelay) }, typeAnimationDelay);
		
		} else if($word.parents('.cd-headline').hasClass('letters')) {
			var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
			hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
			showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

		}  else if($word.parents('.cd-headline').hasClass('clip')) {
			$word.parents('.cd-words-wrapper').animate({ width : '2px' }, revealDuration, function(){
				switchWord($word, nextWord);
				showWord(nextWord);
			});

		} else if ($word.parents('.cd-headline').hasClass('loading-bar')){
			$word.parents('.cd-words-wrapper').removeClass('is-loading');
			switchWord($word, nextWord);
			setTimeout(function(){ hideWord(nextWord) }, barAnimationDelay);
			setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('is-loading') }, barWaiting);

		} else {
			switchWord($word, nextWord);
			setTimeout(function(){ hideWord(nextWord) }, animationDelay);
		}
	}

	function showWord($word, $duration) {
		if($word.parents('.cd-headline').hasClass('type')) {
			showLetter($word.find('i').eq(0), $word, false, $duration);
			$word.addClass('is-visible').removeClass('is-hidden');

		}  else if($word.parents('.cd-headline').hasClass('clip')) {
			$word.parents('.cd-words-wrapper').animate({ 'width' : $word.width() + 10 }, revealDuration, function(){ 
				setTimeout(function(){ hideWord($word) }, revealAnimationDelay); 
			});
		}
	}

	function hideLetter($letter, $word, $bool, $duration) {
		$letter.removeClass('in').addClass('out');
		
		if(!$letter.is(':last-child')) {
		 	setTimeout(function(){ hideLetter($letter.next(), $word, $bool, $duration); }, $duration);  
		} else if($bool) { 
		 	setTimeout(function(){ hideWord(takeNext($word)) }, animationDelay);
		}

		if($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
			var nextWord = takeNext($word);
			switchWord($word, nextWord);
		} 
	}

	function showLetter($letter, $word, $bool, $duration) {
		$letter.addClass('in').removeClass('out');
		
		if(!$letter.is(':last-child')) { 
			setTimeout(function(){ showLetter($letter.next(), $word, $bool, $duration); }, $duration); 
		} else { 
			if($word.parents('.cd-headline').hasClass('type')) { setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('waiting'); }, 200);}
			if(!$bool) { setTimeout(function(){ hideWord($word) }, animationDelay) }
		}
	}

	function takeNext($word) {
		return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
	}

	function takePrev($word) {
		return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
	}

	function switchWord($oldWord, $newWord) {
		$oldWord.removeClass('is-visible').addClass('is-hidden');
		$newWord.removeClass('is-hidden').addClass('is-visible');
	}
});

/*  */