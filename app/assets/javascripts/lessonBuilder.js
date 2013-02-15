$('.lessons.builder').ready(function() {

 	$('.connectedSortable').droppable({
    	drop: function(event, ui) {
    		//console.log($(this).attr('id'))
//    		console.log($(ui.draggable).next().html());
    		updateExercisesLessonId($(ui.draggable).attr('id'), $(this).attr('id'));

    		var sortedItems = $(this)

    		var counter = 1
    		//Using a Timeout that has not timing - I cannot figure out any other way
    		//to force the div of sorted items to give me back "after-drop" order rather than the
    		//"before drop order"
			setTimeout(function() {
	     		sortedItems.children().each(function() {
				   // console.log("exercises" + " " + $(this).attr('id') + " " + "");
				    updateExercise("exercises", $(this).attr('id'), $(this).next().attr('id'), counter);

				    console.log( $(this).next().attr('id'));
				    counter++
		 		});

			}, 0);

		}
  	});
});

//updates Exercise's lesson_id
function updateExercisesLessonId(exercise_id, new_lesson_id){

	if (new_lesson_id === undefined){ new_lesson_id = ""}
	//figure out what board I am saving (exercise or practice)
	var save_to_table = "exercises" //$(location).attr('href').split('/')[3];
	//build field name for table I am saving to
	var save_to_column = save_to_table.slice(0, -1) + '[lesson_id]';
	// //get which exercise I am working with (the id of it) so I can use it later on teh ajax call
	// var id = $("#board").data('id')
	//build the URL I am sending data to
	var url_field = '/' + save_to_table + '/' + exercise_id;

	//create the json as a string for the field and data that will be passed in the ajax call
	var dataObj = "{\"" + save_to_column + "\":\"" + new_lesson_id +"\" }" ;
	//convert the json string into json
	dataObj = jQuery.parseJSON(dataObj);

// console.log(url_field)
// console.log(dataObj)

    $.ajax({
    	url: url_field,
    	type: 'PUT',
    	data: dataObj,
		dataType: 'json'
	});
}

//updates Exercise's lesson_id
function updateExercise(tableName, exercise_id, nextExercise, sortForLesson){

	//build field name for table I am saving to
	var save_to_column1 = tableName.slice(0, -1) + '[nextExercise]';
	var save_to_column2 = tableName.slice(0, -1) + '[sortForLesson]';

	//build the URL I am sending data to
	var url_field = '/' + tableName + '/' + exercise_id;

	//create the json as a string for the field and data that will be passed in the ajax call
	var dataObj = "{\"" + save_to_column1 + "\":\"" + nextExercise +"\", \"" + save_to_column2 + "\":\"" + sortForLesson +"\"}" ;


	//convert the json string into json
	dataObj = jQuery.parseJSON(dataObj);

// console.log(url_field)
 console.log(dataObj)

    $.ajax({
    	url: url_field,
    	type: 'PUT',
    	data: dataObj,
		dataType: 'json'
	});
}