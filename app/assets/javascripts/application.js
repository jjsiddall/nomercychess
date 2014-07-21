// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require jquery.ui.all
//= require bootstrap
//= require_tree .

			
function completion(lastCompleted, exercise_id){
	//find the user that is logged in (its hidden on the view - specifically where we show logged in)
	var user_id = parseInt($("#nav-log").data('navid').split("-")[1]);
	
	//if no user is logged in <OR> icon-check is present then dont save any progress
	if (user_id === 0 || $('.icon-check').length >0 ){ return };
	
	console
	console.log("Completed the " + lastCompleted);

	var tableName = "completions";
	var columnName= tableName.slice(0, -1);

	//set to POST first for the inital creation of the record in the Completions table
	var databaseCallType = "POST";
	//build the URL I am sending data to
	var url_field = '/' + tableName; //+ '/' + exercise_id;

	// //as a practice we want to change the type of database call and then address to the call
	// if (lastCompleted === "practice"){ 
	// 	databaseCallType = "PUT";
	// 	url_field = url_field + '/' + exercise_id;

	// }

	//create the json as a string for the field and data that will be passed in the ajax call
	var dataObj = "{\"" + columnName + '[user_id]' + "\":\"" + user_id +
			   "\", \"" + columnName + '[exercise_id]' + "\":\"" + exercise_id +
			   "\", \"" + columnName + '[last_completed]' + "\":\"" + lastCompleted +
			   "\"}" ;

	//convert the json string into json
	dataObj = jQuery.parseJSON(dataObj);

// console.log(url_field)
 console.log(dataObj)

    $.ajax({
    	url: url_field,
    	type: databaseCallType,
    	data: dataObj,
		dataType: 'json'
	});
}

$( function() {
  // init Isotope
  var $container = $('.isotope').isotope({
    itemSelector: '.element-item',
    layoutMode: 'fitRows'
  });
  // filter functions
  var filterFns = {
    // show if number is greater than 50
    numberGreaterThan50: function() {
      var number = $(this).find('.number').text();
      return parseInt( number, 10 ) > 50;
    },
    // show if name ends with -ium
    ium: function() {
      var name = $(this).find('.name').text();
      return name.match( /ium$/ );
    }
  };
  // bind filter button click
  $('#filters').on( 'click', 'button', function() {
    var filterValue = $( this ).attr('data-filter');
    // use filterFn if matches value
    filterValue = filterFns[ filterValue ] || filterValue;
    $container.isotope({ filter: filterValue });
  });
  // change is-checked class on buttons
  $('.button-group').each( function( i, buttonGroup ) {
    var $buttonGroup = $( buttonGroup );
    $buttonGroup.on( 'click', 'button', function() {
      $buttonGroup.find('.is-checked').removeClass('is-checked');
      $( this ).addClass('is-checked');
    });
  });
  
});
