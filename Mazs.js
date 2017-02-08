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
			'en': /Daily Tier [1-4]/i,
			'es': /de rango [1-4] del día/i,
			'de': /(^Täglicher Abschluss: |, Rang [1-4]$)/gi
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

	// Fomatea (HTML) los niveles de fractales (::bits::)
	mazs.formatBits = function(bits){
		if(!bits){ return '' }
		var bitsStr = ''
		for(var tier in bits){
			bitsStr += '<span class="tier">' + bits[tier].join(', ') + '</span>'
		}
		return '<small>' + bitsStr + '</small>'
	}

	// Pinta (HTML) una caja de logro
	mazs.print = function(section, data){
		var html = this.achievementTemplate
				.replace('::icon::', 'src="' + data.icon + '"')
				.replace('::title::', data.name)
				.replace('::bits::', mazs.formatBits(data.bits))
		$(section).append(html)
	}

	// Comprueba que un fractal es tier máximo (4)
	mazs.isMaxTier = function(fractal){
		return fractal.name.indexOf('4') !== -1
	}

	// Comprueba que un fractal es tier mínimo (1)
	mazs.isMinTier = function(fractal){
		return fractal.name.indexOf('1') !== -1
	}

	// Transforma los textos de los bits (niveles) en sólo el número
	mazs.getFractalNumbers = function(fractal){
		return fractal.bits.map(function(bit){ return bit.text.replace(/\D/ig, '') }).join(', ')
	}

	// Agrupa los bits por tiers (t1, t2, t3, t4)
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
		var recommendedIDs = [  ]
		this.getData(this.urls.FRACTALS_LIST, function(data){
			_this.getFractalInfo(data.achievements, function(details){
				$('#fractal-tiers').html('').append('<h3 class="section-title">' + _this.headers.fractalTiers[_this.lang] + '</h3>')
				$('#fractal-recommended').html('').append('<h3 class="section-title">' + _this.headers.fractalRecommended[_this.lang] + '</h3>')
				for (var i = 0, len = details.length; i < len; i++) {
					if(!_this.isRecommended(details[i]) && _this.isMinTier(details[i])){
						details[i].name = details[i].name.replace(_this.regexs[_this.lang], '')
						details[i].bits = _this.groupByTier(details[i])
						_this.print('#fractal-tiers', details[i])
					}else if(_this.isRecommended(details[i])){
						details[i].name = details[i].name
										+ '<br><small>' + fractalNames[_this.lang][details[i].name.replace(/\D/ig, '')] + '</small>'
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
