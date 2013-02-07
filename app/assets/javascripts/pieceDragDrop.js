$('.exercises.practice, .exercises.edit').ready(function() {

	//makes pieces only draggable for
	makeDraggable();
});

//only update the db with the board setup if it is the exercise "edit" screen
$('.exercises.edit').ready(function() {
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
 });

function makeDraggable(){
	$('.piece').addClass('draggable');
	$( ".draggable" ).draggable({ containment: "#setup_board" });
}	