var startSquare = "";
var startPiece = "";

$('.exercises.practice').ready(function() {

	//makes pieces only draggable for
	if ($(".page-header").data('draggable') === "yes"){
	  	//used for piece set up - drag 'em around 
	  	makeDraggable();
	}

	if ($(".page-header").data('droppable') === "update-db"){
		console.log("db")
	  	//used for making the board able to take items that are dropped on it
	  	$('.square').droppable({
	    	drop: function(event, ui) {
	    		//cashe the item that is being dragged
				pieceBeingMoved = $(ui.draggable);
				//remove any children on the spot being dropped on
				$(this).children().remove();
				//add the dragged piece to the board
				$(this).append(pieceBeingMoved);
				pieceBeingMoved.css("top", "");
				pieceBeingMoved.css("left", "");

				//reset the extra piece set
				resetExtraPiece($(ui.draggable));

				//remove the piece being dragged if it is moved to any of the "deleteme" squares
				if ($(this).attr('class').indexOf('deleteme') != -1){
					pieceBeingMoved.remove();
				}
				saveCurrentBoard();
	    	}
	  	});
  	}

	if ($(".page-header").data('droppable') === "screen-response"){

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
						showPopover = false;
						one_move(userMove, startPiece.html());
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

	  	//used for making the board able to take items that are dropped on it
	  	$('.square').droppable({
	    	drop: function(event, ui) {
	    		//cashe the item that is being dragged
				pieceBeingMoved = $(ui.draggable);

				//Making the piece "revert" on any movement --> this will be overwritten (see below) if it is the right piece and move 	
				pieceBeingMoved.draggable({ revert: true });	
				var droppedOnSquare = $(this);

				if (verifyCorrectMove(pieceBeingMoved, droppedOnSquare) === true){

					//This it the right spot, so I don't want it to revert anymore (in case it was previously)
					pieceBeingMoved.draggable({ revert: false });

					updateDisplayedMove();
					
					//remove any children on the spot being dropped on
					droppedOnSquare.children().remove();
					//add the dragged piece to the board
					droppedOnSquare.append(pieceBeingMoved);
					pieceBeingMoved.css("top", "");
					pieceBeingMoved.css("left", "");

					computersMoveOrLastMove();	

				}
	    	}
	  	});
  	}
  	computersMoveOrLastMove();
});

function makeDraggable(){
	$('.piece').addClass('draggable');
	$( ".draggable" ).draggable({ containment: "#setup_board" });
}

function verifyCorrectMove(pieceBeingMoved, droppedOnSquare){

	console.log(pieceBeingMoved);
	console.log(droppedOnSquare);

	//take out any error moves that have been displayed
	$('.alert-error').remove();

	//generate an identical statement to the moves written out
	var moveMade = pieceBeingMoved.html() + " from " + pieceBeingMoved.parent().attr("id") + " to " + droppedOnSquare.attr("id");

	//check if the nextMove in the list 
	if (moveMade === $('.nextMove:First').html()){
		console.log("right!");
		return true;
	}
	else{
		console.log("wrong");
		//display an incorrect move on the side in red
		showIncorrectMove(moveMade);
		return false;
// TODO: something that pops up the wrong move and asks if you want a hint
	}
}

function computersMoveOrLastMove(){
	//check to see if the next move is one the computer should make
	var nextMoveInList = $('.nextMove:First');
	if (nextMoveInList.data('computer') === true){
		console.log("its a computer move!")

		//do not show the popover for the move the user is on
		showPopover = false;
		//pulls apart HTML and sends the from, to, and piece to "one_move"
		var shown_move = nextMoveInList.html().split(" ");
		var current_move = [shown_move[2]];
		current_move.push(shown_move[4]);

		//sends in the current move
		one_move(current_move, shown_move[0]);
		nextMoveInList.remove();
	}
	//look and see if all the moves are done
	if ($('.notShownMove:First').length === 0){
  		$('#conclusionModal').modal('show');  		
  	}

}
function updateDisplayedMove(){
	//show the move and pull it off the "next move list"
	$('.nextMove:First').removeClass("hideMe").removeClass("nextMove");
}
function showIncorrectMove(moveMade){
	moveMade = '<div class="alert alert-error">' + moveMade + '<div class="pull-right hint">hint?</div></div>'
	console.log(moveMade)
	//$('<div class="alert alert-fail">' & moveMade & '</div>').insertAfter('.alert');
	$(moveMade).insertBefore('.hideMe:first');
	$('.hint').mouseover(function() {
		console.log("show hint");
	}).mouseout(function(){
    	console.log("don't show hint");
  	});
}
	