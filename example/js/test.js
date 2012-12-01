MC.Admin = {};

// TODO GET THE CLIENT ID (CUSTOM DATA ATTRIBUTES? CHECK)//////
MC.Admin = {

	turno_edit : '',
	
	sample_name : "Ej:Marina Pérez",
	init : function(){
		var id = window.location.hash.match(/#turno[0-9]+/);
		if(id){
			$(id[0] + ">td").fadeOut().fadeIn().css({ background: "#CCC" });
		}

		$(".zonas span").click(function(){

			$("#zones-edit").show();
			$("#zones-loading").hide();
			$("#zones-save").show();
			var app = $(this).parent().attr("appointment");

			$.ajax({
				type: "GET",
				url: MC.BASE + "/appointments/edit_zones/' + app + '.json",
				success: function(data){
					var appointment = data.appointment;
					var takenZones = appointment.Zone;
					var zones = data.zones;
					var div = $("#zones-edit");

					div.attr("app-id",app);

					for(zone in zones){
						var name = zones[zone].Zone.name;
						var id = zones[zone].Zone.id;
						div.append("<div class=\"sheckbox\"><input id=\"zone-"+id+"\" zone-id=\""+id+"\" type=\"checkbox\" value=\""+id+"\" >"+name+"</div>");
					}

					for(takenZone in takenZones){
						var id = takenZones[takenZone].id;
						$("#zone-'+id).attr('checked", true);
					}
					


					$.colorbox({inline:true,href:div});

					$(document).bind("cbox_cleanup", function(){
						$(".sheckbox").remove();
					});
				}
			});

		});

		$("#zones-save").click(function(){

			var btnGuardar = $(this)
			var btnLoad = $("#zones-loading");

			//Si hay una zona checkeada paso a cambiarlas
			if($(".sheckbox input[type=checkbox]:checked").length > 0){
				var app = $("#zones-edit').attr('app-id");
				var checkboxes = $(".sheckbox input[type=checkbox]:checked");
				var Zone = {};
				var Appointment = {};
				var i = 0;

				checkboxes.each(function(){
					var zone_id = $(this).attr("zone-id");
					Zone[i] = {zone_id:zone_id};
					i++;
				});

				i = 0;

				Appointment = {id:app};

				var data = {"Appointment':Appointment,'Zone":Zone};


				btnGuardar.hide();
				btnLoad.show();

				$.ajax({
					type: "POST",
					url: MC.BASE + "/appointments/edit_zones/' + app + '.json",
					data: data,
					success: function(data){
						var span = $(".zonas[appointment='+app+'] span");

						span.attr("title",data.appointment.Appointment.zones);

						if(data.appointment.Appointment.totalTime == 0){
							span.removeClass(span.attr("class"));
							span.attr("class','white");
						}

						if(data.appointment.Appointment.totalTime >= 5){
							span.removeClass(span.attr("class"));
							span.addClass("green zones");
						}

						if(data.appointment.Appointment.totalTime >= 25){
							span.removeClass(span.attr("class"));
							span.addClass("yellow zones");
						}

						if(data.appointment.Appointment.totalTime >= 40){
							span.removeClass(span.attr("class"));
							span.addClass("red zones");
						}

						 $("#zones-edit").hide();
						btnGuardar.show();
						btnLoad.hide();
						$.colorbox.close();
					}
				});
			}else{
				alert("No hay niguna zona seleccionada por favor seleccione alguna");
				return false;
			} 
		});
		
		$("#space").change(function(){
			
			MC.Turns.space = $("#space").val();
			
		}).change();
		
		// Specific information about an user
		$("a.moreinfo").click(function(){
			var client_id = $(this).attr("rel");
			MC.loading();
			$.ajax({
				type: "GET",
				url: MC.BASE + "/appointments/getById/" + client_id + ".json",
				success: function(data){
					MC.Admin.showInfo(data);
				}
			});
            return false;
		});
		// Cancel a particular appointment / Attended their appointment / NOT Attended their appointment
		$("a.cancel, a.attended , a.not-attended ").click(function(){
			if(!confirm("¿Está seguro que ' + $(this).attr('title') + '?")) return false;
			var img = this.getElementsByTagName("img")[0];
			
			img.src = MC.BASE+"/img/spinner.gif";
			//$(this).find("img').attr('src',MC.BASE+'/img/spinner.gif");
		});
		
		
		$(".turno-edit").colorbox({
			width : "900px",
			height : "600px",
			scrolling:false,
			transition:"fade", 
			inline:true, 
			href:"#lightbox",
			onLoad : function(){				
				MC.Admin.turno_edit = this.rel;
				
				if($(this).attr("data-espacio")){
					MC.Turns.space = $(this).attr("data-espacio");
				}
				
				MC.loading();
				var _date = $(this).attr("data-fecha");
				var parsedDate = $.datepicker.parseDate("yy-mm-dd", _date);
				MC.Turns.oDateSel = parsedDate;
				MC.Turns.datepicker.datepicker("setDate", parsedDate);
				MC.Turns.getTurnsByDate(_date,MC.Turns.space);// Make ajax call and retrieve all the times for the selected date
				
			}
		});
		// UnBind eventHandler and remake it for backend necesities
		$("#aceptar-admin").click(function(){
			//time=12:45 date=19/08/2011
			$.ajax({
				type: "GET",
				url: MC.BASE + "/admin/appointments/edit/' + MC.Turns.dateFormat(MC.Turns.oDateSel) + '/' + MC.Turns.sTimeSel.replace(':','.') + '/' + MC.Admin.turno_edit + '.json",
				success: function(data){
					$.colorbox.close();
					window.location.reload();
				}
			});
            return false;
		});
		
		$("#buscar-persona").submit(function(){
			var person = $("#persona");
			if(person.val() == "" || person.val() == MC.Admin.sample_name){
				person.parent().addClass("error");
				return false;
			}
		});
		
		MC.placeholder(document.getElementById("persona"),MC.Admin.sample_name);
        
        $("#imprimir").click(function(){
            window.print();
        });
		
		$("a.notes[title]").tooltip({position: "top left"});
		$("span.zones[title]").tooltip({position: "top left"});
		
		$(".notes,.newnotes").colorbox({
			width : "600px",
			height : "500px",
			scrolling:false,
			transition:"fade", 
			inline:true, 
			href:"#lightbox3",
			rel : "nofollow",
			loop : false,
			arrowKey : false,
			onLoad : function(){
				var txt = $("#admin_note");
				// Populate hidden field with the turno_id
				$("#admin-comments-turno').attr('value",this.rel);
				txt.attr("value','");
				if(this.rel){
					// Ajax request. Edit action
					$.ajax({
						type: "GET",
						url: MC.BASE + "/admin/appointments/getComments/' + this.rel + '.json",
						success: function(data){
							txt.attr("value",data.Appointment.admin_comment);
						}
					});
					return false;
				}
			}
		});
		
		$("#delete_note").click(function(){
			$("#admin_note').attr('value','");
			$("#app_notes").submit();
			return false;
		});
		
		$("#cancel-date").click(function(){
			$("#wrap_cancel_spaces").animate({opacity: "toggle"}, 200);
			return false;
		});
		
		/**
		* Cambio de espacios basados en la selección del usuario	
		*/
		$("#space").change(function(){
			$("#iraespacio").submit();
		});
	
	},

	showInfo : function(data){
		$.colorbox({
			onLoad : function(){
				$("#lightbox2 h1").html(data.Client.name);
				$("#info_dni span").html(data.Client.dni);
				$("#info_birthdate span").html(data.Client.birthdate);
				$("#info_cellphone span").html(data.Client.cellphone);
				$("#info_email span").html(data.Client.email);
				
				$("#info_turno span").html(data.Space.name);
				$("#info_date span").html(data.Appointment.date);
				$("#info_time span').html(data.Appointment.time + 'hs.");				
				$("#info_groupon span").html(data.Appointment.groupon);				
				$("#info_comment span").html(data.Appointment.comments);				
			},
			transition:"fade",
			inline:true,
			href : "#lightbox2"
		});
	}


};

MC.Admin.Stats = {
	init : function(){
		// Apply datepickers
		$("#from,#to").datepicker({
			dateFormat : "dd/mm/yy",
			//changeYear : true, 
			//yearRange : new Date().getFullYear()-100 +":"+ new Date().getFullYear(),
			showOn: "button",
			buttonImage: "img/calendario-mini.png",
			buttonImageOnly: true
		});
		/*$("#stats-date").submit(function(){
			//Validate
			var valid_date = /^([0]?[1-9]|[1|2][0-9]|[3][0|1])[.\/-]([0]?[1-9]|[1][0-2])[.\/-]([0-9]{4}|[0-9]{2})$/;
			if(valid_date.test($("#from').val()) && valid_date.test($('#to").val())){
				return true;
			}
			return false;
		});	*/
	},
	
	displayStats : function(obj){

		var holder = obj.holder;

		var percent = obj.percent;
		var percentHodler = obj.percentHolder;
		// Get the numeric representation of the width
		var totalwidth = holder.css("width").substring(3,-2);
		var totalTurnos = obj.total;
		var value = (obj.affected * totalwidth ) / totalTurnos;

		percentHodler.css("width",value + "px");
	}
};

$(function(){
	MC.Admin.init();
	MC.Admin.Stats.init();
});