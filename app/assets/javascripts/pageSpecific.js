//sets up the board for where there is a board show ("show" and "edit")
$('.exercises.show, .exercises.edit, .exercises.practice').ready(function() {
	//we load pieces on exercises "show" and "edit", but no others
	loadPiecesOnBoard($("#board").data('initial_setup').split(","));
});