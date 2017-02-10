var url = window.location.pathname;
var id = url.split('/')[2];	


$.get( "/class/ajax/class/"+id, function( class1) {
	console.log(class1);
	if(class1 === null || class1.open == false){
		window.location = 'http://138.197.133.246/class';
	}
	var students = class1.students;
		students.forEach(function(item){
		$('ul').append('<li>' + item.fullname+' <select name="'+ item._id +'"><option selected="selected">Here</option><option>Tardy</option><option>Absent</option></select></li>');
	
	});
		Date.prototype.yyyymmdd = function() {
		  var mm = this.getMonth() + 1; // getMonth() is zero-based
		  var dd = this.getDate();

		  return [this.getFullYear() + '',
		          (mm>9 ? '' : '0')  +mm,
		          (dd>9 ? '' : '0')  +dd
		         ].join('-');
		};

		var start = class1.week.start;
		var finish = class1.week.finish;
		var startd = new Date(start);
		var finishd = new Date(finish);
		$('.stamp').html('( '+startd.yyyymmdd()+' : ' +finishd.yyyymmdd()+' )');
})