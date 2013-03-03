var startSquare = "";
var startPiece = "";

//Used to make the exercise "practice" respond to ...
$('.exercises.practice').ready(function() {
	//...CLICK
	//used to allow the user to click a piece and then move it clicking the related square
	$('.square').on('click', function() {
		if (startSquare === ""){

			//stores the piece being clicked on (if there is one)
			startPiece = $(this).children();

			//since this is the "original click" it will only store it 
			//if there is a piece on the square
			if (startPiece.html() != undefined){
				//stores the original click
				startSquare = $(this).attr("id");
				//highlights the clicked square
				highlightSquare(startSquare, "blue");					
			}
		}
		else {
			var userMove = new Array();
			var endSquare = $(this).attr("id");
			highlightSquare(endSquare, "orange");

			userMove.push(startSquare);
			userMove.push(endSquare);

			if (startPiece.html() != undefined){
				if (verifyCorrectMove(startPiece, $(this))===true){
					//showPopover = false;
					one_move(userMove, startPiece.html());
					$("#"+userMove[0]).children().promise().done(function() {
						whiteMoveCompleteNowBlack(nextMove);
					});

					updateDisplayedMove();
					setTimeout(function() {
						computersMoveOrLastMove();
					}, 750); 
					
				}
			}

			startPiece = "";
			startSquare = "";
		} 			
	});
	//...DRAG DROP
  	//used for making the board able to take items that are dropped on it
  	$('.square').droppable({
    	drop: function(event, ui) {
    		//cashe the item that is being dragged
			pieceBeingMoved = $(ui.draggable);
			//Making the piece "revert" on any movement --> this will be overwritten (see below) if it is the right piece and move 	
			pieceBeingMoved.draggable({ 
				revert: true, 
				stop: function(){
					// console.log("stopped here")
					//removes any added CSS from the drag and revert
					pieceBeingMoved.css("top", "");
					pieceBeingMoved.css("left", "");
					// console.log(pieceBeingMoved[0].outerHTML)
				} 
			});	
			var droppedOnSquare = $(this);

			if (verifyCorrectMove(pieceBeingMoved, droppedOnSquare) === true){

				//This is the right spot, so I don't want it to revert anymore (in case it was previously)
				pieceBeingMoved.draggable({ revert: false });


				//if this is a castling move then we need the computer to move the rook (using the castle() function )
				var current_move = new Array(pieceBeingMoved.parent().attr('id'), droppedOnSquare.attr('id'));
				var file_change = find_change_in_file(current_move)
				if (((file_change != 1) || (file_change != -1)) && (pieceBeingMoved.html() === "♚")){
					console.log("castle")
					//we know this is a castle and have moved the King, now need to move the associated rook
					castle(current_move, file_change);
				}

				//update the move list to show the right move was made
				updateDisplayedMove();
				
				//remove any children on the spot being dropped on
				droppedOnSquare.children().remove();
				//add the dragged piece to the board
				droppedOnSquare.append(pieceBeingMoved);

				whiteMoveCompleteNowBlack($('.alert-success:not(.notShownMove):Last'));

				pieceBeingMoved.css("top", "");
				pieceBeingMoved.css("left", "");

				computersMoveOrLastMove();	

			}

    	}
  	});
  	//after the click or drag-drop of pieces, this looks to see if the computer has a move to make
  	computersMoveOrLastMove();

});

function verifyCorrectMove(pieceBeingMoved, droppedOnSquare){

	//take out any error moves that have been displayed
	$('.alert-error').remove();

	//generate an identical statement to the moves written out
	var madeMove = pieceBeingMoved.html() + ":" + pieceBeingMoved.parent().attr("id") + "-" + droppedOnSquare.attr("id");

	console.log(madeMove);
	
	//caching DOM element
	nextMove = $('.nextMove:First');

	if (nextMove.data("computer") === "black"){
		var correctMove = $('.nextMove:First').data("white");
	}
	else{
		var correctMove = $('.nextMove:First').data("black");
	}
	
	console.log(correctMove);

	//check if the nextMove in the list 
	if (madeMove === correctMove){

		return true;
	}
	else{
		//display an incorrect move on the side in red
		showIncorrectMove(madeMove, correctMove);
		return false;
// TODO: something that pops up the wrong move and asks if you want a hint
	}
}

function computersMoveOrLastMove(){
	//check to see if the next move is one the computer should make
	var nextMoveInList = $('.nextMove:First');
	// if (nextMoveInList.data('computer') === true){
	// 	console.log("its a computer move!")

	// 	//do not show the popover for the move the user is on
	// 	//showPopover = false;
	// 	//pulls apart HTML and sends the from, to, and piece to "one_move"
 //    	var shown_move = trim(nextMoveInList.children().eq(0).children().html()).split(" ");

	// 	var current_move = [shown_move[2]];
	// 	current_move.push(shown_move[4]);

	// 	//sends in the current move
	// 	one_move(current_move, shown_move[0]);
	// 	nextMoveInList.remove();
	// }
	//look and see if all the moves are done
	if ($('.notShownMove:First').length === 0){
  		$('#conclusionModal').modal('show');  		
  	}

}
function updateDisplayedMove(){
	//show the move and pull it off the "next move list"
	$('.nextMove:First').removeClass("notShownMove").removeClass("nextMove");
}
function showIncorrectMove(madeMove, correctMove){

	//build the error and show it under the list as a alert-error (and make it more readable ":" = "From" & "-" = "To")
	madeMove = '<div class="alert alert-error">' + "Incorrect: " + madeMove.replace(":", " from ").replace("-", " to ") + '<div class="pull-right hint">hint?</div></div>'
	$(madeMove).insertBefore('.notShownMove:first');

	var correctMoveArray = correctMove.split(":")[1].split("-");
	// console.log(correctMoveArray[2]);
	
	//add a mouse over handler to the "hint" text that animates the correct move
	$('.hint').mouseover(function() {
		//"shakes the piece"
		$('#'+correctMoveArray[0]).addClass("animated shake");
		//highlights the right square to move to
		highlightSquare(correctMoveArray[1], "pink");		
	}).mouseout(function(){
    	$('#'+correctMoveArray[0]).removeClass("animated shake");
  	});
}

function whiteMoveCompleteNowBlack(nextMove){
	if (nextMove.data("computer") === "black"){
		//We found the right move for white, so now its BLACK'S MOVE
		//Gets the data object holding the black move splits it up into an array
		var piece_black = nextMove.data('black').split(":")[0];
		var current_move_black = nextMove.data('black').split(":")[1].split("-");

		// and sends BLACK to "one_move"
		one_move(current_move_black, piece_black);
	}
}

