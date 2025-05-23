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
			'TOMORROWS_FRACTALS': 'https://api.guildwars2.com/v2/achievements/daily/tomorrow',
			'DAILY_STRIKES_LIST': 'https://api.guildwars2.com/v2/achievements/categories/250'
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
				'es': 'Misión de ataque de hoy (IBS)',
				'en': 'Daily strike mission (IBS)',
				'de': ''
			},
			'tomorrowstrike': {
				'es': 'Misión de ataque de mañana (IBS)',
				'en': 'Tomorrow\'s strike mission (IBS)',
				'de': ''
			},
			'dailyeodstrike': {
				'es': 'Misión de ataque de hoy (EoD)',
				'en': 'Daily strike mission (EoD)',
				'de': ''
			},
			'tomorroweodstrike': {
				'es': 'Misión de ataque de mañana (EoD)',
				'en': 'Tomorrow\'s strike mission (EoD)',
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
		'achievementTemplate': document.querySelector('#achievement-template').innerHTML
	}

	// Establece el idioma
	mazs.setLanguage = function(lang){
		this.lang = lang
	}

	// Hace la petición a la API
	mazs.getData = function(url, callback){
		fetch(url).then(res => res.json()).then(callback)
	}

	mazs.getDailyStrikes = function() {
		mazs.getData(this.urls.DAILY_STRIKES_LIST + '?lang=' + this.lang, res => {
			if (!res) return false
			document.querySelector('#today-strikes-header').innerText = res.name
			// Obtener datos de las strikes
			mazs.getFractalInfo(res.achievements, function(details){
				details.forEach(detail => mazs.printDailyStrike(res.icon, detail))
			})
		})
	}

	mazs.printDailyStrike = function(icon, detail) {
		let location = ''
		let alias = ''
		if (Strikes[detail.id]) {
			location = Strikes[detail.id].location
			alias = Strikes[detail.id].alias.map(a => `<span class="alias">${a}</span>`).join('')
		}
		document.querySelector('#daily-strikes').innerHTML = document.querySelector('#daily-strikes').innerHTML + `<div class="strike">
			<img class="icon" src="${icon}">
			<span class="title">${detail.name}</span>
			<div class="extra">
				<small class="location">${location}</small>
				<small class="aliases">${alias}</small>
			</div>
		</div>`
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
	mazs.formatBits = function(fractalID, bitsmap){
		if(!bitsmap){ return '' }
		var bitsStr = ''

		// Ordenar tiers
		bitsmap = Object.keys(bitsmap)
	  .sort((a, b) => a.slice(1) - b.slice(1)) // ordena por el número después de la T
	  .reduce((acc, key) => {
	    acc[key] = bitsmap[key]
	    return acc
	  }, {})

		for (let tier in bitsmap) {
			const higherFractal = bitsmap[tier].pop()

			var bitClass = ''
			var done = localStorage.getItem('fractal-tier-done-' + fractalID)
			if(done){
				var doneSplitted = done.split('][')
				var today = new Date()
				if(parseInt(tier.replace('T', ''), 10) <= parseInt(doneSplitted[0], 10)){
					if(new Date(doneSplitted[1]).getDay() > today.getDay() && today.getHours() > 1){
						localStorage.removeItem('fractal-tier-done-' + fractalID)
					}else{
						bitClass = 'done'
					}
				}
			}
			bitsStr += '<span class="tier ' + bitClass + '"><div>' + tier + "</div>"
			bitsStr += '<div>' + higherFractal.lvl + ' <span class="agony">(' + higherFractal.ar + ')</span>'
			bitsStr += '</div></span>'

		}
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
		document.querySelector(section).innerHTML = document.querySelector(section).innerHTML + html
	}
	mazs.printGroup = function(data, typeFractal) {
		var _this = this		

		Object.keys(data).forEach(function(key) {
			let detailsFractal = {}
			let bitsByTier = {}
			const listFractals = fractalList
			data[key].forEach(function(fractal){
				detailsFractal.id = fractal.id
				detailsFractal.icon = "https://render.guildwars2.com/file/4A5834E40CDC6A0C44085B1F697565002D71CD47/1228226.png"
				detailsFractal.name = fractal.name
				for (var tier = 1; tier <= 4; tier++) {
					if (+fractal.bit == tier) {
						// Cogemos del array fractalList de fractals.js el siguiente que coincida con el nombre del tier correspondiente
						let matchText = "escala de fractal";
						if (_this.lang == 'en') {
							matchText = "fractal scale";
						}
						let numbersFractals = []
						let re = new RegExp(fractal.name.toUpperCase());
						for (let key in listFractals) {
							if (re.test(listFractals[key]["name"][_this.lang].toUpperCase())) {
								if (tier === 1 && key > 25) break;
								else if (tier === 2 && key > 50) break;
								else if (tier === 3 && key > 75) break;
								numbersFractals.push({ lvl: key, ar: listFractals[key]["ar"] });
								detailsFractal.name = "<a class='linkFractal' href='" + listFractals[key]["name"]["url"] + "' target='_blank'>" + listFractals[key]["name"][_this.lang] + "</a>"
							}
						}

						bitsByTier[`T${tier}`] = numbersFractals
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
				document.querySelector('#fractal-tiers').innerHTML = '<h3 class="section-title">' + _this.headers.fractalTiers[_this.lang] + '</h3>'
				document.querySelector('#fractal-recommended').innerHTML = '<h3 class="section-title">' + _this.headers.fractalRecommended[_this.lang] + '</h3>'
				
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

				document.querySelector('#tomorrow-fractal-tiers').innerHTML = '<h3 class="section-title">' + _this.headers.fractalTiers[_this.lang] + '</h3>'
				document.querySelector('#tomorrow-fractal-recommended').innerHTML = '<h3 class="section-title">' + _this.headers.fractalRecommended[_this.lang] + '</h3>'
				
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
		var fractalID = this.closest('.achievement-container').getAttribute('data-fractalid')
		if(!fractalID){
			return false
		}
		var key = 'fractal-unwanted-' + fractalID
		if(localStorage.getItem(key)){
			localStorage.removeItem(key)
			this.closest('.achievement-container').classList.remove('unwanted')
			this.classList.remove('no')
			this.classList.add('yes')
			this.innerText = mazs.unwantedtext.yes[mazs.lang]
		}else{
			localStorage.setItem(key, true)
			this.closest('.achievement-container').classList.add('unwanted')
			this.classList.remove('yes')
			this.classList.add('no')
			this.innerText = mazs.unwantedtext.no[mazs.lang]
		}
	}

	// Indica si un fractal es 'No deseado'
	mazs.isUnwanted = function(fractalID){
		var key = 'fractal-unwanted-' + fractalID
		return localStorage.getItem(key) !== null
	}

	mazs.getElementIndex = (parent, selector, element) => {
		const children = [...parent.querySelectorAll(selector)]
		for (let n = 0; n < children.length; n++) {
			if (children[n] === element) return n
		}
		return -1
	}

	// Marcar tier como hecho
	mazs.toggleDone = function(e){
		const clicked = this
		const achi = this.closest('.achievement-container')
		const fractalID = achi.getAttribute('data-fractalid')
		const isDone = this.classList.contains('done')
		let passed = false
		let index = -1
		let tiers = [...achi.querySelectorAll('.tier')]
		tiers.forEach((tier, i) => {
			tier.classList.remove('done')
			if (passed) return false
			if (clicked === tier) {
				index = i
				passed = true
			}
			tier.classList.add('done')
		})
		if(index > 0){
			mazs.saveTierDone(fractalID, index + 1)
		}else{
			localStorage.removeItem('fractal-tier-done-' + fractalID)
		}
		return false
	}

	// Guarda en cookie el tier completado
	mazs.saveTierDone = function(fractalID, tier){
		localStorage.setItem('fractal-tier-done-' + fractalID, tier + '][' + new Date())
	}

	mazs.calcAr = function(val){
		return Math.pow(2, parseInt(val, 10) - 1)
	}

	document.addEventListener('click', function(e) {
		if (e.target.classList.contains('toggle-unwanted')) {
			mazs.toggleWanted.bind(e.target)()
		} else if (e.target.classList.contains('tier') || e.target.closest('.tier')) {
			mazs.toggleDone.bind(e.target.classList.contains('tier') ? e.target : e.target.closest('.tier'))()
		}
	})

	window.Mazs = mazs
})()
