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
		'unwantedtext': {
			'no': {
				'es': 'No deseado',
				'en': 'Not wanted',
				'de': 'Unerwünscht'
			},
			'yes': {
				'es': 'Deseado',
				'en': 'Wanted',
				'de': 'Erwünscht'
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
	mazs.formatBits = function(fractalID, bits){
		if(!bits){ return '' }
		var bitsStr = ''
		for(var tier in bits){
			var bitClass = ''
			var done = localStorage.getItem('fractal-tier-done-' + fractalID)
			if(done){
				var doneSplitted = done.split('][')
				var today = new Date()
				if(parseInt(tier.replace('t', ''), 10) <= parseInt(doneSplitted[0], 10)){
					if(new Date(doneSplitted[1]).getDay() > today.getDay() && today.getHours() > 1){
						localStorage.removeItem('fractal-tier-done-' + fractalID)
					}else{
						bitClass = 'done'
					}
				}
			}
			bitsStr += '<span class="tier ' + bitClass + '">' + bits[tier].join(', ') + '</span>'
		}
		return '<small>' + bitsStr + '</small>'
	}

	// Pinta (HTML) una caja de logro
	mazs.print = function(section, data){
		var html = this.achievementTemplate
				.replace('::icon::', 'src="' + data.icon + '"')
				.replace('::title::', data.name)
				.replace('::bits::', mazs.formatBits(data.id, data.bitsByTier))
				.replace('::fractal-id::', data.id)
		if(mazs.isUnwanted(data.id)){
			html = html
					.replace('::class::', 'unwanted')
					.replace('::unwanted-text::', mazs.unwantedtext.no[this.lang])
					.replace('::class-unwanted::', 'no')
		}else{
			html = html
					.replace('::class::', '')
					.replace('::unwanted-text::', mazs.unwantedtext.yes[this.lang])
					.replace('::class-unwanted::', 'yes')
		}
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
						details[i].bitsByTier = _this.groupByTier(details[i])
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

	// Marca un fractal como 'No deseado'
	mazs.toggleWanted = function(e){
		var fractalID = $(this).parents('.achievement-container').data('fractalid')
		if(!fractalID){
			return false
		}
		var key = 'fractal-unwanted-' + fractalID
		if(localStorage.getItem(key)){
			localStorage.removeItem(key)
			$(this).parents('.achievement-container').removeClass('unwanted')
			$(this).removeClass('no').addClass('yes').text(mazs.unwantedtext.yes[mazs.lang])
		}else{
			localStorage.setItem(key, true)
			$(this).parents('.achievement-container').addClass('unwanted')
			$(this).removeClass('yes').addClass('no').text(mazs.unwantedtext.no[mazs.lang])
		}
	}

	// Indica si un fractal es 'No deseado'
	mazs.isUnwanted = function(fractalID){
		var key = 'fractal-unwanted-' + fractalID
		return localStorage.getItem(key) !== null
	}

	// Marcar tier como hecho
	mazs.toggleDone = function(e){
		var fractalID = $(this).parents('.achievement-container').data('fractalid')
		if($(this).hasClass('done')){
			var tier = $(this).parents('.achievement-container').find('.tier').index($(this)) + 1
			$(this).removeClass('done')
			for(var i = tier; i < 5; i++){
				$(this).parents('.achievement-container').find('.tier').eq(i - 1).removeClass('done')
			}
			tier--
		}else{
			var tier = $(this).parents('.achievement-container').find('.tier').index($(this)) + 1
			$(this).addClass('done')
			for(var i = tier; i > 0; i--){
				$(this).parents('.achievement-container').find('.tier').eq(i - 1).addClass('done')
			}
		}
		if(tier > 0){
			mazs.saveTierDone(fractalID, tier)
		}else{
			localStorage.removeItem('fractal-tier-done-' + fractalID)
		}
	}

	// Guarda en cookie el tier completado
	mazs.saveTierDone = function(fractalID, tier){
		localStorage.setItem('fractal-tier-done-' + fractalID, tier + '][' + new Date())
	}

	$(document).on('click', '.toggle-unwanted', mazs.toggleWanted)
	$(document).on('click', '.tier', mazs.toggleDone)

	window.Mazs = mazs
})()
