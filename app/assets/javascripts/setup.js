$(document).ready(function() {
	
	$('#clear-board').on('click', function() {
		clearBoard();
	});

	$('#reset-board').on('click', function() {
		resetBoard();
	});

});


//Adds back the piece on the bottom of the board that can be used for setup
function resetExtraPiece(piece){
	//find what color the piece being moved is
	var piece_color = piece.attr('class').indexOf("black") != -1 ? "black" : "white";
	//figure out and cashe the DOM tag
	var reset_point = $('#'+piece_color+'-'+piece.html());
	//remove any children in currently attached to the extra pieces spot
	reset_point.children().remove();
	//clone what we moved and place it back into the extra pieces spot
	piece.clone().removeClass('ui-draggable-dragging').appendTo(reset_point);
	makeDraggable();
}

//clears out the board and adds all pieces back to an initial Chess setup
function resetBoard(){
	clearBoard();
	beginningSetup = "a8-black-♜,b8-black-♞,c8-black-♝,d8-black-♛,e8-black-♚,f8-black-♝,g8-black-♞,h8-black-♜,a7-black-♟,b7-black-♟,c7-black-♟,d7-black-♟,e7-black-♟,f7-black-♟,g7-black-♟,h7-black-♟,a2-white-♟,b2-white-♟,c2-white-♟,d2-white-♟,e2-white-♟,f2-white-♟,g2-white-♟,h2-white-♟,a1-white-♜,b1-white-♞,c1-white-♝,d1-white-♛,e1-white-♚,f1-white-♝,g1-white-♞,h1-white-♜"
	loadPiecesOnBoard(beginningSetup.split(","));
	makeDraggable();
	saveCurrentBoard();
}

//removes all pieces from the board
function clearBoard(){
	$(".square:not(.unused)").each(function(e) {
		$(this).children().remove();
	});
	saveCurrentBoard();
}

//Saves the pieces - as they are on the board - to the db
function saveCurrentBoard(){
	//get what the board currently looks like and PUT it in the DB
	var initial_setup = getCurrentLayout();
	//figure out what board I am saving (exercise or practice)
	var save_to_table = $(location).attr('href').split('/')[3];
	//build field name for table I am saving to
	var start_field = save_to_table.slice(0, -1) + '[start]';
	//get which exercise I am working with (the id of it) so I can use it later on teh ajax call
	var id = $("#board").data('id')
	//build the URL I am sending data to
	var url_field = '/' + save_to_table + '/' + id;

	//create the json as a string for the field and data that will be passed in the ajax call
	var dataObj = "{\"" + start_field + "\":\"" + initial_setup +"\" }" ;
	//convert the json string into json
	dataObj = jQuery.parseJSON(dataObj);

    $.ajax({
    	url: url_field,
    	type: 'PUT',
    	data: dataObj,
		dataType: 'json'
	});
}

//Gets all piece locations based on board position, puts them into the format: "location-color-piece"
function getCurrentLayout(){
	var initial_setup = "";
	$(".square:not(.unused)").each(function(e) {
		var this_square = $(this);
		if (this_square.children().length > 0 && this_square.attr('id') != undefined){
			//console.log(this_square.children()[0])
			if (this_square.children().attr('class').indexOf("black") != -1){
	  			initial_setup = initial_setup + "," + this_square.attr('id') + "-" + "black" + "-" + this_square.children().html();	
			}
			else{
	  			initial_setup = initial_setup + "," + this_square.attr('id') + "-" + "white" + "-" + this_square.children().html();	
			}
		}
	});
	return initial_setup.substring(1);
}