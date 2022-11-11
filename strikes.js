const ibsStrikes = [
  {
    'en': 'Voice of the Fallen and Claw of the Fallen',
    'es': 'Voz de los Caídos y Garra de los Caídos',
    'de': 'Stimme der Gefallenen und Klaue der Gefallenen'
  },
  {
    'en': 'Whisper of Jormag',
    'es': 'Susurro de Jormag',
    'de': 'Geflüster des Jormag'
  },
  {
    'en': 'Boneskinner',
    'es': 'Pelahuesos',
    'de': 'Knochenhäuter'
  },
  {
    'en': 'Cold War',
    'es': 'Guerra fría',
    'de': 'Kalter Krieg'
  },
  {
    'en': 'Fraenir of Jormag',
    'es': 'Fraenir de Jormag',
    'de': 'Fraenir Jormags'
  },
  {
    'en': 'Shiverpeaks Pass',
    'es': 'Paso de las Picosescalofriantes',
    'de': 'Zittergipfel-Pass'
  },
]

const eodStrikes = [
  {
    'en': 'Harvest Temple',
    'es': 'Templo de la Cosecha',
    'de': ''
  },
  {
    'en': 'Aetherblade Hideout',
    'es': 'Escondite Filoetéreo',
    'de': ''
  },
  {
    'en': 'Xunlai Jade Junkyard',
    'es': 'Chatarrería de Xunlai Jade',
    'de': ''
  },
  {
    'en': 'Kaineng Overlook',
    'es': 'Mirador de Kaineng',
    'de': ''
  }
]

const diffDaysFromDayZero = () => {
  const dayZero = new Date(2021, 0, 20, 2).getTime()
  const today = new Date().getTime()
  return parseInt( (today - dayZero) / (24*3600*1000) )
}

const getStrike = (daysFromZero, strikes) => {
  const rest = daysFromZero % strikes.length
  return strikes[rest]
}



const getTodaysStrike = (strikes) => {
  return getStrike(diffDaysFromDayZero(), strikes)
}

const getTomorrowsStrike = (strikes) => {
  return getStrike(diffDaysFromDayZero() + 1, strikes)
}
