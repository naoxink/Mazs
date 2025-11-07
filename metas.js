// Todas las duraciones son cíclicas
const metas = {
	"Central Tyria": {
		"World Bosses": {
			"Golem Mark II": generarHorasCiclo('16:00', 180),
			"Gran sierpe de la selva": generarHorasCiclo('15:15', 120),
			"Garra de jormag": generarHorasCiclo('16:30', 180),
			"Behemot de las sombras": generarHorasCiclo('13:45', 120),
			"Almirante Taidha Covington": generarHorasCiclo('14:00', 180),
			"Chamán Svanir": generarHorasCiclo('14:15', 120),
			"Megadestructor": generarHorasCiclo('14:30', 180),
			"Elemental de fuego": generarHorasCiclo('14:45', 120),
			"El asolador": generarHorasCiclo('15:00', 180),
			"Modniir Ulgoth": generarHorasCiclo('15:30', 180),
            "Tequatl": ['18:00', '21:00', '02:00', '05:00', '09:00', '13:30'],
            "Reina Karka": ['20:00', '01:00', '04:00', '08:00', '12:30', '17:00']
		},
		"Sangre y Hielo": {
			"Tormenta Dracónica": generarHorasCiclo('15:00', 120),
			"Drakkar": generarHorasCiclo('15:05', 120),
			"Defiende la fortaleza de Bjora": generarHorasCiclo('15:45', 120),
		},

	},
	"Heart of Thorns": {
		"Corazón de Maguuma": {
			"Octohiedra": generarHorasCiclo('15:00', 120),
			"Gerente Chack": generarHorasCiclo('14:30', 120),
		}
	},
	"End of Dragons": {
		"Cantha": {
			"Ataque de los filoetéreos": generarHorasCiclo('15:30', 120),
			"Apagón en Kaineng": generarHorasCiclo('14:00', 120),
			"Muerte del dragón": generarHorasCiclo('15:00', 120)
		}
	},
	"Secrets of the Obscure": {
		"Cuerno de Maguuma": {
			"Accediendo a la torre del brujo": generarHorasCiclo('15:00', 120),
			"La Defensa de Amnytas": generarHorasCiclo('14:00', 120),
			"Convergencia: Zona exterior de Nayos": generarHorasCiclo('15:30', 180)
		}
	},
	"Janthir Wilds": {
		"Islas de Janthir": {
			"De niebla y monstruos": generarHorasCiclo('14:30', 120),
			"Un viaje titánico": generarHorasCiclo('15:20', 120),
			"Convergencia: Monte Balrior": generarHorasCiclo('14:00', 180)
		}
	},
    "Visions of Eternity": {
        "Castora": {
            "¡Reyerta de los Venadoasolador!": generarHorasCiclo('13:40', 120),
            "Secretos del bosquezuelo": generarHorasCiclo('14:40', 120)
        }
    }
}

const eventConfig = {
    "Golem Mark II": {
        "waypoint": "[&BNQCAAA=]"
    },
    "Gran sierpe de la selva": {
        "waypoint": "[&BEEFAAA=]"
    },
    "Garra de jormag": {
        "waypoint": "[&BHoCAAA=]"
    },
    "Behemot de las sombras": {
        "waypoint": "[&BPcAAAA=]"
    },
    "Almirante Taidha Covington": {
        "waypoint": "[&BKgBAAA=]"
    },
    "Chamán Svanir": {
        "waypoint": "[&BMIDAAA=]"
    },
    "Megadestructor": {
        "waypoint": "[&BM0CAAA=]"
    },
    "Elemental de fuego": {
        "waypoint": "[&BEcAAAA=]"
    },
    "El asolador": {
        "waypoint": "[&BE4DAAA=]"
    },
    "Modniir Ulgoth": {
        "waypoint": "[&BLAAAAA=]"
    },
    "Tormenta Dracónica": {
        "waypoint": "[&BAkMAAA=]"
    },
    "Drakkar": {
        "waypoint": "[&BDkMAAA=]"
    },
    "Defiende la fortaleza de Bjora": {
        "waypoint": "[&BCcMAAA=]"
    },
    "Octohiedra": {
        "waypoint": "[&BAIIAAA=]"
    },
    "Gerente Chack": {
        "waypoint": "[&BPUHAAA=]"
    },
    "Ataque de los filoetéreos": {
        "waypoint": "[&BGUNAAA=]"
    },
    "Apagón en Kaineng": {
        "waypoint": "[&BBkNAAA=]"
    },
    "Muerte del dragón": {
        "waypoint": "[&BKIMAAA=]"
    },
    "Accediendo a la torre del brujo": {
        "waypoint": "[&BL4NAAA=]"
    },
    "La Defensa de Amnytas": {
        "waypoint": "[&BDQOAAA=]"
    },
    "Convergencia: Zona exterior de Nayos": {
        "waypoint": "[&BB8OAAA=]"
    },
    "De niebla y monstruos": {
        "waypoint": "[&BCoPAAA=]"
    },
    "Un viaje titánico": {
        "waypoint": "[&BGEPAAA=]"
    },
    "Convergencia: Monte Balrior": {
        "waypoint": "[&BK4OAAA=]"
    },
    "Tequatl": {
        "waypoint": "[&BNABAAA=]"
    },
    "Reina Karka": {
        "waypoint": "[&BNUGAAA=]"
    },
    "¡Reyerta de los Venadoasolador!": {
        "waypoint": "[&BJEPAAA=]"
    },
    "Secretos del bosquezuelo": {
        "waypoint": "[&BJ4PAAA=]"
    }
}

// Estado de filtros activo (null = ninguno)
const activeFilters = {
  expansion: null,
  category: null
}

// guarda el último offset usado para re-render cuando se hace toggle en filtros
let lastOffsetMinutos = 15;

function generarHorasCiclo(inicio, intervaloMinutos) {
  const resultado = [];
  const [hInicio, mInicio] = inicio.split(':').map(Number);
  let fechaActual = new Date(0, 0, 0, hInicio, mInicio);
  const fechaFin = new Date(fechaActual);
  fechaFin.setDate(fechaFin.getDate() + 1); // 24h después

  while (fechaActual < fechaFin) {
    const horas = fechaActual.getHours().toString().padStart(2, '0');
    const minutos = fechaActual.getMinutes().toString().padStart(2, '0');
    resultado.push(`${horas}:${minutos}`);
    fechaActual.setMinutes(fechaActual.getMinutes() + intervaloMinutos);
  }

  return resultado;
}

function calcularColorFondo(en, max = 16, min = 0) {
    // De verde (#a8e063) a rojo (#ff5858)
    const percent = Math.max(0, Math.min(1, (en - min) / (max - min)));
    const r = Math.round(255 * (1 - percent) + 168 * percent);
    const g = Math.round(88 * (1 - percent) + 224 * percent);
    const b = Math.round(88 * (1 - percent) + 99 * percent);
    return `rgb(${r},${g},${b})`;
}

function metasProximos(metas, rangoMin = 15, filters = {}) {
    const ahora = new Date();
    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
    const eventosCercanos = [];

    for (const expansion in metas) {
        // si hay filtro de expansion y no coincide, saltar
        if (filters.expansion && filters.expansion !== expansion) continue;

        for (const categoria in metas[expansion]) {
            // si hay filtro de categoria y no coincide, saltar
            if (filters.category && filters.category !== categoria) continue;

            for (const evento in metas[expansion][categoria]) {
                const horas = metas[expansion][categoria][evento];
                for (const hora of horas) {
                    const [h, m] = hora.split(':').map(Number);
                    const minutosEvento = h * 60 + m;
                    let diff = minutosEvento - minutosAhora;
                    if (diff < 0) diff += 1440; // para eventos al día siguiente
                    if (diff >= 0 && diff <= rangoMin) {
                        eventosCercanos.push({
                            expansion,
                            categoria,
                            evento,
                            hora,
                            en: diff,
                            color: calcularColorFondo(diff, rangoMin, 0)
                        });
                    }
                }
            }
        }
    }

    // Ordena por tiempo restante
    eventosCercanos.sort((a, b) => a.en - b.en);
    return eventosCercanos;
}

function mostrarQueHacer(offsetMinutos = lastOffsetMinutos) {
    // guarda el offset usado
    // lastOffsetMinutos = offsetMinutos;  // moved below

    // intentaremos ampliar el rango si no hay suficientes metas,
    // pero evitando bucle infinito: incrementamos el offset y limitamos intentos.
    let currentOffset = offsetMinutos;
    const incremento = 15;
    const maxAttempts = 8; // máximo +120 minutos en total
    let attempts = 0;

    let proximosMetas = metasProximos(metas, currentOffset, activeFilters);
    while (proximosMetas.length < 5 && attempts < maxAttempts) {
        attempts++;
        currentOffset += incremento;
        proximosMetas = metasProximos(metas, currentOffset, activeFilters);
        // si los filtros hacen que no haya ningún evento posible en todo el dataset,
        // evitamos seguir intentando (rompe el bucle)
        if (proximosMetas.length === 0 && attempts === maxAttempts) break;
    }

    // guarda el último offset realmente usado para re-renders posteriores
    lastOffsetMinutos = currentOffset;

    const template = document.querySelector('div[data-template]').outerHTML.replace(' data-template', '')
    const htmlLista = proximosMetas.reduce((html, meta) => {
        const config = eventConfig[meta.evento] || {};
        const waypoint = config.waypoint || "";

        // clases para indicar tag activo
        const expActiveClass = activeFilters.expansion === meta.expansion ? 'active' : '';
        const catActiveClass = activeFilters.category === meta.categoria ? 'active' : '';

        // renderiza tags clicables para expansion y categoria
        const expansionTag = `<button type="button" class="filter-tag expansion ${expActiveClass}" aria-pressed="${expActiveClass ? 'true' : 'false'}" data-filter-type="expansion" data-filter-value="${meta.expansion}">${meta.expansion}</button>`;
        const categoryTag = `<button type="button" class="filter-tag category ${catActiveClass}" aria-pressed="${catActiveClass ? 'true' : 'false'}" data-filter-type="category" data-filter-value="${meta.categoria}">${meta.categoria}</button>`;

        html += template
        .replace('::nombre::', meta.evento)
        .replace('::hora::', meta.hora)
        .replace('::expansion::', expansionTag)
        .replace('::categoria::', categoryTag)
        .replace('::timeleft::', meta.en)
        .replace('::color::', `${meta.color}`)
        .replace('::waypoint::', `<button data-code="${waypoint}"><img src="https://wiki.guildwars2.com/images/thumb/d/d2/Waypoint_%28map_icon%29.png/20px-Waypoint_%28map_icon%29.png" alt="waypoint icon" style="width:16px; height:16px; vertical-align:middle; margin-right:4px;">${waypoint}</button>`)
        return html;
    }, '')
    document.querySelector('.lista-que-hacer').innerHTML = htmlLista
}

document.addEventListener('click', async function (e) {
    let el = e.target;
    while (el && el !== document) {
        // Manejo de tags de filtro (expansion / category)
        if (el.hasAttribute('data-filter-type')) {
            const type = el.getAttribute('data-filter-type') // "expansion" | "category"
            const value = el.getAttribute('data-filter-value')
            // toggle: si ya está activo, desactivar; si no, activar
            if (activeFilters[type] === value) {
                activeFilters[type] = null
            } else {
                activeFilters[type] = value
            }
            mostrarQueHacer(lastOffsetMinutos) // re-render con filtros actualizados
            break;
        }

        if (el.hasAttribute('data-code')) {
            const text = el.getAttribute('data-code')
            try {
                await navigator.clipboard.writeText(text)
            } catch (err) {
                // fallback for older browsers
                const textarea = document.createElement('textarea')
                textarea.value = text
                document.body.appendChild(textarea)
                textarea.select()
                document.execCommand('copy')
                document.body.removeChild(textarea)
            }
            // Mostrar el toast flotante
            const toast = document.getElementById('copiado-toast');
            if (toast) {
                toast.style.display = 'block';
                clearTimeout(window._copiadoToastTimeout);
                window._copiadoToastTimeout = setTimeout(() => {
                    toast.style.display = 'none';
                }, 1000);
            }
            break;
        }
        el = el.parentElement;
    }
});
