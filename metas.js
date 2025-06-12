// Todas las duraciones son cíclicas
const metas = {
	"Central Tyria": {
		"World Bosses": {
			"Golem Mark II": generarHorasCiclo('16:00', 180),
			"Gran sierpe de la selva": generarHorasCiclo('15:15', 120),
			"Garra de jormag": generarHorasCiclo('16:30', 180),
			"Behemot de las sombras": generarHorasCiclo('13:45', 120),
			"Almirante Taidha Covington": generarHorasCiclo('14:00', 180),
			"Chamán Svanir": generarHorasCiclo('14:15', 160),
			"Megadestructor": generarHorasCiclo('14:30', 180),
			"Elemental de fuego": generarHorasCiclo('14:45', 160),
			"El asolador": generarHorasCiclo('15:00', 180),
			"Modniir Ulgoth": generarHorasCiclo('15:30', 180),
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
    const proximosMetas = metasProximos(metas, offsetMinutos)
    const template = document.querySelector('div[data-template]').outerHTML.replace(' data-template', '')
    const htmlLista = proximosMetas.reduce((html, meta) => {
        html += template
        .replace('::nombre::', meta.evento)
        .replace('::hora::', meta.hora)
        .replace('::expansion::', meta.expansion)
        .replace('::categoria::', meta.categoria)
        .replace('::timeleft::', meta.en)
        .replace('::style::', `background-color:${meta.color}`)
        return html;
    }, '')
    document.querySelector('.lista-que-hacer').innerHTML = htmlLista
}