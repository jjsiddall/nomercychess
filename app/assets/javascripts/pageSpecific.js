var animationSpeed = 500;

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


    //look through each accordion and determine if there is a square that we can add a highlight to
	$('.panel-body').each(function() {
    	 var text = $(this).html();

    	//replace brackets with a span for use in a mouse over to make pieces move
    	text = text.replace(/[\[]+/g,'<abbr title="move"><span class="move-me">').replace(/[\]]+/g,'</span></abbr>');

    	//replace brackets with a span for use in a mouse over to make pieces shake	
		text = text.replace(/[\{]+/g, '<abbr title="shake"><span class="shake-me">').replace(/[\}]+/g, '</span></abbr>');

    	$(this).html(text); 
	});

	//add a mouse over handler to the word coordinates that is are {}s - it will cause the related square to shake
	$('.shake-me').mouseover(function() {
		var square = $(this).text();
		if (square.length === 2){
			//"shakes the piece"
			$('#'+square).addClass("animated shake");
			//highlights the right square to move to
			highlightSquare(square, "pink");		
		}
		else if(square.length === 1){
			if (isNaN(parseInt(square))){

				$('#'+square + "1").addClass("animated pulse").effect("highlight", {"color" : "yellow"}, 500);
				$('#'+square + "2").addClass("animated pulse").effect("highlight", {"color" : "yellow"}, 500);
				$('#'+square + "3").addClass("animated pulse").effect("highlight", {"color" : "yellow"}, 500);
				$('#'+square + "4").addClass("animated pulse").effect("highlight", {"color" : "yellow"}, 500);
				$('#'+square + "5").addClass("animated pulse").effect("highlight", {"color" : "yellow"}, 500);
				$('#'+square + "6").addClass("animated pulse").effect("highlight", {"color" : "yellow"}, 500);
				$('#'+square + "7").addClass("animated pulse").effect("highlight", {"color" : "yellow"}, 500);
				$('#'+square + "8").addClass("animated pulse").effect("highlight", {"color" : "yellow"}, 500);
				$('#'+square + "9").addClass("animated pulse").effect("highlight", {"color" : "yellow"}, 500);

			}
			else {
				$('#a'+square).addClass("animated pulse").effect("highlight", {"color" : "yellow"}, 500);
				$('#b'+square).addClass("animated pulse").effect("highlight", {"color" : "yellow"}, 500);
				$('#c'+square).addClass("animated pulse").effect("highlight", {"color" : "yellow"}, 500);
				$('#d'+square).addClass("animated pulse").effect("highlight", {"color" : "yellow"}, 500);
				$('#e'+square).addClass("animated pulse").effect("highlight", {"color" : "yellow"}, 500);
				$('#f'+square).addClass("animated pulse").effect("highlight", {"color" : "yellow"}, 500);
				$('#g'+square).addClass("animated pulse").effect("highlight", {"color" : "yellow"}, 500);
				$('#h'+square).addClass("animated pulse").effect("highlight", {"color" : "yellow"}, 500);
			}
		}
	}).mouseout(function(){
		var square = $(this).text();
		if (square.length === 2){
    		$('#'+square).removeClass("animated shake");
    	}
    	else if(square.length === 1){
			if (isNaN(parseInt(square))){
				$('#'+square + "1").removeClass("animated pulse");
				$('#'+square + "2").removeClass("animated pulse");
				$('#'+square + "3").removeClass("animated pulse");
				$('#'+square + "4").removeClass("animated pulse");
				$('#'+square + "5").removeClass("animated pulse");
				$('#'+square + "6").removeClass("animated pulse");
				$('#'+square + "7").removeClass("animated pulse");
				$('#'+square + "8").removeClass("animated pulse");
				$('#'+square + "9").removeClass("animated pulse");
			}
			else {
				$('#a'+square).removeClass("animated pulse");
				$('#b'+square).removeClass("animated pulse");
				$('#c'+square).removeClass("animated pulse");
				$('#d'+square).removeClass("animated pulse");
				$('#e'+square).removeClass("animated pulse");
				$('#f'+square).removeClass("animated pulse");
				$('#g'+square).removeClass("animated pulse");
				$('#h'+square).removeClass("animated pulse");
			}
		}
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
	$('#clear-board').on('click', function() { 
		clearBoard(); 
		saveCurrentBoard();
	});

	//"edit" the button "reset" for removing all the pieces (and updating the db)
	$('#reset-board').on('click', function() { resetBoard(); });
});

$('.lessons.builder').ready(function() {
    $( ".canSort" ).sortable({
      connectWith: ".connectedSortable" //, 
//      placeholder: "well-small well"
    }).disableSelection();
});

$('.lessons.index').ready(function() {
	$('.gallery > div').hoverdir( {
		hoverDelay	: 75
	});
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