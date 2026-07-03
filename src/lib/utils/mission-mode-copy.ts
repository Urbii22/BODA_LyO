import type { Mission } from "../types/mission";
import type { SubmissionMode } from "./submission-mode";

const boldMissionCopy: Record<string, { title: string; description: string }> = {
  "Foto con los novios": {
    title: "Paparazzi sin verguenza",
    description: "Sacad una foto con Luis y Oscar como si fueran celebrities y vuestra mesa la prensa mas pesada.",
  },
  "Paparazzi sin verguenza": {
    title: "Paparazzi sin verguenza",
    description: "Sacad una foto con Luis y Oscar como si fueran celebrities y vuestra mesa la prensa mas pesada.",
  },
  "Brindis creativo": {
    title: "Brindis que sube el volumen",
    description: "Foto de brindis dramatica: brazos arriba, cara de discurso historico y cero timidez.",
  },
  "Brindis que sube el volumen": {
    title: "Brindis que sube el volumen",
    description: "Foto de brindis dramatica: brazos arriba, cara de discurso historico y cero timidez.",
  },
  "Alianza entre mesas": {
    title: "Alianza sospechosa",
    description: "Haced una foto pactando con otra mesa: apreton de manos, servilleta firmada o mirada de mafia elegante.",
  },
  "Alianza sospechosa": {
    title: "Alianza sospechosa",
    description: "Haced una foto pactando con otra mesa: apreton de manos, servilleta firmada o mirada de mafia elegante.",
  },
  "Coreografia expres": {
    title: "Coreografia sin dignidad",
    description: "Montad una pose final de baile como si acabarais de ganar Eurovision. La foto debe parecer el ultimo segundo del show.",
  },
  "Coreografia sin dignidad": {
    title: "Coreografia sin dignidad",
    description: "Montad una pose final de baile como si acabarais de ganar Eurovision. La foto debe parecer el ultimo segundo del show.",
  },
  "Portada de pelicula": {
    title: "Telenovela de sobremesa",
    description: "Recread una escena de celos, traicion o herencia millonaria con lo que haya en la mesa.",
  },
  "Telenovela de sobremesa": {
    title: "Telenovela de sobremesa",
    description: "Recread una escena de celos, traicion o herencia millonaria con lo que haya en la mesa.",
  },
  "Consejo matrimonial": {
    title: "Consejo no apto para suegras",
    description: "Conseguid un consejo matrimonial picante pero elegante y fotografiad al sabio que lo diga.",
  },
  "Consejo no apto para suegras": {
    title: "Consejo no apto para suegras",
    description: "Conseguid un consejo matrimonial picante pero elegante y fotografiad al sabio que lo diga.",
  },
  "Guardaespaldas de los novios": {
    title: "Guardaespaldas intensitos",
    description: "Escoltad a Luis u Oscar, o a su copa si estan ocupados, con pose seria y cero contexto.",
  },
  "Guardaespaldas intensitos": {
    title: "Guardaespaldas intensitos",
    description: "Escoltad a Luis u Oscar, o a su copa si estan ocupados, con pose seria y cero contexto.",
  },
  "Mesa legendaria": {
    title: "Mesa en modo diva",
    description: "Foto de grupo como portada de disco: una diva central, secundarios dramaticos y actitud de gira mundial.",
  },
  "Mesa en modo diva": {
    title: "Mesa en modo diva",
    description: "Foto de grupo como portada de disco: una diva central, secundarios dramaticos y actitud de gira mundial.",
  },
  "Generaciones en pista": {
    title: "Dos generaciones, cero verguenza",
    description: "Juntad a alguien joven y alguien veterano en una pose de baile que nadie pueda desver.",
  },
  "Dos generaciones, cero verguenza": {
    title: "Dos generaciones, cero verguenza",
    description: "Juntad a alguien joven y alguien veterano en una pose de baile que nadie pueda desver.",
  },
  "Anecdota secreta": {
    title: "Caceria de secreto",
    description: "Encontrad a alguien con una anecdota de los novios y sacad foto del momento de confesion.",
  },
  "Caceria de secreto": {
    title: "Caceria de secreto",
    description: "Encontrad a alguien con una anecdota de los novios y sacad foto del momento de confesion.",
  },
  "Foto real": {
    title: "Beso de pelicula voluntario",
    description: "Recread un beso o casi-beso de poster romantico. Solo voluntarios y cero presion.",
  },
  "Beso de pelicula voluntario": {
    title: "Beso de pelicula voluntario",
    description: "Recread un beso o casi-beso de poster romantico. Solo voluntarios y cero presion.",
  },
  "Momento epico": {
    title: "Caos elegante",
    description: "Montad la foto mas absurda y glamurosa de la noche sin romper nada ni molestar al personal.",
  },
  "Caos elegante": {
    title: "Caos elegante",
    description: "Montad la foto mas absurda y glamurosa de la noche sin romper nada ni molestar al personal.",
  },
};

export function getMissionModeCopy(mission: Mission, mode: SubmissionMode) {
  if (mode === "normal") {
    return {
      title: mission.title,
      description: mission.description,
    };
  }

  return (
    boldMissionCopy[mission.title] || {
      title: `${mission.title} sin verguenza`,
      description: `${mission.description} Subid la version mas descarada que siga siendo elegante.`,
    }
  );
}
