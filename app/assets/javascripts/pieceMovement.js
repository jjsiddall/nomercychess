//var showPopover = true;

$('.exercises.show').ready(function() {
	//shows the opening lessons Modal - describes the lesson
	$('#descriptionModal').modal('show');

	//Adds the click event to the "Next" button
	$('#nextMove').on('click', function() {
		//grab the first notShownMove in the list
		var accordion = $('.notShownMove:first')
		//Gets the notShown's ID - this will be used further on for the "click" event of the accordion
		var accordionID = accordion.data("accordionnumber");
		//checks that there is an accordion for the next move
		if (accordionID != undefined){
			//unhides the top notShownMove and takes the "notShownMove" off
			accordion.removeClass("notShownMove");
			//Fires the "click/show" action (which executes the move below) to display the current and retract the previous ones
			//using the id gotten above
			$('#toggleMe-'+accordionID).click();
		}
		else{
			//show the conclusion popover when there are no more moves on the list
			$('#conclusionModal').modal('show');
		}
		
	});

	//event that is triggered when the accordion is shown for the specific level
	$('.accordion-body').on('show', function(){
		//add "playToHere" to the accordion that is the final move to show
		$(this).parent().addClass("playToHere");
		//run "playMove" goes one move at a time
		playMove();
		//disables the "next" button so the user cannot go to the next move until the first is completed
		$('#nextMove').prop('disabled', true);		
	});

	//an event listener that pays attention to when the previous move completed (and then fires the next)
	$(document).on('move/completed', function() {
		//assuming there is a accodion being looked at the system will go to the next move
		if ($(".playToHere").data("accordionnumber") != null) {
			playMove();
		}	
	});
});

function one_move(current_move, piece){

	//bail out of this function if the piece coming in is not a piece (but is "..." instead)
	if (piece === "..."){return};

	//remove any popovers that are currently on the board
	//clear_popovers();

	var rank_change = find_change_in_rank(current_move);
	var file_change = find_change_in_file(current_move);
		
	if (((file_change > 1) || (file_change < -1)) && (piece === "♚")){
		console.log("castle!")
		
		//the initial King move (no different than basic movement)
		move_file(current_move[0], current_move[1], file_change );

		//we know this is a castle and have moved the King, now need to move the associated rook
		castle(current_move, file_change);

	}	//need to determine if its a knight move or a bishop/queen/king as they have particular movement
	else if ((rank_change != 0) && (file_change != 0) && (piece != "♞")){
		move_diagonal(current_move[0], current_move[1], rank_change, file_change)
	}
	else{
		//for pieces that don't use rank and file we do both anyways (as the one that does not matter is executed, but 
		//without impact)  doing this allows us to have append run once after everything else is complete:

		//first we move the piece by rank
		move_rank(current_move[0] , rank_change);
		//second we move the piece by file and send in the new square so it can be appended
		move_file(current_move[0] , current_move[1], file_change );
	}

	//debugging
	highlightSquare(current_move[0], "yellow");
	highlightSquare(current_move[1], "yellow");

}

//Passing in start and end square, now to determine movement number of squares
//subtract rank numbers gives the up/down value
function find_change_in_rank(start_end_array){ return start_end_array[1].charAt(1) - start_end_array[0].charAt(1);}
//convert file from alpha to number and find right/left value
function find_change_in_file(start_end_array){ return (start_end_array[1].charAt(0).charCodeAt()-96) - (start_end_array[0].charAt(0).charCodeAt()-96);}

//Basic Movement: Up or Down the board
function move_rank(squareName, distanceInSquares){
	//get DOM element to be moved
	var pieceBeingMoved = $("#"+squareName).children();
	//find its current Up-Down position on the board (needed due to
	//position absolute)
	var oldSpot = pieceBeingMoved.position().top;
	//set current Up-Down position so it does not fly to the top of the board (due to 
	//it starting at 0)
	$(pieceBeingMoved).css("top", oldSpot +"px");
	//set what the new spot will be from the old (it is in squares and each square
	//is variable, so get the value and then multiply them out)
    var square_size = parseInt($('.square').css("height"));

    var newSpot = oldSpot-(distanceInSquares*square_size);
    //animate the movement
  	$(pieceBeingMoved).animate( {"top": newSpot +"px"}, 500 );	
}

//Basic Movement: Right or left on the board
function move_file(old_square, new_square, distanceInSquares){

	//get DOM element to be moved
	var pieceBeingMoved = $("#"+old_square).children();
	//find its current Right-Left position on the board (needed due to
	//position absolute)
	var oldSpot = pieceBeingMoved.position().left;
	//set current Rigth-Left position so it does not fly to the top of the board (due to 
	//it starting at 0)
	$(pieceBeingMoved).css("left", oldSpot +"px");
	//set what the new spot will be from the old (it is in squares and each square
	//is variable, so get the value and then multiply them out)
    var square_size = parseInt($('.square').css("height"));

    var newSpot = oldSpot+(distanceInSquares * square_size);
    //animate the movement
  	$(pieceBeingMoved).animate( {"left": newSpot +"px"}, 500, function() {
    	// Animation complete append piece
		append_to_square(old_square, new_square);
  	 });
}

//Basic Movement: Diagonal on the board
function move_diagonal(old_square, new_square, rank_change, file_change){
	//get DOM element to be moved
	var pieceBeingMoved = $("#"+old_square).children();
	//find its current position on the board (needed due to
	//position absolute)
	var oldSpotTop = pieceBeingMoved.position().top;
	var oldSpotLeft = pieceBeingMoved.position().left;
	//set current position so it does not fly to the top of the board (due to 
	//it starting at 0)
	$(pieceBeingMoved).css("top", oldSpotTop +"px");
	$(pieceBeingMoved).css("left", oldSpotLeft +"px");
	//set what the new spot will be from the old (it is in squares and each square
	//is variable, so get the value and then multiply them out)
    var square_size = parseInt($('.square').css("height"));

    //animate the movement
  	$(pieceBeingMoved).animate({
  		"top": oldSpotTop-(rank_change * square_size) +"px", 
		"left": oldSpotLeft+(file_change * square_size) +"px", 
  		}, 500 , function() {
    		// Animation complete append piece
			append_to_square(old_square, new_square);
  	 });
}

//Used to remove the piece from the oringinal square 
//and append a piece from one square to another
function append_to_square(old_square, new_square_id){
	var pieceBeingMoved = $("#"+old_square).children();

	var new_square = $("#"+new_square_id);

	if (new_square.children().length > 0){
		console.log(new_square_id)
		highlightSquare(new_square_id, "red");
		new_square.children().remove();
	}

	new_square.append(pieceBeingMoved)
	pieceBeingMoved.css("top", "")
	pieceBeingMoved.css("left", "")
	
	// if (showPopover === true){
	// 	show_popover_info(pieceBeingMoved, new_square.attr('id'));
	// }

} 

//Used to highlight squares (for move from square to square and capture)
function highlightSquare(boardSquare, highlightColor){ $('#'+boardSquare).effect("highlight", {"color" : highlightColor}, 500) }

//Executes a move that will get the showingMove a accordion closer to playToHere accordion (or points out that they are the same)
function playMove(){
	console.log("playMove");

	//cache the DOM elements
	var showingAccordion = $(".showingMove");  //this is the move that is currently shown on the board
	var playToHereAccordion = $(".playToHere"); //this is the move that we need to get to

	//check if the showingAccodion is greater than the playToHereAccodion
	//slightly counter intuitive: in this case "greater" actually refers to "earlier in the list" so we are moving up the list/screen visually
	if (showingAccordion.data("accordionnumber") > playToHereAccordion.data("accordionnumber")) {
		console.log('going up!')

		moveBlackThenWhite(showingAccordion);

		//Now we need to switch the "showingMove" class to the accordion above (visually in the browser) the current accordion we just executed
		//we do this by accessing the DOM because we are traversing a tree (and the cached object does not know about those accordions around it)
		$(".showingMove").removeClass("showingMove").prev().addClass("showingMove");
	
	}
	//this is the opposite code as above - here we are moving down visually the list of accordions
	else if (showingAccordion.data("accordionnumber") < playToHereAccordion.data("accordionnumber")){
		console.log("going down!");
		
		//The major change between this and the above is here when the first move is made
		//In the case of the first move, no accordion has "showingMove" so if it is null we tell it to put showing move on the same accordion as the
		//playToHere accordion
		if (showingAccordion.data("accordionnumber") === null){
			playToHereAccordion.addClass("showingMove");
		}
		else{
			//otherwise, we remove showingMove from the showingMove accordion and add it to the next accordion using the DOM
			$(".showingMove").removeClass("showingMove").next().addClass("showingMove")
		}

		moveWhiteThenBlack($(".showingMove"));

	}
	//Here the showingMove and playToHere are on the same accordion (so the moves are completed)
	else{
		//since we are done - re-enable the button
		$('#nextMove').prop('disabled', false);
		//take off playToHere as the move progression is complete
		playToHereAccordion.removeClass("playToHere")
	}
}

//function is used for moving "down" the list of moves (forward)
function moveWhiteThenBlack(showingAccordion){
	
	//** WHITE'S MOVE
	//Gets the data object holding the white move splits it up into an array
	var piece_white = showingAccordion.data('white').split(":")[0];
	var current_move_white = showingAccordion.data('white').split(":")[1].split("-");

	//** BLACK'S MOVE
	//Gets the data object holding the black move splits it up into an array
	var piece_black = showingAccordion.data('black').split(":")[0];
	var current_move_black = showingAccordion.data('black').split(":")[1].split("-");

	// and sends WHITE to "one_move"
	one_move(current_move_white, piece_white);

	//attaches a promise to the DOM move that has been sent in for WHITE
	$("#"+current_move_white[0]).children().promise().done(function() {
		console.log("white move done");
		
		//make the move for black
		one_move(current_move_black, piece_black);
		$("#"+current_move_black[0]).children().promise().done(function() {
			console.log("black move done");
			
			//This is a trigger used to notify the app that the move is complete and then next 
			//one can start (without it things will happen together and tend to overlap)
			$(document).trigger('move/completed')
		});
	});
}

//function is used for moving "up" the list of moves (backward)
function moveBlackThenWhite(showingAccordion){
	
	//** WHITE'S MOVE
	//Gets the data object holding the white move splits it up into an array
	var piece_white = showingAccordion.data('white').split(":")[0];
	//flips the array because we are going "backward"
	var current_move_white = showingAccordion.data('white').split(":")[1].split("-").reverse();

	//** BLACK'S MOVE
	//Gets the data object holding the black move splits it up into an array
	var piece_black = showingAccordion.data('black').split(":")[0];
	//flips the array because we are going "backward"
	//flips the array because we are going "backward"
	var current_move_black = showingAccordion.data('black').split(":")[1].split("-").reverse();

	// and sends BLACK to "one_move"
	one_move(current_move_black, piece_black);

	//attaches a promise to the DOM move that has been sent in for BLACK
	$("#"+current_move_black[0]).children().promise().done(function() {
		console.log("black move done");
		
		//make the move for WHITE
		one_move(current_move_white, piece_white);
		$("#"+current_move_white[0]).children().promise().done(function() {
			console.log("white move done");
			
			//This is a trigger used to notify the app that the move is complete and then next 
			//one can start (without it things will happen together and tend to overlap)
			$(document).trigger('move/completed')
		});
	});
}




//returns a string without whitespace
function trim(str) {return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');}

//used to trigger the rook to move if the king's move is greater than 2 squares
function castle(current_move, file_change){

	//near side Castle of rook
	if (file_change === 2){ move_file("h"+current_move[0].charAt(1) , "f"+current_move[0].charAt(1), -file_change );}
	//farside Castle of rook
	else { move_file("a"+current_move[0].charAt(1) , "d"+current_move[0].charAt(1), -(file_change-1) );}
}


// //Potentially "junk code" - originally was going to put the text on the board with the move, but the feedback from users was that it was too distracting
// function show_popover_info(pieceMoved, newSquareID){
// 	var file = newSquareID.charAt(0);

// 	var moveExplained = $(".currentMove:last").data('explanation');
// 	var moveNumber =  $(".currentMove:last").data('movenumber');
// 	var popoverSide = "right"
// 	var popoverTitle = pieceMoved.html() + " to " + newSquareID;

// 	//make the popover appear to the side (makes readability easier)
// 	if (file === "a" || file === "b" || file === "c" || file === "d" ){
// 		popoverSide = "left";
// 	}
		
// 	pieceMoved.popover(
// 	    {
// 	        title: popoverTitle,
// 	        content: moveExplained,
// 	        placement: popoverSide,
// 	        trigger: "manual"
// 	    }
// 	).popover('show');	
// }
// function clear_popovers(){
// 	$(".piece").each(function(e) {
// 		var this_piece = $(this);
// 		this_piece.popover('destroy');
// 	});
// }