;(function(){
	// Inicialización de objeto
	var mazs = {
		'lang': 'es',
		'urls': {
			'DAILIES_LIST': 'https://api.guildwars2.com/v2/achievements/daily',
			'ACHIEVEMENT_DETAIL': 'https://api.guildwars2.com/v2/achievements',
			'FRACTALS_LIST': 'https://api.guildwars2.com/v2/achievements/categories/88',
			'ITEM_DETAIL': 'https://api.guildwars2.com/v2/items'
		},
		'keywords': {
			'en': 'recommended',
			'es': 'recomendado',
			'de': 'empfohlenes'
		},
		'regexs': {
			'en': /Daily Tier 4/i,
			'es': /de rango 4 del día/i,
			'de': /(^Täglicher Abschluss: |, Rang 4$)/gi
		},
		'headers': {
			'fractalTiers': {
				'en': 'Daily fractal tiers (1, 2, 3, 4)',
				'es': 'Fractales diarios de rango (1, 2, 3, 4)',
				'de': 'Tägliche Fraktalstufen (1, 2, 3, 4)'
			},
			'fractalRecommended': {
				'en': 'Recommended fractals',
				'es': 'Fractales recomendados',
				'de': 'Fractals Empfohlen'
			}
		},
		'noop': function(){  },
		'achievementTemplate': $('#achievement-template').html()
	}

	// Establece el idioma
	mazs.setLanguage = function(lang){
		this.lang = lang
	}

	// Hace la petición a la API
	mazs.getData = function(url, callback){
		$.ajax({
			'url': url,
			'type': 'GET',
			'dataType': 'json',
			'async': false,
			'success': callback
		})
	}

	// Devuelve los detalles de el/los fractal/es indicado/s
	mazs.getFractalInfo = function(fractalID, callback){
		if(fractalID.constructor === Array){
			fractalID = fractalID.join(',')
		}
		var url = this.urls.ACHIEVEMENT_DETAIL + "?ids=" + fractalID + "&lang=" + this.lang
		this.getData(url, callback)
		return this
	}

	// Listado de logros PvE (diarios)
	mazs.getPveAchievements = function(callback){
		this.getData(this.urls.DAILIES_LIST, callback)
		return this
	}

	// Comprueba si es recomendado
	mazs.isRecommended = function(fractal){
		return fractal.name.toLowerCase().indexOf(this.keywords[this.lang]) !== -1
	}

	mazs.print = function(section, data){
		$(section).append(
			this.achievementTemplate
				.replace('::icon::', 'src="' + data.icon + '"')
				.replace('::title::', data.name)
		)
	}

	mazs.isMaxTier = function(fractal){
		return fractal.name.indexOf('4') !== -1
	}

	// Listado de logros de fractales (diarios)
	mazs.getFractals = function(callback){
		callback = callback || this.noop
		var _this = this
		this.getData(this.urls.FRACTALS_LIST, function(data){
			_this.getFractalInfo(data.achievements, function(details){
				$('#fractal-tiers').html('').append('<h3>' + _this.headers.fractalTiers[_this.lang] + '</h3>')
				$('#fractal-recommended').html('').append('<h3>' + _this.headers.fractalRecommended[_this.lang] + '</h3>')
				for (var i = 0, len = details.length; i < len; i++) {
					if(!_this.isRecommended(details[i]) && _this.isMaxTier(details[i])){
						details[i].name = details[i].name.replace(_this.regexs[_this.lang], '')
						_this.print('#fractal-tiers', details[i])
					}else if(_this.isRecommended(details[i])){
						_this.print('#fractal-recommended', details[i])
					}
				}
				return callback.call(_this, details)
			})
		})
		return this
	}

	window.Mazs = mazs
})()
