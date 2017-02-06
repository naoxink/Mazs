;(function(){
	// Inicialización de objeto
	var mazs = {
		'lang': 'es'
	}

	// Establece el idioma
	mazs.setLanguage = function(lang){
		this.lang = lang
	}

	// Devuelve los detalles de el/los fractal/es indicado/s
	mazs.getFractalInfo = function(fractalID, callback){
		if(fractalID.constructor === Array){
			fractalID = fractalID.join(',')
		}
		// Petición a la API/v2
	}

	// Devuelve el listado de diarios
	mazs.getDailies = function(callback){  }

	window.Mazs = mazs
})()
