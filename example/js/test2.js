var toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}



MC.Admin.Turn = {};

MC.Admin.Turn.init = function(){
	/**
	* Make ajax call to check if user exists
	*
	* If the provided dni matchs an existing user then the resto of the fields are populated
	*/
	$('#check-existing').click(function(){

		$('#nacimiento,#email,#nombre,#celular').val('');
		
		var value = $('#dni');
		
		if(value.val() != ''){
			$(this).hide();
			$('#wrap-existing img').show();
			$.ajax({
				type: "GET",
				url: MC.BASE + "/clients/getByDNI/" + value.val() + '.json',
				//data: params,
				success: function(data){
					//console.log(Object.prototype.toString.call(data));
					//console.log(toType(data));
					if(typeof data != 'undefined' || data != false){
						
						$('#wrap-existing img').hide();
						$('#check-existing').show();
						
						$('#nombre').val(data.name);
						$('#celular').val(data.cellphone);
						$('#email').val(data.email);
						if(typeof data.birthdate != 'undefined'){							
							var date = data.birthdate.split('-');
							$('#nacimiento').val(MC.Turns.dateFormat(new Date(date[0],date[1],date[2])));
						}
					}
				}
			});			
		}else{
			value.parent().addClass('error');
		}
		return false;
	});
	
	//Ajax request for groupon
	$('a#GrouponVal').click(function(event){
		event.preventDefault();
		$.ajax({
			url : MC.BASE + '/groupon/code_validation/'+$(this).text()+'.json',
			dataType : 'json',
			success : function(data){
			}
		});	
	});
		
}

$(function(){ MC.Admin.Turn.init(); });