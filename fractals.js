const fractalNamesUnic = [
{"en":"Volcanic", "es":"Fractal volcánico", lvls: [1, 19, 28, 52, 92]},
{"en":"Uncategorized", "es":"Fractal sin clasificar", lvls: [2, 36, 62, 79]},
{"en":"Snowblind", "es":"Fractal de la ceguera de la nieve", lvls: [3, 27, 51, 86]},
{"en":"Urban Battleground", "es":"Fractal del campo de batalla urbano", lvls: [4, 31, 57, 85]},
{"en":"Swampland", "es":"Fractal del cenagal", lvls: [5, 32, 56, 77, 89]},
{"en":"Cliffside", "es":"Fractal del despeñadero", lvls: [6, 46, 68, 94]},
{"en":"Aquatic Ruins", "es":"Fractal de las Ruinas Acuáticas", lvls: [7, 26, 61, 76]},
{"en":"Underground Facility", "es":"Fractal de la instalación subterránea", lvls: [8, 29, 53, 81]},
{"en":"Molten Furnace", "es":"Fractal de la fragua fundida", lvls: [9, 39, 58, 83]},
{"en":"Molten Boss", "es":"Fractal de los jefes fundidos", lvls: [10, 40, 69, 90]},
{"en":"Deepstone", "es":"Fractal de Rocahonda", lvls: [11, 33, 67, 84]},
{"en":"Siren's Reef", "es":"Fractal del Arrecife de la Sirena", lvls: [12, 37, 54, 78]},
{"en":"Chaos", "es":"Fractal del Caos", lvls: [13, 30, 63, 88]},
{"en":"Aetherblade", "es":"Fractal filoetéreo", lvls: [14, 45, 65, 93]},
{"en":"Thaumanova Reactor", "es":"Fractal del reactor taumanova", lvls: [15, 34, 55, 64, 82]},
{"en":"Twilight Oasis", "es":"Fractal del Oasis del Crepúsculo", lvls: [16, 41, 59, 87]},
{"en":"Captain Mai Trin Boss", "es":"Fractal de la jefa Capitana Mai Trin", lvls: [18, 42, 71, 91]},
{"en":"Solid Ocean", "es":"Fractal del océano sólido", lvls: [20, 35, 44, 60, 80]},
{"en":"Nightmare", "es":"Fractal de la Pesadilla", lvls: [22, 47, 72, 96]},
{"en":"Shattered Observatory", "es":"Fractal del Observatorio Asolado", lvls: [23, 48, 73, 97]},
{"en":"Sunqua Peak", "es":"Fractal del Pico de Sunqua", lvls: [24, 49, 74, 98]},
{"en":"Silent Surf", "es": "Oleaje silencioso", lvls: [21, 43, 66, 99]},
{"en":"Lonely Tower", "es": "Torre solitaria", lvls: [25, 50, 75, 100]},
{"en":"Kinfall", "es": "Hecatombe Allegada", lvls: [17, 38, 70, 95]}
];

const fractalList = {
    1: { "ar": 0 },
    2: { "ar": 0 },
    3: { "ar": 0 },
    4: { "ar": 0 },
    5: { "ar": 0 },
    6: { "ar": 0 },
    7: { "ar": 0 },
    8: { "ar": 0 },
    9: { "ar": 0 },
    10: { "ar": 0 },
    11: { "ar": 0 },
    12: { "ar": 0 },
    13: { "ar": 0 },
    14: { "ar": 0 },
    15: { "ar": 0 },
    16: { "ar": 0 },
    17: { "ar": 0 },
    18: { "ar": 0 },
    19: { "ar": 0 },
    20: { "ar": 8 },
    21: { "ar": 10 },
    22: { "ar": 11 },
    23: { "ar": 13 },
    24: { "ar": 15 },
    25: { "ar": 17 },

    26: { "ar": 18 },
    27: { "ar": 20 },
    28: { "ar": 22 },
    29: { "ar": 24 },
    30: { "ar": 26 },
    31: { "ar": 27 },
    32: { "ar": 29 },
    33: { "ar": 31 },
    34: { "ar": 33 },
    35: { "ar": 34 },
    36: { "ar": 36 },
    37: { "ar": 38 },
    38: { "ar": 40 },
    39: { "ar": 42 },
    40: { "ar": 43 },
    41: { "ar": 45 },
    42: { "ar": 47 },
    43: { "ar": 49 },
    44: { "ar": 50 },
    45: { "ar": 52 },
    46: { "ar": 54 },
    47: { "ar": 56 },
    48: { "ar": 58 },
    49: { "ar": 59 },
    50: { "ar": 61 },

    51: { "ar": 63 },
    52: { "ar": 65 },
    53: { "ar": 67 },
    54: { "ar": 68 },
    55: { "ar": 70 },
    56: { "ar": 72 },
    57: { "ar": 74 },
    58: { "ar": 75 },
    59: { "ar": 77 },
    60: { "ar": 79 },
    61: { "ar": 81 },
    62: { "ar": 83 },
    63: { "ar": 84 },
    64: { "ar": 86 },
    65: { "ar": 88 },
    66: { "ar": 90 },
    67: { "ar": 91 },
    68: { "ar": 93 },
    69: { "ar": 95 },
    70: { "ar": 97 },
    71: { "ar": 99 },
    72: { "ar": 100 },
    73: { "ar": 102 },
    74: { "ar": 104 },
    75: { "ar": 106 },

    76: { "ar": 107 },
    77: { "ar": 109 },
    78: { "ar": 111 },
    79: { "ar": 113 },
    80: { "ar": 115 },
    81: { "ar": 116 },
    82: { "ar": 118 },
    83: { "ar": 120 },
    84: { "ar": 122 },
    85: { "ar": 123 },
    86: { "ar": 125 },
    87: { "ar": 127 },
    88: { "ar": 129 },
    89: { "ar": 131 },
    90: { "ar": 132 },
    91: { "ar": 134 },
    92: { "ar": 136 },
    93: { "ar": 138 },
    94: { "ar": 139 },
    95: { "ar": 141 },
    96: { "ar": 143 },
    97: { "ar": 145 },
    98: { "ar": 147 },
    99: { "ar": 148 },
    100: { "ar": 150 }
}

// Establecer nombres
for (let lvl = 1; lvl <= 100; lvl++) {
    for (let fractal in fractalNamesUnic) {
        if (fractalNamesUnic[fractal].lvls.includes(lvl)) {
            fractalList[lvl].name = fractalNamesUnic[fractal]
            break
        }
    }
}