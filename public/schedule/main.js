$(document).ready(function(){ 	
	$(document).on("click", "td", function(){
		$("td").removeClass('selectedClass');
		$("th").removeClass('selectedHeader');
		$("#classForm").hide();
		console.log($(this).attr('id'));
		$(this).addClass('selectedClass');

		//auto fill in
		var id = $(this).attr('id').split("-");
		var disabled = $(this).hasClass('d');
		var days = {
			'm': function(){
				$('#sday').val("Monday");
				$('#selday').html("Monday");
				$('#monday').addClass('selectedHeader');
			},
			'tu': function(){
				$('#sday').val('Tuesday');
				$('#selday').html("Tuesday");
				$('#tuesday').addClass('selectedHeader');
			},
			'w': function(){
				$('#sday').val('Wednesday');
				$('#selday').html("Wednesday");
				$('#wednesday').addClass('selectedHeader');
			},
			'th': function(){
				$('#sday').val('Thursday');
				$('#selday').html("Thursday");
				$('#thursday').addClass('selectedHeader');
			},
			'f': function(){
				$('#sday').val('Friday');
				$('#selday').html("Friday");
				$('#friday').addClass('selectedHeader');
			}
		}
		var hours = {
			'1': function(){
				$('#shour').val("Hour 1");
				$('#selhour').html("Hour 1");
				$('#h1').addClass('selectedHeader');
			},
			'2': function(){
				$('#shour').val("Hour 2");
				$('#selhour').html("Hour 2");
				$('#h2').addClass('selectedHeader');
			},
			'3': function(){
				$('#shour').val("Hour 3");
				$('#selhour').html("Hour 3");
				$('#h3').addClass('selectedHeader');
			},
			'S': function(){
				$('#shour').val("GSH");
				$('#selhour').html("GSH");
				$('#hS').addClass('selectedHeader');
			},
			'4': function(){
				$('#shour').val("Hour 4");
				$('#selhour').html("Hour 4");
				$('#h4').addClass('selectedHeader');
			},
			'5': function(){
				$('#shour').val("Hour 5");
				$('#selhour').html("Hour 5");
				$('#h5').addClass('selectedHeader');
			}	

		}
		if(disabled){
			console.log('Disabled');
		}else{
			$('#classForm').show(500);
			if(days[id[0]]){

				days[id[0]]();
			}else{
				console.log("ERROR");
			}
			if(hours[id[1]]){
				hours[id[1]]();
			}else{
				console.log("ERROR");
			}
		}
	});
	$(document).mouseup(function (e)
											{
		var container = $("table");
		var container1 = $("#classForm");

		if (!container1.is(e.target) // if the target of the click isn't the container...
				&& container1.has(e.target).length === 0 ) // ... nor a descendant of the container
		{
			if (!container.is(e.target) // if the target of the click isn't the container...
					&& container.has(e.target).length === 0 ) // ... nor a descendant of the container
			{
				console.log('unselect day');
				$('#searchTeacher').val('');
				$("td").removeClass('selectedClass');
				$("th").removeClass('selectedHeader');
				$("#classForm").fadeOut( "fast" );
			}
		}
	});
	$('#searchTeacherBtn').click(function() {
		searchClasses();
		$('#searchTeacherBtn').blur();
	});
	function searchClasses() {
		var query = $('#searchTeacher').val();
		var day = $('#sday').val();
		var hour = $('#shour').val();
		$('#results').show();
		if(query != ""){
			$.get( "/schedule/ajax/search/"+ query,{ day: day, hour: hour }, function( classes ) {
				if(classes.length != 0){
					console.log(day + hour + query);
					$('#resultlist').html('');
					classes.forEach(function(class1) {
						$('#resultlist').append('<li class=resultitem><div class="breakleft">' + class1.class_name + '</div><div class="breakright"><button value='+ class1._id+' class="joinClass">Join</button></div></li>');
					});
				}else{
					$('#resultlist').html('');
					$('#rheader').html('No results found :(')
				}
			})
		}else{
			$('#results').hide();
		}
	}
	function populateSchedule() {
		$.get( "/schedule/ajax/schedule", function( schedule ) {
			console.log("Populating Schedule");
			//disable no ever days
			$('.2 td').addClass('d').html('');
			$('.2 td').addClass('dr').html('');
			$('.3 td').addClass('d').html('');
			$('.3 td').addClass('dr').html('');
			$('.4 td').addClass('d').html('');
			$('.4 td').addClass('dr').html('');
			//skip five bc gsh
			$('.6 td').addClass('d').html('');
			$('.6 td').addClass('dr').html('');
			$('.7 td').addClass('d').html('');
			$('.7 td').addClass('dr').html('');
			$('#m-S').addClass('d').html('');
			$('#tu-S').addClass('d').html('');
			$('#th-S').addClass('d').html('');
			$('#f-S').addClass('d').html('');
			var changeW = (schedule.Wednesday.GSH.teacher_add ? "" : "checked='checked'");
			var pendingW = (schedule.Wednesday.GSH.pending ? "classPending" : "");
			$('#w-S').html(`
					<div class="body ${pendingW}">
						<div class="class">
							<div class="className">${schedule.Wednesday.GSH.class.class_name}</div>
						</div>
						<div class="changeable">Overridable</div>
						<input type="checkbox" disabled="disabled" ${changeW}/>
					</div>
					`);
		});
	};
	function broadcast(msg, color){
		$('#ntext').html(msg);
		$('#notifications').show(1000).css('background-color', '#'+color+''); 
	}
	$('.numberCircle').click(function(){
		$('#notifications').hide(1000);
	})
	populateSchedule();
	$(document).on("click", ".joinClass", function(){
		console.log($(this).val());
		$.get( "/schedule/ajax/add/"+ $(this).val(), function( data ) {
			console.log('Added default student!');
			broadcast(data.msg, data.color);
			populateSchedule();
		});
	})
});
