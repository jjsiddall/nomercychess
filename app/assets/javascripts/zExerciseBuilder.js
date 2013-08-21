$('.exercises.edit, .exercises.new').ready(function() {
	
	$('#initialSetup').on('click', function() {
		saveCurrentBoard();
	});

	$('.move:first').addClass('playToHere');
	playMove();

	makeTableClickable();

	//this commits the move after its been made
	$('.save-Move').on('click', function() {
  		if ($("#move-number").length != 0){ saveMove();}
  	});

	//this is for the last row of the moves table - it takes to all the way back to the setup
	$('.opening').on('click', function() {
  		clearBoard();
		loadPiecesOnBoard($("#board").data('initial_setup').split(","));
		makeDraggable();
		$(".showingMove").removeClass("showingMove");
		$(".warning td.explanation").html($("#edit-Explanation").val());
		$(".warning").removeClass("warning");
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

			if ($(".warning").length != 0) {
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

	//if the user has clicked a specific row then they are intending to update that row
	//here we update the UI to match the user change

	if (movedColor === "white"){
		$(".warning td:nth-child(3)").html(movedPiece);
	    $(".warning td:nth-child(4)").html(movedFrom);
	    $(".warning td:nth-child(5)").html(movedTo); 
	}
	else{
		$(".warning td:nth-child(6)").html(movedPiece);
	    $(".warning td:nth-child(7)").html(movedFrom);
	    $(".warning td:nth-child(8)").html(movedTo); 
	}
}

//update Move
//similar to saveMove(), but is used for moves already in the DB (so uses PUT rather than POST)
function updateMove(){

	var tableName = "moves";
	var columnName= tableName.slice(0, -1);

	console.log($(".warning td:nth-child(1)"))

	//build the URL I am sending data to
	var url_field =  $(".warning td:nth-child(1)").children().attr("href");

	console.log(url_field);

	//create the json as a string for the field and data that will be passed in the ajax call
	//we use all the columns of table as it is easier to do a blanket update
	var dataObj = "{\"" + columnName + '[move_number]' + "\":\"" + $(".warning td:nth-child(2)").html() +
			   "\", \"" + columnName + '[piece_white]' + "\":\"" + $(".warning td:nth-child(3)").html() +
			   "\", \"" + columnName + '[starting_coordinate_white]' + "\":\"" + $(".warning td:nth-child(4)").html() +
			   "\", \"" + columnName + '[ending_coordinate_white]' + "\":\"" + $(".warning td:nth-child(5)").html() +
			   "\", \"" + columnName + '[piece_black]' + "\":\"" + $(".warning td:nth-child(6)").html() +
			   "\", \"" + columnName + '[starting_coordinate_black]' + "\":\"" + $(".warning td:nth-child(7)").html() +
			   "\", \"" + columnName + '[ending_coordinate_black]' + "\":\"" + $(".warning td:nth-child(8)").html() +
			   "\", \"" + columnName + '[explanation]' + "\":\"" + $(".warning td:nth-child(9)").html() +
			   "\", \"" + columnName + '[exercise_id]' + "\":\"" + $('#board').data('id') +
			   "\", \"" + columnName + '[computer]' + "\":\"" + $('input[name=optionsRadios]:checked').val() +
			   "\"}" ;

	//convert the json string into json
	dataObj = jQuery.parseJSON(dataObj);

    $.ajax({
    	url: url_field,
    	type: 'PUT',
    	data: dataObj,
		dataType: 'json'
	});

}

//update / add Move
function saveMove(){

	var tableName = "moves";
	var columnName= tableName.slice(0, -1);

	//build the URL I am sending data to
	var url_field = '/' + tableName; //+ '/' + exercise_id;

	//create the json as a string for the field and data that will be passed in the ajax call
	var dataObj = "{\"" + columnName + '[piece_white]' + "\":\"" + $('#white-piece').html() +
			   "\", \"" + columnName + '[starting_coordinate_white]' + "\":\"" + $('#white-start').html() +
			   "\", \"" + columnName + '[ending_coordinate_white]' + "\":\"" + $('#white-end').html() +
			   "\", \"" + columnName + '[piece_black]' + "\":\"" + $('#black-piece').html() +
			   "\", \"" + columnName + '[starting_coordinate_black]' + "\":\"" + $('#black-start').html() +
			   "\", \"" + columnName + '[ending_coordinate_black]' + "\":\"" + $('#black-end').html() +
			   "\", \"" + columnName + '[explanation]' + "\":\"" + $('#exp-textbox').val() +
			   "\", \"" + columnName + '[exercise_id]' + "\":\"" + $('#board').data('id') +
			   "\", \"" + columnName + '[move_number]' + "\":\"" + $('#move-number').html() +
			   "\", \"" + columnName + '[computer]' + "\":\"" + $('input[name=optionsRadios]:checked').val() +
			   "\"}" ;

	//convert the json string into json
	dataObj = jQuery.parseJSON(dataObj);

// console.log(url_field)
 console.log(dataObj)

    $.ajax({
    	url: url_field,
    	type: 'POST',
    	data: dataObj,
		dataType: 'json'
	});

	updateIds();
}

function updateIds(){
	//moves what is in the TextArea into the associated table cell
	$('#explanation').html($('#exp-textbox').val());
	//removes the Text Area
	$('#exp-textbox').remove();
	
	//renames the newest move to be a "move"
	$('#new-move').attr('class', "move").attr('id', "");

	//gets rid of all the ids needed for updating (they will be used for the next move)
	$('#move-number').attr('id', "");
	$('#white-piece').attr('id', "");
    $('#white-start').attr('id', "");
    $('#white-end').attr('id', "");
	$('#black-piece').attr('id', "");
    $('#black-start').attr('id', "");
    $('#black-end').attr('id', "");
    $('#explanation').attr('id', "");
}

function makeTableClickable(){
	$('td:not(.new, .explanation, .button_edit, .button_delete, .opening)').on('click', function() {

		//if .warning is already there it means there is something being edited and now we are clicking it again so we should save
		if ($(".warning").length === 0) {

			$(this).parent().addClass("playToHere").addClass("warning");

			//store what is currently in the Explanation column
			var currentExplanation = $(".warning td.explanation").html();
			//remove current html from Explanation cell
			$(".warning td.explanation").html("");
			//append a textbox to the Explanation cell
			$(".warning td.explanation").append('<textarea id="edit-Explanation" rows="2"></textarea>');
			//add what was in the Explanation cell to the textarea
			$("#edit-Explanation").val(currentExplanation);

			//run "playMove" goes one move at a time
			playMove();		
		}
		else {

			 $(".warning td.explanation").html($("#edit-Explanation").val());

			updateMove();		
			$(".warning").removeClass("warning");			
		}
	});
}