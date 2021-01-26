;(function(){
	// Inicialización de objeto
	var mazs = {
		'titleHeaders': {
			'today': {
				'es': 'Fractales de hoy',
				'en': 'Today\'s fractals',
				'de': ''
			},
			'tomorrow': {
				'es': 'Fractales de mañana',
				'en': 'Tomorrow\'s fractals',
				'de': ''
			},
			'ar': {
				'es': 'Calculadora de infusiones',
				'en': 'AR Infusion calculator'
			}
		},
		'lang': 'es',
		'urls': {
			'DAILIES_LIST': 'https://api.guildwars2.com/v2/achievements/daily',
			'ACHIEVEMENT_DETAIL': 'https://api.guildwars2.com/v2/achievements',
			'FRACTALS_LIST': 'https://api.guildwars2.com/v2/achievements/categories/88',
			'ITEM_DETAIL': 'https://api.guildwars2.com/v2/items',
			'TOMORROWS_FRACTALS': 'https://api.guildwars2.com/v2/achievements/daily/tomorrow'
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
				'en': 'Daily fractal tiers',
				'es': 'Fractales diarios de rango',
				'de': 'Tägliche Fraktalstufen'
			},
			'fractalRecommended': {
				'en': 'Recommended fractals',
				'es': 'Fractales recomendados',
				'de': 'Fractals Empfohlen'
			},
			'dailystrike': {
				'es': 'Misión de ataque de hoy',
				'en': 'Daily strike mission',
				'de': ''
			},
			'tomorrowstrike': {
				'es': 'Misión de ataque de mañana',
				'en': 'Tomorrow\'s strike mission',
				'de': ''
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
	mazs.formatBits = function(fractalID, bitsGroup){
		if(!bitsGroup){ return '' }
		var bitsStr = ''
		bitsGroup.forEach(function(bits){
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
				bitsStr += '<span class="tier ' + bitClass + '"><div>' + bits[tier][0] + "</div>"
				bitsStr += '<div>' + bits[tier][1].map(txt => {return ''+txt.lvl + ' <span class="agony">(' + txt.ar + ')</span>' }).join(' - ') + ''
				bitsStr += '</div></span>'
			}
		})
		return '<small>' + bitsStr + '</small>'
	}

	// Pinta (HTML) una caja de logro
	mazs.print = function(section, data){		
		var _this = this

		let bits = ""
		if(!_this.isRecommended(data)){
			bits = mazs.formatBits(data.id, data.bitsByTier)
		} else if (_this.isRecommended(data)) {
			bits = "<small class='nameFractal'><a class='linkFractal' href='" + fractalList[data.bit]["name"]["url"] + "' target='_blank'>" + fractalList[data.bit]["name"][_this.lang] + "</a> <span class='agony'>("+fractalList[data.bit]["ar"]+")</span></small>"
		}
		var html = this.achievementTemplate
				.replace('::icon::', 'src="' + data.icon + '"')
				.replace('::title::', data.name)
				.replace('::bits::', bits)
				.replace('::fractal-id::', data.id)
		if(mazs.isUnwanted(data.id)){
			html = html
					.replace('::class::', 'unwanted')
					.replace('::unwanted-text::', mazs.unwantedtext.no[_this.lang])
					.replace('::class-unwanted::', 'no')
		}else{
			html = html
					.replace('::class::', '')
					.replace('::unwanted-text::', mazs.unwantedtext.yes[_this.lang])
					.replace('::class-unwanted::', 'yes')
		}
		$(section).append(html)
	}
	mazs.printGroup = function(data, typeFractal) {
		var _this = this		

		Object.keys(data).forEach(function(key) {
			let detailsFractal = {}
			let bitsByTier = []
			const listFractals = fractalList
			data[key].forEach(function(fractal){
				detailsFractal.id = fractal.id
				detailsFractal.icon = "https://render.guildwars2.com/file/4A5834E40CDC6A0C44085B1F697565002D71CD47/1228226.png"
				detailsFractal.name = fractal.name
				for (var tier = 1; tier <= 4; tier++) {
					if (fractal.bit == tier) {
						// Cogemos del array fractalList de fractals.js el siguiente que coincida con el nombre del tier correspondiente
						let matchText = "escala de fractal";
						if (_this.lang == 'en') {
							matchText = "fractal scale";
						}
						let reMatchText = new RegExp(matchText + "\\s(\\d+)");
						let numberFractal = fractal.requirement.match(reMatchText)[1]
						let numbersFractals = []
						let re = new RegExp(fractal.name.toUpperCase());
						for (let key in listFractals) {		
							if (Number(key) >= Number(numberFractal) && re.test(listFractals[key]["name"][_this.lang].toUpperCase())) {
								if (tier==1 && key>25) break;
								else if (tier==2 && key>50) break;
								else if (tier==3 && key>75) break;
								numbersFractals.push({'lvl':key, 'ar':listFractals[key]["ar"]});
								detailsFractal.name = "<a class='linkFractal' href='" + listFractals[key]["name"]["url"] + "' target='_blank'>" + listFractals[key]["name"][_this.lang] + "</a>"
							}
						}

						bitsByTier.push({[`t${tier}`]: [ 'T'+tier, numbersFractals]})
					}
				}
			})
			detailsFractal['bitsByTier'] = bitsByTier
			_this.print('#' + typeFractal + '-tiers', detailsFractal)
		})
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
				
				detailsFractals = []
				for (var i = 0, len = details.length; i < len; i++) {
					details[i].bit = details[i].name.replace(/\D/ig, '')
					if(!_this.isRecommended(details[i])){
						details[i].name = details[i].name.replace(_this.regexs[_this.lang], '').trim()
						
						if (detailsFractals[details[i].name] === undefined) {
							detailsFractals[details[i].name] = []
						}
						detailsFractals[details[i].name].push(details[i])
						//_this.print('#fractal-tiers', details[i])
					}else if(_this.isRecommended(details[i])){
						_this.print('#fractal-recommended', details[i])
					}
				}
				_this.printGroup(detailsFractals, "fractal")

				return callback.call(_this, details)
			})
		})
		return this
	}

	mazs.getTomorrowsFractals = function(callback){
		callback = callback || this.noop
		var _this = this
		var recommendedIDs = [  ]
		this.getData(this.urls.TOMORROWS_FRACTALS, function(data){
			_this.getFractalInfo(data.fractals.map(function(f){
				return f.id
			}), function(details){

				$('#tomorrow-fractal-tiers').html('').append('<h3 class="section-title">' + _this.headers.fractalTiers[_this.lang] + '</h3>')
				$('#tomorrow-fractal-recommended').html('').append('<h3 class="section-title">' + _this.headers.fractalRecommended[_this.lang] + '</h3>')
				
				detailsFractals = []
				for (var i = 0, len = details.length; i < len; i++) {
					details[i].bit = details[i].name.replace(/\D/ig, '')
					if(!_this.isRecommended(details[i])){
						details[i].name = details[i].name.replace(_this.regexs[_this.lang], '').trim()
						
						if (detailsFractals[details[i].name] === undefined) {
							detailsFractals[details[i].name] = []
						}
						detailsFractals[details[i].name].push(details[i])
						//_this.print('#fractal-tiers', details[i])
					} else if (_this.isRecommended(details[i])) {
						_this.print('#tomorrow-fractal-recommended', details[i])
					}
				}
				_this.printGroup(detailsFractals, "tomorrow-fractal")

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

	mazs.calcAr = function(val){
		return Math.pow(2, parseInt(val, 10) - 1)
	}

	$(document).on('click', '.toggle-unwanted', mazs.toggleWanted)
	$(document).on('click', '.tier', mazs.toggleDone)

	window.Mazs = mazs
})()
