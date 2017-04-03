//this is for template generation stuff lol
$(document).ready(function(){
	$('#monday').change(function(){
		var c = this.checked ? '#fff' : '#F1F1F1';
		$('th.monday').css('background-color', c);
		if (this.checked){
			$("#mondayGSHstart").prop('disabled', false);
		}else{
			$('#mondayGSHstart').prop('disabled', true)
				.val('');
		}
		if (this.checked){
			$("#mondayGSHend").prop('disabled', false);
		}else{
			$('#mondayGSHend').prop('disabled', true)
				.val('');
		}
	});
	$('#tuesday').change(function(){
		var c = this.checked ? '#fff' : '#F1F1F1';
		$('th.tuesday').css('background-color', c);
		if (this.checked){
			$("#tuesdayGSHstart").prop('disabled', false);
		}else{
			$('#tuesdayGSHstart').prop('disabled', true)
				.val('');
		}
		if (this.checked){
			$("#tuesdayGSHend").prop('disabled', false);
		}else{
			$('#tuesdayGSHend').prop('disabled', true)
				.val('');
		}
	});
	$('#wednesday').change(function(){
		var c = this.checked ? '#fff' : '#F1F1F1';
		$('th.wednesday').css('background-color', c);
		if (this.checked){
			$("#wednesdayGSHstart").prop('disabled', false);
		}else{
			$('#wednesdayGSHstart').prop('disabled', true)
				.val('');
		}
		if (this.checked){
			$("#wednesdayGSHend").prop('disabled', false);
		}else{
			$('#wednesdayGSHend').prop('disabled', true)
				.val('');
		}
	});
	$('#thursday').change(function(){
		var c = this.checked ? '#fff' : '#F1F1F1';
		$('th.thursday').css('background-color', c);
		if (this.checked){
			$("#thursdayGSHstart").prop('disabled', false);
		}else{
			$('#thursdayGSHstart').prop('disabled', true)
				.val('');
		}
		if (this.checked){
			$("#thursdayGSHend").prop('disabled', false);
		}else{
			$('#thursdayGSHend').prop('disabled', true)
				.val('');
		}
	});
	$('#friday').change(function(){
		var c = this.checked ? '#fff' : '#F1F1F1';
		$('th.friday').css('background-color', c);
		if (this.checked){
			$("#fridayGSHstart").prop('disabled', false);
		}else{
			$('#fridayGSHstart').prop('disabled', true)
				.val('');
		}
		if (this.checked){
			$("#fridayGSHend").prop('disabled', false);
		}else{
			$('#fridayGSHend').prop('disabled', true)
				.val('');
		}
	});
	var loading = $("#loading");
	$(document).ajaxStart(function () {
		loading.show();
		console.log('loading...')
	});

	$(document).ajaxStop(function () {
		loading.hide();
	});
	function fetchTemplate(id){
		var formData = {id:id}; //Array 
		
		$.ajax({
			url : "/template/ajax/fetchTemplate",
			type: "GET",
			data : formData,
			success: function(data)
			{
				console.log(data);
				var t = data.active ? 'Active' : 'Set as Active';
				$('table').show();
				$('#active').val(data._id).html(t);
				$('#delete').attr("href", "/template/deleteTemplate?id="+data._id).html("Delete");
				if(!data.monday){$('#monday').prop('checked', false).prop('disabled', true); $('th.monday').css('background-color', '#F1F1F1');}else{$('#monday').prop('checked', true).prop('disabled', true); $('th.monday').css('background-color', '#FFF'); $('#mondayGSHstart').val(data.monday.GSH.start); $('#mondayGSHend').val(data.monday.GSH.end);}
				if(!data.tuesday){$('#tuesday').prop('checked', false).prop('disabled', true); $('th.tuesday').css('background-color', '#F1F1F1');}else{$('#tuesday').prop('checked', true).prop('disabled', true); $('th.tuesday').css('background-color', '#FFF'); $('#tuesdayGSHstart').val(data.tuesday.GSH.start); $('#tuesdayGSHend').val(data.tuesday.GSH.end);}
				if(!data.wednesday){$('#wednesday').prop('checked', false).prop('disabled', true); $('th.wednesday').css('background-color', '#F1F1F1');}else{$('#wednesday').prop('checked', true).prop('disabled', true); $('th.wednesday').css('background-color', '#FFF'); $('#wednesdayGSHstart').val(data.wednesday.GSH.start); $('#wednesdayGSHend').val(data.wednesday.GSH.end);}
				if(!data.thursday){$('#thursday').prop('checked', false).prop('disabled', true); $('th.thursday').css('background-color', '#F1F1F1');}else{$('#thursday').prop('checked', true).prop('disabled', true); $('th.thursday').css('background-color', '#FFF'); $('#thursdayGSHstart').val(data.thursday.GSH.start); $('#thursdayGSHend').val(data.thursday.GSH.end);}
				if(!data.friday){$('#friday').prop('checked', false).prop('disabled', true); $('th.friday').css('background-color', '#F1F1F1');}else{$('#friday').prop('checked', true).prop('disabled', true); $('th.friday').css('background-color', '#FFF'); $('#fridayGSHstart').val(data.friday.GSH.start); $('#fridayGSHend').val(data.friday.GSH.end);}
			},
			error: function (jqXHR, textStatus, errorThrown)
			{
				$('.template').html('<pre>Error</pre>');
			}
		});
	}
	$('select').change(function(){
		var selected = $( "select option:selected" ).val();
		fetchTemplate(selected);
	});
	function setActive(id){
		var formData = {id:id};
		$.ajax({
			url: "/template/ajax/setActive",
			type: "GET",
			data: formData,
			success: function(data){
				fetchTemplate(id);
			}
		})
	}
	$('#active').click(function(){
		var id = $('#active').val();
		setActive(id);
	});
	function deleteTemplate(id){
		var formData = {id:id};
		$('#delete').html('Removing...');
		$.ajax({
			url: "/template/ajax/deleteTemplate",
			type: "GET",
			data: formData,
			success: function(data){
			}
		})
	}
	$('#delete').click(function(){
		var id = $('#delete').val();
		deleteTemplate(id);
	});
});
