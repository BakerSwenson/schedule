$(document).ready(function() {
	var isteacher  = $('input[name=isteacher]').is(':checked');
	var isadmin = $('input[name=isadmin]').is(':checked');
	var isview_absents = $('input[name=isview_absents]').is(':checked');
	
	
	$('input[type=checkbox]').change(function() {
		var new_isteacher  = $('input[name=isteacher]').is(':checked');
		var new_isadmin = $('input[name=isadmin]').is(':checked');
		var new_isview_absents = $('input[name=isview_absents]').is(':checked');

		if (isteacher === new_isteacher && isadmin === new_isadmin && isview_absents === new_isview_absents) {
			$('#update_warning').css({'display': 'none'});
		} else {
			$('#update_warning').css({'display': 'block'});
		}
	});
});
