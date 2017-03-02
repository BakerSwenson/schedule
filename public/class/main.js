//Scripts for classes website here
//class home page
$(document).ready(function(){ 	
	renderPage('home');		   
	$('#linkhome').click(function(){
		renderPage('home');
	})
	$('#linkpending').click(function(){
		renderPage('pending');
	})
	$('#linksettings').click(function(){
		renderPage('settings');
	})
	$('#linkpastclasses').click(function(){
		renderPage('past-classes');
	})
	function renderPage(page){
		$('.page').hide();
		$('.navitem').removeClass('active');
		var map = {
			'home': function(){
				$('#linkhome > li').addClass('active');
				renderHomePage();
				$('#home').fadeIn( "slow", function() {
					//Debug for two page rendering
					$('#pending').hide();
					$('#settings').hide();
					$('#search').hide();
					$('#past-classes').hide();
					$('#home').show();
				} );
			},
			'pending': function(){
				$('#linkpending > li').addClass('active');
				renderApproveableStudents();
				$('#pending').fadeIn( "slow", function() {
					$('#home').hide();
					$('#settings').hide();
					$('#search').hide();
					$('#past-classes').hide();
					$('#pending').show();
				});
			},
			'settings': function(){
				$('#linksettings > li').addClass('active');
				$('#settings').fadeIn( "slow", function() {
					$('#pending').hide();
					$('#home').hide();
					$('#search').hide();
					$('#past-classes').hide();
					$('#settings').show();
				});
			},
			'past-classes': function(){
				$('#linkpastclasses > li').addClass('active');
				$('#settings').fadeIn( "slow", function() {
					$('#pending').hide();
					$('#home').hide();
					$('#search').hide();
					$('#past-classes').show();
					$('#settings').hide();
				});

				renderPastClassesPage();
			},
			'search': function(){
				$('#search').fadeIn( "fast", function() {
					$('#pending').hide();
					$('#home').hide();
					$('#settings').hide();
					$('#search').show();
					$('#past-classes').hide();
				});
				//get the query from search
				var query = $('#students-search').val();

				renderSearchPage(query);
			},
			'searchDefault': function(){
				$('#search').fadeIn( "fast", function() {
					$('#pending').hide();
					$('#home').hide();
					$('#settings').hide();
					$('#search').show();
					$('#past-classes').hide();
				});
				//get the query from search
				var query = $('#students-search').val();

				renderSearchPageDefault(query);
			},
			'searchTeacher': function(){
				$('#search').fadeIn( "fast", function() {
					$('#pending').hide();
					$('#home').hide();
					$('#settings').hide();
					$('#search').show();
					$('#past-classes').hide();
				});
				//get the query from search
				var query = $('#teachers-search').val();
				console.log('MADE IT HERE2');
				redenderSearchPageTEACHER(query);
			}

		}
		if(map[page]){
			console.log('here');
			map[page]();
		}else{
			console.log("Error! Invaid params!");
		}
	}

	function renderHomePage() {
		$('#loadBar').show();
		$('#home > table').html('');
		setTimeout(function () {
			var url = window.location.pathname;
			var id = url.split('/')[2];
			$.get( "/class/ajax/class/"+id, function( class1 ) {
				if(class1.open){
					$('#search-bar-form').show();
				}else{
					$('#search-bar-form-default_students').show();
				}

				var students = class1.students;
				$('#home > table').html('');
				students.forEach(function(item){
					$('#home > table').append('<tr><td>' + item.fullname+'</td><td><button class="removeBtn" value="'+ id+'/'+ item._id+'">Remove</button></td></tr>');
				});

				var defaults = class1.default_students;
				defaults.forEach(function(item){
					$('#home > table').append('<tr style="background-color: red;"><td>' + item.fullname+'</td><td><button class="removeDefaultBtn" value="'+ id+'/'+ item+'" style="background-color: red;">Remove</button></td></tr>');
				});
				$('#loadBar').hide();
				$('#openclassspot').html(class1.open);
			});
		}, 500);
	}

	function renderSearchPage(query) {
		console.log(query);
		$('#searchResults').html('');
		$('#students-search').val('');
		$('#loadBar').show();
		setTimeout(function () {
			$('#loadBar').hide();
			$.post("/class/ajax/search",
			{
			    query: query
			},
			function(data, status){
			    $('#searchResults').append('<table></table>');
			    data.forEach(function(item){
			    	var url = window.location.pathname;
			    	var id = url.split('/')[2];
			    	$('#searchResults > table').append('<tr><td>' + item.fullname+'</td><td><button class="addBtnq" value="'+ id+'/'+ item._id+'">Add</button></td></tr>')
			    })
			});
		}, 500);
		$('#query-search').html(query);
	}


	function renderSearchPageDefault(query) {
		console.log(query);
		$('#searchResults').html('');
		$('#students-search').val('');
		$('#loadBar').show();
		setTimeout(function () {
			$('#loadBar').hide();
			$.post("/class/ajax/search",
			{
			    query: query
			},
			function(data, status){
			    $('#searchResults').append('<table></table>');
			    data.forEach(function(item){
			    	var url = window.location.pathname;
			    	var id = url.split('/')[2];
			    	$('#searchResults > table').append('<tr><td>' + item.fullname+'</td><td><button class="defaultBtn" value="'+ id+'/'+ item._id+'">Add Default Student</button></td>/tr>')
			    })
			});
		}, 500);
		$('#query-search').html(query);
	}

	function redenderSearchPageTEACHER(query) {
		console.log(query);
		$('#searchResults').html('');
		$('#teachers-search').val('');
		$('#loadBar').show();
		setTimeout(function () {
			$('#loadBar').hide();
			$.post("/class/ajax/search/t",
			{
			    query: query
			},
			function(data, status){
			    $('#searchResults').append('<table></table>');
			    data.forEach(function(item){
			    	var url = window.location.pathname;
			    	var id = url.split('/')[2];
			    	$('#searchResults > table').append('<tr><td>' + item.fullname+'</td><td><button class="teacherBtn" value="'+ id+'/'+ item._id+'">Add TEACHER</button></td>/tr>')
			    })
			});
		}, 500);
		$('#query-search').html(query);
	}

	function renderPastClassPage(id) {
		$('.page').hide();
		$('#loadBar').show();
		setTimeout(function () {
			$('#loadBar').hide();
			$.get("/class/ajax/log/"+id,
			function(data, status){
				$('#loadBar').hide();
				console.log(data);
				$('#past-class').show();
				$('#pclassname').html(data.className);
			});
		}, 500);
	}


	function renderApproveableStudents() {
		var url = window.location.pathname;
		var id = url.split('/')[2];
		$('#loadBar').show();
		setTimeout(function () {
			$('#loadBar').hide();
			$.get( "/class/ajax/approveable/"+id, function( items ) {
				$('#pending > table').html('');
				items.forEach(function(item){
					$('#pending > table').append('<tr><td>' + item.creator.fullname+'</td><td><button class="addBtn" value="'+ id+'/'+ item.creator._id+'">Approve</button></td></tr>');
				});
			});
		}, 500);
	}

	function renderPastClassesPage() {
		var url = window.location.pathname;
		var id = url.split('/')[2];
		$('#loadBar').show();
		setTimeout(function () {
			$('#loadBar').hide();
			$.get( "/class/ajax/"+id+"/past-classes", function( items ) {
				console.log(items)
				$('#past-classes > table').html('');
				items.forEach(function(item){
					var dateData, dateObject;
					dateData = item.week.start;
					dateObject = new Date(Date.parse(dateData));

					readableDate1 = dateObject.toDateString();
					var dateData, dateObject;
					dataDate = item.week.finish;
					dateObject1 = new Date(Date.parse(dataDate));

					readableDate2 = dateObject1.toDateString();
					$('#past-classes > table').append('<tr><td>' + readableDate1 + ' - ' + readableDate2 +'</td><td><button class="viewCLASS" value="'+item._id+'">View</button></td></tr>');
				});
			});
		}, 500);
	}

	$('#search-back').click(function() {
		renderPage('home');
	})
	$('#search-bar-form').submit(function() {
	    // Get all the forms elements and their values in one step
	    renderPage('search');
	});
	$('#update-class-form').submit(function () {
		
	});
	$('#search-bar-form-teacher').submit(function() {
	    // Get all the forms elements and their values in one step
	    console.log('MADE IT HERE2');
	    renderPage('searchTeacher');
	});
	$('#search-bar-form-default_students').submit(function() {
	    // Get all the forms elements and their values in one step
	    renderPage('searchDefault');
	});
	$(document).on("click", ".addBtnq", function(){
		$.get( "/class/ajax/add/"+ $(this).val(), function( data ) {
	  		console.log('Student Added');
	  		renderPage('home');
		});
	})
	$(document).on("click", ".addBtn", function(){
		$.get( "/class/ajax/add/"+ $(this).val(), function( data ) {
	  		console.log('Student Added');
	  		renderPage('pending');
		});
	})
	$(document).on("click", ".defaultBtn", function(){
		$.get( "/class/ajax/add-default-student/"+ $(this).val(), function( data ) {
			renderPage('home');
	  		console.log('Added default student!');
		});
	})
	$(document).on("click", ".teacherBtn", function(){
		console.log('Adding teacher');
		$.get( "/class/ajax/add-teacher/"+ $(this).val(), function( data ) {
			renderPage('home');
	  		console.log('Added new teacher');
		});
	})
	$(document).on("click", ".removeBtn", function(){
		$.get( "/class/ajax/remove/"+ $(this).val(), function( data ) {
			renderPage('home');
	  		console.log('Removed Student From Class I think');
		});
	})
	$(document).on("click", ".viewCLASS", function(){
		var id = $(this).val();
		renderPastClassPage(id)

	})
	$(document).on("click", ".removeDefaultBtn", function(){
		$.get( "/class/ajax/remove/"+ $(this).val()+"?default_student=true", function( data ) {
			renderPage('home');
	  		console.log('Removed Student From Class I think');
		});
	})

	/*$('.dopenbutton').click(function() {
		$('.ddateselection').slideToggle( "slow", function() {
		    // Animation complete.
		  });
	})
	*/
	$('.attendancebutton').click(function() {
		var url = window.location.pathname;
		var Surl =  url +"/attendance";
		window.location = Surl;
	})
	$('.222 > .dopenbutton').click(function() {
		var url = window.location.pathname;
		var id = url.split('/')[2];
		$.get("/class/ajax/open/"+id+"?next=false", function( data ){
			console.log('Class Opened');
			location.reload();
		})
	})
	$('.drightbtn').click(function() {
		var url = window.location.pathname;
		var id = url.split('/')[2];
		$.get("/class/ajax/open/"+id+"?next=true", function( data ){
			console.log('Class Opened');
			location.reload();
			
		})
	})
});
