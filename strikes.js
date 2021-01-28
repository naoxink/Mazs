const diffDaysFromDayZero = () => {
  const dayZero = new Date(2021, 0, 21).getTime()
  const today = new Date().getTime()
  return parseInt( (today - dayZero) / (24*3600*1000) )
}

const getStrike = daysFromZero => {
  const strikeMissions = [
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
  const rest = daysFromZero % strikeMissions.length
  return strikeMissions[rest]
}

const getTodaysStrike = () => {
  return getStrike(diffDaysFromDayZero())
}

const getTomorrowsStrike = () => {
  return getStrike(diffDaysFromDayZero() + 1)
}
