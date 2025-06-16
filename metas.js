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
    }
}

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

function metasProximos(metas, rangoMin = 15) {
    const ahora = new Date();
    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
    const eventosCercanos = [];

    for (const expansion in metas) {
        for (const categoria in metas[expansion]) {
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

function mostrarQueHacer(offsetMinutos = 15) {
    let proximosMetas = metasProximos(metas, offsetMinutos)
	while (proximosMetas.length < 5) {
		proximosMetas = metasProximos(metas, offsetMinutos + 15)
	}
    const template = document.querySelector('div[data-template]').outerHTML.replace(' data-template', '')
    const htmlLista = proximosMetas.reduce((html, meta) => {
        const config = eventConfig[meta.evento] || {};
        const waypoint = config.waypoint || "";
        html += template
        .replace('::nombre::', meta.evento)
        .replace('::hora::', meta.hora)
        .replace('::expansion::', meta.expansion)
        .replace('::categoria::', meta.categoria)
        .replace('::timeleft::', meta.en)
        .replace('::color::', `${meta.color}`)
        .replace('::waypoint::', `<button data-code="${waypoint}">${waypoint}</button>`)
        return html;
    }, '')
    document.querySelector('.lista-que-hacer').innerHTML = htmlLista
}

document.addEventListener('click', async function (e) {
    let el = e.target;
    while (el && el !== document) {
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