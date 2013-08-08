var animationSpeed = 100;

// profileUpdate

// $('.registrations.edit').ready(function() {
// 	$('#profileUpdate').on('click', function() {
// 		console.log("testme")
// 	});
// });

//sets up the board for where there is a board show ("show" and "edit")
$('.exercises.show, .exercises.edit, .exercises.practice, .exercises.quiz, .exercises.new').ready(function() {
	//we load pieces on exercises "show" and "edit", but no others

	loadPiecesOnBoard($("#board").data('initial_setup').split(","));

});

//used to find and replace for mouse overs
$('.exercises.show').ready(function() {

    // var squareMap = [
    // 	"a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8",
    // 	"b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8",
    // 	"c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8",
    // 	"d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8",
    // 	"e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8",
    // 	"f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8",
    // 	"g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8",
    // 	"h1", "h2", "h3", "h4", "h5", "h6", "h7", "h8"
    // 	];

    //look through each accordion and determine if there is a square that we can add a highlight to
	$('.accordion-inner').each(function() {
    	 var text = $(this).html();

    	//replace brackets with a span for use in a mouse over to make pieces move
    	text = text.replace(/[\[]+/g,'<span class="move-me">').replace(/[\]]+/g,'</span>');

    	//replace brackets with a span for use in a mouse over to make pieces shake	
		text = text.replace(/[\{]+/g, '<span class="shake-me">').replace(/[\}]+/g, '</span>');

    	$(this).html(text); 
	});

	//add a mouse over handler to the word coordinates that is are {}s - it will cause the related square to shake
	$('.shake-me').mouseover(function() {
		var square = $(this).text();
		//"shakes the piece"
		$('#'+square).addClass("animated shake");
		//highlights the right square to move to
		highlightSquare(square, "pink");		
	}).mouseout(function(){
		var square = $(this).text();
    	$('#'+square).removeClass("animated shake");
  	});

  	//add a mouse over handler to the coordinates that are in []s to make the piece move
	$('.move-me').mouseover(function() {
		var coordinates = $(this).text();
		var pieceToMove = coordinates.charAt(0);
		
		coordinates = coordinates.slice(1).split('-');
			
		makeDescriptionMove(coordinates, pieceToMove);

  	}).mouseout(function(){
		var coordinates = $(this).text();
		var pieceToMove = coordinates.charAt(0);
		
		coordinates = coordinates.slice(1).split('-').reverse();
			
		makeDescriptionMove(coordinates, pieceToMove);

  	});

});

function makeDescriptionMove(coordinates, pieceToMove){

	one_move([coordinates[0],coordinates[1]], pieceToMove, "black");

	$("#"+coordinates[0]).children().promise().done(function() {				
		coordinates.splice(0, 1);
		console.log(coordinates);
		if (coordinates.length > 1){
			makeDescriptionMove(coordinates, pieceToMove);
		}
	});
}
	


$('.exercises.practice, .exercises.quiz, .exercises.edit, .exercises.new').ready(function() {
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