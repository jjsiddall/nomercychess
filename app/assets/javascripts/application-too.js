$(document).ready(function() {
	if ($(".page-header").data('modal') === "yes"){
		$('#descriptionModal').modal('show');
	}

	var start = $("#board").data('initial_setup');
	if ((start != undefined)&&(start != "")){
		loadPiecesOnBoard(start.split(","));
	}
});

//This function takes an array of pieces and loads them on the board
function loadPiecesOnBoard(initial_setup){

	var ilen = initial_setup.length
	for (var i=0; i<ilen; ++i) {
		var square_info = initial_setup[i].split("-");
		$('#'+square_info[0]).append('<div class="piece '+square_info[1]+'">'+square_info[2]+'</div>');
	}
}

function trim(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}