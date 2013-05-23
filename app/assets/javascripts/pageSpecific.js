var animationSpeed = 500;

//sets up the board for where there is a board show ("show" and "edit")
$('.exercises.show, .exercises.edit, .exercises.practice, .exercises.new').ready(function() {
	//we load pieces on exercises "show" and "edit", but no others

	loadPiecesOnBoard($("#board").data('initial_setup').split(","));

	// $(".board").each(function() {
	// 	loadPiecesOnBoard($(this).data('initial_setup').split(","));
	// });
});

$('.exercises.practice, .exercises.edit, .exercises.new').ready(function() {
	//makes pieces only draggable for
	makeDraggable();
});

$('.exercises.edit').ready(function() {
	animationSpeed = 1;
});

$('.exercises.edit, .exercises.new').ready(function() {
	//"edit" the button "clear" for removing all the pieces (and updating the db)
	$('#clear-board').on('click', function() { clearBoard(); });

	//"edit" the button "reset" for removing all the pieces (and updating the db)
	$('#reset-board').on('click', function() { resetBoard(); });
});

$('.lessons.builder').ready(function() {
    $( ".canSort" ).sortable({
      connectWith: ".connectedSortable" //, 
//      placeholder: "well-small well"
    }).disableSelection();
});

$('.home.index').ready(function() {
	$('#myCarousel').carousel({
  		interval: 2000
	});
});

function makeDraggable(){
	$('.piece').addClass('draggable');
	$( ".draggable" ).draggable({ containment: "#setup_board" });
}