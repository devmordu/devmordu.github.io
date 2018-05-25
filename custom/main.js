// JavaScript Document

/* Bootstrap Carousel */

var $item = $('.carousel-item'); 
var $wHeight = $(window).height();
$item.eq(0).addClass('active');
$item.height($wHeight); 
$item.addClass('full-screen');

$('.carousel img').each(function() {
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
  interval: 6000,
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


/* */
