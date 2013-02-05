var showPopover = true;

$('.exercises.show').ready(function() {
	// $('#test').on('click', function() {
	// 	$('#toggleMe-1').click();
	// });
	
	$('#nextMove').on('click', function() {
		//show the popover for the move the user is on
		showPopover = false;
		//grab the first notShownMove in the list
		var accordion = $('.notShownMove:first')
		//Gets the notShown's ID - this will be used further on for the "click" event of the accordion
		var accordionID = accordion.children().eq(0).children().attr('id');
		//This is the text move that is shown (ex "pawn from e2 to e4")
		var accordionTextToShow = accordion.children().eq(0).children().html();
		//checks that there is text for the next move
		if (accordionTextToShow != undefined){
			//unhides the top notShownMove and takes the "notShownMove" off
			accordion.removeClass("notShownMove");
			//trims off leading and trailing whitespace
			accordionTextToShow = trim(accordionTextToShow);
			//looks to see if this is the first move (as there is no "showingMove")
			// if ($(".showingMove").data("accordionnumber") === null){
			// //	Parses text into an array and passes it into one_move() for animation
			// 	var shown_move = accordionTextToShow.split(" ");
			// 	var current_move = [shown_move[2]];
			// 	current_move.push(shown_move[4]);
			// 	one_move(current_move, shown_move[0]);
			// 	accordion.addClass("showingMove");
			// }
			//Fires the "click/show" action (which executes the move below) to display the current and retract the previous ones
			$('#'+accordionID).click();
		}
		else{
			//remove popovers (otherwise they will show on the darkened screen)
			clear_popovers();
			//show the conclusion popover when there are no more moves on the list
			$('#conclusionModal').modal('show');
		}
		
	});

	//event that is triggered when the accordion is shown for the specific level
	$('.accordion-body').on('show', function(){
		$(this).parent().addClass("replayToHere")
		replayMove();
		$('#nextMove').prop('disabled', true);		
	});
	$(document).on('move/completed', function() {

		console.log($(".replayToHere").data("accordionnumber"))

		if ($(".replayToHere").data("accordionnumber") != null) {
			replayMove();
		}	
	
	});
});

function one_move(current_move, piece){

	//remove any popovers that are currently on the board
	clear_popovers();

	var rank_change = find_change_in_rank(current_move);
	var file_change = find_change_in_file(current_move);
		
	//need to determine if its a knight move or a bishop/queen/king
	if ((rank_change != 0) && (file_change != 0) && (piece != "♞")){
		move_diagonal(current_move[0], current_move[1], rank_change, file_change)
	}
	else{
		move_rank(current_move[0] , rank_change);
		move_file(current_move[0] , current_move[1], file_change );
	}

	//debugging
	highlightSquare(current_move[0], "yellow");
	highlightSquare(current_move[1], "yellow");

	// if ((file_change > 1) && (piece === "♚")){
	// 	showPopover = false;
	// 	setTimeout(function() {
	// 		$('#nextMove').click();
	// 	}, 1100);    		
	// }
}

//Passing in start and end square, now to determine movement number of squares
function find_change_in_rank(start_end_array){
	//subtract rank numbers gives the up/down value

	return start_end_array[1].charAt(1) - start_end_array[0].charAt(1);
}
function find_change_in_file(start_end_array){
	//convert file from alpha to number and find right/left value

	return (start_end_array[1].charAt(0).charCodeAt()-96) - (start_end_array[0].charAt(0).charCodeAt()-96);

}

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
	
	if (showPopover === true){
		show_popover_info(pieceBeingMoved, new_square.attr('id'));
	}
	var moveStatus = 'complete'
	$(document).trigger('move/completed', moveStatus)
}  
function show_popover_info(pieceMoved, newSquareID){
	var file = newSquareID.charAt(0);

	var moveExplained = $(".currentMove:last").data('explanation');
	var moveNumber =  $(".currentMove:last").data('movenumber');
	var popoverSide = "right"
	var popoverTitle = pieceMoved.html() + " to " + newSquareID;

	//make the popover appear to the side (makes readability easier)
	if (file === "a" || file === "b" || file === "c" || file === "d" ){
		popoverSide = "left";
	}
		
	pieceMoved.popover(
	    {
	        title: popoverTitle,
	        content: moveExplained,
	        placement: popoverSide,
	        trigger: "manual"
	    }
	).popover('show');	
}

function clear_popovers(){
	$(".piece").each(function(e) {
		var this_piece = $(this);
		this_piece.popover('destroy');
	});
}

function replayMove(){

refactor all the jquery that is pinging the DOM

	if ($(".showingMove").data("accordionnumber") - $(".replayToHere").data("accordionnumber") > 0) {
		console.log("going up!");
		

		var accordionTextToShow = trim($(".showingMove").children().eq(0).children().html());
		console.log(accordionTextToShow);
		var shown_move = accordionTextToShow.split(" ");
		var current_move = [shown_move[4]];
		current_move.push(shown_move[2]);
		one_move(current_move, shown_move[0]);
		$(".showingMove").removeClass("showingMove").prev().addClass("showingMove");
	}
	else if ($(".showingMove").data("accordionnumber") - $(".replayToHere").data("accordionnumber") < 0){
		console.log("going down!");
		
		if ($(".showingMove").data("accordionnumber") === null){
			$(".replayToHere").addClass("showingMove");
		}
		else{
			$(".showingMove").removeClass("showingMove").next().addClass("showingMove")
		}
		var accordionTextToShow = trim($(".showingMove").children().eq(0).children().html());
		console.log(accordionTextToShow);
		var shown_move = accordionTextToShow.split(" ");
		var current_move = [shown_move[2]];
		current_move.push(shown_move[4]);
		one_move(current_move, shown_move[0]);

	}
	else{
		$('#nextMove').prop('disabled', false);
		$(".replayToHere").removeClass("replayToHere")
	}
}


function highlightSquare(boardSquare, highlightColor){

	  $('#'+boardSquare).effect("highlight", {"color" : highlightColor}, 500) 
}