$('.exercises.edit, .exercises.new').ready(function() {

	//adds click to "Set" button that resets the board to all pieces in their opening position
	$('#initialSetup').on('click', function() {
		saveCurrentBoard();
	});

	//Adds "showingMove" class to the bottom move and "playToHere" class to the top move preparing it for the "playMove()" function
	$('.move:last').addClass('showingMove');
	$('.move:first').addClass('playToHere');

	//Looks at where the board currently is ("showingMove") and does all the moves to get it to "playToHere"
	playMove();

	//Allows user to click the table and update the explaination
	makeTableClickable();

	//this is for the last row of the moves table - it takes to all the way back to the setup
	$('.opening').on('click', function() {
  		clearBoard();
		loadPiecesOnBoard($("#board").data('initial_setup').split(","));
		makeDraggable();
		$(".showingMove").removeClass("showingMove");
		$(this).parent().addClass("showingMove");

		//if something is being edited
		$(".background-yellow div.explanation").html($("#edit-Explanation").val());
		updateMove();
		$(".background-yellow").removeClass("background-yellow");
  	});

  	$('.square').droppable({
    	drop: function(event, ui) {
    		//cashe the item that is being dragged
			pieceBeingMoved = $(ui.draggable);

			//get what piece is being moved
			movedPiece = pieceBeingMoved.html();
			//get what square the piece is coming from
			movedFrom = pieceBeingMoved.parent().attr("id");
			//get what square the piece is coming to
			movedTo = $(this).attr("id");
			//get what color is being moved
			movedColor = (pieceBeingMoved.attr("class").indexOf("white") > 0) ? "white" : "black" ;

			//remove any children on the spot being dropped on
			$(this).children().remove();
			//add the dragged piece to the board
			$(this).append(pieceBeingMoved);
			pieceBeingMoved.css("top", "");
			pieceBeingMoved.css("left", "");

			if ($(".background-yellow").length != 0) {
				editMove(movedPiece, movedFrom, movedTo, movedColor);
			}
			else {
				newMove(movedPiece, movedFrom, movedTo, movedColor);
			}
 	    	//reset the extra piece set
			resetExtraPiece($(ui.draggable));
    	}
  	});

});

function newMove(movedPiece, movedFrom, movedTo, movedColor){

	//if the user has clicked a specific row then they are intending to update that row
	//here we update the UI to match the user change

	if (movedColor === "white"){
		$("#move_piece_white").val(movedPiece);
	    $("#move_starting_coordinate_white").val(movedFrom);
	    $("#move_ending_coordinate_white").val(movedTo); 
	}
	else{
		$("#move_piece_black").val(movedPiece);
	    $("#move_starting_coordinate_black").val(movedFrom);
	    $("#move_ending_coordinate_black").val(movedTo); 
	}
	
	//true === White is computer, false === Black is computer
	var user = $('input:radio[name=optionsRadios]:checked').val()
	if (user === "white"){
		$('#move_computer_false').attr('checked', true);
		$('#move_computer_true').attr('checked', false);
	}
	else {
		$('#move_computer_false').attr('checked', false);
		$('#move_computer_true').attr('checked', true);
	}

	$('#move_move_number').val($('.move_number').length);
	$('#move_exercise_id').val($('#board').data('id'));
}

function editMove(movedPiece, movedFrom, movedTo, movedColor){

console.log(movedPiece+" : "+movedFrom+" : "+movedTo+" : "+movedColor)

	//if the user has clicked a specific row then they are intending to update that row
	//here we update the UI to match the user change
	if (movedColor === "white"){
		$(".background-yellow div.piece_white").html(movedPiece);
	    $(".background-yellow div.start_white").html(movedFrom);
	    $(".background-yellow div.end_white").html(movedTo); 
	}
	else{

		$(".background-yellow div.piece_black").html(movedPiece);
	    $(".background-yellow div.start_black").html(movedFrom);
	    $(".background-yellow div.end_black").html(movedTo); 
	}
}

//update Move
//similar to saveMove(), but is used for moves already in the DB (so uses PUT rather than POST)
function updateMove(){

	var tableName = "moves";
	var columnName= tableName.slice(0, -1);
	var moveid = $(".background-yellow").data("moveid");

	if(moveid === undefined){return};

	//build the URL I am sending data to
	var url_field =  "/" + tableName + "/" +moveid;

	console.log(url_field);

	//create the json as a string for the field and data that will be passed in the ajax call
	//we use all the columns of table as it is easier to do a blanket update
	var dataObj = "{\"" + columnName + '[piece_white]' + "\":\"" + $(".background-yellow div.piece_white").html() +
			   "\", \"" + columnName + '[starting_coordinate_white]' + "\":\"" + $(".background-yellow div.start_white").html() +
			   "\", \"" + columnName + '[ending_coordinate_white]' + "\":\"" + $(".background-yellow div.end_white").html() +
			   "\", \"" + columnName + '[piece_black]' + "\":\"" + $(".background-yellow div.piece_black").html() +
			   "\", \"" + columnName + '[starting_coordinate_black]' + "\":\"" + $(".background-yellow div.start_black").html() +
			   "\", \"" + columnName + '[ending_coordinate_black]' + "\":\"" + $(".background-yellow div.end_black").html() +
			   "\", \"" + columnName + '[explanation]' + "\":\"" + $(".background-yellow div.explanation").html() +
			   // "\", \"" + columnName + '[exercise_id]' + "\":\"" + $('#board').data('id') +
			   // "\", \"" + columnName + '[computer]' + "\":\"" + $('input[name=optionsRadios]:checked').val() +
			   "\"}" ;

	console.log(dataObj)

	//convert the json string into json
	dataObj = jQuery.parseJSON(dataObj);

    $.ajax({
    	url: url_field,
    	type: 'PUT',
    	data: dataObj,
		dataType: 'json'
	});

}

// //update / add Move
// function saveMove(){

// 	var tableName = "moves";
// 	var columnName= tableName.slice(0, -1);

// 	//build the URL I am sending data to
// 	var url_field = '/' + tableName; //+ '/' + exercise_id;

// 	//create the json as a string for the field and data that will be passed in the ajax call
// 	var dataObj = "{\"" + columnName + '[piece_white]' + "\":\"" + $('#white-piece').html() +
// 			   "\", \"" + columnName + '[starting_coordinate_white]' + "\":\"" + $('#white-start').html() +
// 			   "\", \"" + columnName + '[ending_coordinate_white]' + "\":\"" + $('#white-end').html() +
// 			   "\", \"" + columnName + '[piece_black]' + "\":\"" + $('#black-piece').html() +
// 			   "\", \"" + columnName + '[starting_coordinate_black]' + "\":\"" + $('#black-start').html() +
// 			   "\", \"" + columnName + '[ending_coordinate_black]' + "\":\"" + $('#black-end').html() +
// 			   "\", \"" + columnName + '[explanation]' + "\":\"" + $('#exp-textbox').val() +
// 			   "\", \"" + columnName + '[exercise_id]' + "\":\"" + $('#board').data('id') +
// 			   "\", \"" + columnName + '[move_number]' + "\":\"" + $('#move-number').html() +
// 			   "\", \"" + columnName + '[computer]' + "\":\"" + $('input[name=optionsRadios]:checked').val() +
// 			   "\"}" ;

// 	//convert the json string into json
// 	dataObj = jQuery.parseJSON(dataObj);

// // console.log(url_field)
//  console.log(dataObj)

//     $.ajax({
//     	url: url_field,
//     	type: 'POST',
//     	data: dataObj,
// 		dataType: 'json'
// 	});

// 	updateIds();
// }

// function updateIds(){
// 	//moves what is in the TextArea into the associated table cell
// 	$('#explanation').html($('#exp-textbox').val());
// 	//removes the Text Area
// 	$('#exp-textbox').remove();
	
// 	//renames the newest move to be a "move"
// 	$('#new-move').attr('class', "move").attr('id', "");

// 	//gets rid of all the ids needed for updating (they will be used for the next move)
// 	$('#move-number').attr('id', "");
// 	$('#white-piece').attr('id', "");
//     $('#white-start').attr('id', "");
//     $('#white-end').attr('id', "");
// 	$('#black-piece').attr('id', "");
//     $('#black-start').attr('id', "");
//     $('#black-end').attr('id', "");
//     $('#explanation').attr('id', "");
// }

function makeTableClickable(){

	$('.move_number, .piece_white, .start_white, .end_white, .piece_black, .start_black, .end_black').on('click', function() {
		
		//if .warning is already there it means there is something being edited and now we are clicking it again so we should save
		if ($(".background-yellow").length === 0) {

			$(this).parent().addClass("playToHere").addClass("background-yellow");

			//store what is currently in the Explanation column
			var currentExplanation = $(".background-yellow div.explanation").html();
			//remove current html from Explanation cell
			$(".background-yellow div.explanation").html("");
			//append a textbox to the Explanation cell
			$(".background-yellow div.explanation").append('<textarea id="edit-Explanation" class="form-control text_area" cols="40" rows="5"></textarea>');
			//add what was in the Explanation cell to the textarea
			$("#edit-Explanation").val(currentExplanation);

			//run "playMove" goes one move at a time
			playMove();		
		}
		else {

			 $(".background-yellow div.explanation").html($("#edit-Explanation").val());

			updateMove();		
			$(".background-yellow").removeClass("background-yellow");			
		}
	});
}