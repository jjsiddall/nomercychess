$('.exercises.builder').ready(function() {
	
	//this commits the move after its been made
	$('.save-Move').on('click', function() {
  		if ($("#move-number").length != 0){ saveMove();}
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

			showMove(movedPiece, movedFrom, movedTo, movedColor);
//			saveMove(movedPiece, movedFrom, movedTo, movedColor);
    	}
  	});

});

function showMove(movedPiece, movedFrom, movedTo, movedColor){
	console.log($(".new-move"))
	
	//get last move number in the current list and add one for the current move number
	var moveNumber = parseInt($('.move:last td:first-child').html())+1;
	//set moveNumber to 1 if not defined
	if (isNaN(moveNumber)){ moveNumber = 1 };

console.log(moveNumber)

	if ($("#move-number").length===0){
		$('#move-list').append("<tr id='new-move'> \
			<td id='move-number'>"+ moveNumber +"</td> \
			<td id='white-piece'>...</td> \
            <td id='white-start'></td> \
            <td id='white-end'></td> \
			<td id='black-piece'>...</td> \
            <td id='black-start'></td> \
            <td id='black-end'></td> \
            <td id='explanation'><textarea id='exp-textbox' rows='3' class='span5'></textarea></td> \
          </tr>")
	}

	if (movedColor === "white"){
		$('#white-piece').html(movedPiece);
        $('#white-start').html(movedFrom);
        $('#white-end').html(movedTo); 
	}
	else{
		$('#black-piece').html(movedPiece);
        $('#black-start').html(movedFrom);
        $('#black-end').html(movedTo); 
	}
	
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