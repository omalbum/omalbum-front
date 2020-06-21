var provincia;
var departamento;
var localidad;
var escuela;

var provincias;
var departamentos;
var localidades;
var escuelas;

function optionsFromList(xs){
	s = xs.map(p => "<option>"+p+"</option>").join("\n");
	return s;
}

function get_json(url){
	var res;
	$.ajax({
	  url: url,
	  async: false,
	  dataType: 'json',
	  success: function (response) { res = response;}
	});
	return res;
}

provincias = get_json("./jsons/provincias.json");
$( "#selectProvincia" ).autocomplete({ source: provincias });

function changeProvincia(){
	provincia = document.getElementById("selectProvincia").value;
	if (provincias.includes(provincia)){
		departamentos = get_json("./jsons/provincias/"+provincia+".json")
		$( "#selectDepartamento" ).autocomplete({ source: departamentos });

	}
}

function changeDepartamento(){
	departamento = document.getElementById("selectDepartamento").value;
	if (departamentos.includes(departamento)){
		localidades = get_json("./jsons/provincias/"+provincia+"/"+departamento+".json");
		$( "#selectLocalidad" ).autocomplete({ source: localidades });
	}
}
function changeLocalidad(){
	localidad = document.getElementById("selectLocalidad").value;
	if (localidades.includes(localidad)){
	escuelas = get_json("./jsons/provincias/"+provincia+"/"+departamento+"/"+localidad +".json");
		$( "#selectEscuela" ).autocomplete({ source: escuelas });
	}
}
