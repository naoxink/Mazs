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
		var html = this.achievementTemplate
				.replace('::icon::', 'src="' + data.icon + '"')
				.replace('::title::', data.name)
		if(data.bits){
			// Formatear
			var bitsStr = ''
			for(var tier in data.bits){
				bitsStr += '<span class="tier">' + data.bits[tier].join(', ') + '</span>'
			}
			html = html.replace('::bits::', '<small>' + bitsStr + '</small>')
		}else{
			html = html.replace('::bits::', '')
		}
		$(section).append(html)
	}

	mazs.isMaxTier = function(fractal){
		return fractal.name.indexOf('4') !== -1
	}

	mazs.isMinTier = function(fractal){
		return fractal.name.indexOf('1') !== -1
	}

	mazs.getFractalNumbers = function(fractal){
		return fractal.bits.map(function(bit){ return bit.text.replace(/\D/ig, '') }).join(', ')
	}

	mazs.groupByTier = function(fractal){
		var bits = {
			't1': [  ],
			't2': [  ],
			't3': [  ],
			't4': [  ]
		}
		for(var i = 0, len = fractal.bits.length; i < len; i++){
			var bit = parseInt(fractal.bits[i].text.replace(/\D/ig, ''), 10)
			if(bit <= 25){
				bits.t1.push(bit)
			}else if(bit > 25 && bit <= 50){
				bits.t2.push(bit)
			}else if(bit > 50 && bit <= 75){
				bits.t3.push(bit)
			}else if(bit > 75 && bit <= 100){
				bits.t4.push(bit)
			}
		}
		bits.t1.reverse()
		bits.t2.reverse()
		bits.t3.reverse()
		bits.t4.reverse()
		return bits
	}

	// Listado de logros de fractales (diarios)
	mazs.getFractals = function(callback){
		callback = callback || this.noop
		var _this = this
		this.getData(this.urls.FRACTALS_LIST, function(data){
			_this.getFractalInfo(data.achievements, function(details){
				$('#fractal-tiers').html('').append('<h3>' + _this.headers.fractalTiers[_this.lang] + '</h3>')
				$('#fractal-recommended').html('').append('<h3>' + _this.headers.fractalRecommended[_this.lang] + '</h3>')
				var bits = null
				for (var i = 0, len = details.length; i < len; i++) {
					if(!_this.isRecommended(details[i])){
						if(_this.isMaxTier(details[i])){
							details[i].name = details[i].name.replace(_this.regexs[_this.lang], '')
							details[i].bits = bits
							_this.print('#fractal-tiers', details[i])
						}else if(_this.isMinTier(details[i])){
							bits = _this.groupByTier(details[i])
						}
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
