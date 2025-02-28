
import { Clausula } from "@/types/contrato";

export const clausulasDisponibles: Clausula[] = [
  {
    id: "exposicion-motivos",
    titulo: "Exposición de Motivos",
    tipo: "preambulo",
    contenido: "CONSIDERANDO: Que [NOMBRE EMPRESA] necesita [DESCRIPCIÓN DE LA NECESIDAD].\n\nCONSIDERANDO: Que [NOMBRE CONTRATISTA] cuenta con la experiencia y capacidad para [DESCRIPCIÓN DE LA CAPACIDAD].\n\nEn virtud de lo anterior, las partes han convenido celebrar el presente contrato que se regirá por las siguientes cláusulas:",
    editable: true,
    requerido: false
  },
  {
    id: "definiciones",
    titulo: "Definiciones",
    tipo: "definiciones",
    contenido: "Para efectos del presente contrato, los siguientes términos tendrán el significado que a continuación se señala:\n\na) SERVICIOS: Se refiere a [DEFINICIÓN DE SERVICIOS].\nb) PRODUCTOS: Se refiere a [DEFINICIÓN DE PRODUCTOS].\nc) INFORMACIÓN CONFIDENCIAL: Se refiere a [DEFINICIÓN DE INFORMACIÓN CONFIDENCIAL].",
    editable: true,
    requerido: false
  },
  {
    id: "precio-pago",
    titulo: "Precio y Forma de Pago",
    tipo: "precio",
    contenido: "[NOMBRE EMPRESA] pagará a [NOMBRE CONTRATISTA] por la prestación de los servicios objeto del presente contrato la suma de [VALOR EN NÚMEROS Y LETRAS], los cuales serán pagados de la siguiente manera: [FORMA DE PAGO].\n\nPARÁGRAFO: Los pagos se realizarán previa presentación de la factura correspondiente y certificación de cumplimiento expedida por el supervisor del contrato.",
    editable: true,
    requerido: false
  },
  {
    id: "plazo",
    titulo: "Plazo o Duración",
    tipo: "plazo",
    contenido: "El plazo de ejecución del presente contrato será de [TIEMPO EN DÍAS/MESES/AÑOS] contados a partir de [FECHA DE INICIO/FIRMA DEL CONTRATO/ACTA DE INICIO].",
    editable: true,
    requerido: false
  },
  {
    id: "obligaciones-contratante",
    titulo: "Obligaciones del Contratante",
    tipo: "obligaciones",
    contenido: "[NOMBRE EMPRESA] se obliga a:\n\n1. Pagar el valor del contrato en la forma y términos establecidos.\n2. Suministrar la información requerida por [NOMBRE CONTRATISTA] para el cabal cumplimiento de sus obligaciones.\n3. Realizar la supervisión del contrato.\n4. [OTRAS OBLIGACIONES].",
    editable: true,
    requerido: false
  },
  {
    id: "obligaciones-contratista",
    titulo: "Obligaciones del Contratista",
    tipo: "obligaciones",
    contenido: "[NOMBRE CONTRATISTA] se obliga a:\n\n1. Ejecutar el objeto del contrato de acuerdo con las especificaciones técnicas establecidas.\n2. Mantener la confidencialidad de la información a la que tenga acceso.\n3. Cumplir con los plazos establecidos.\n4. [OTRAS OBLIGACIONES].",
    editable: true,
    requerido: false
  },
  {
    id: "garantias",
    titulo: "Garantías",
    tipo: "garantias",
    contenido: "[NOMBRE CONTRATISTA] se obliga a constituir a favor de [NOMBRE EMPRESA] las siguientes garantías:\n\n1. Cumplimiento: Por un valor equivalente al [PORCENTAJE] del valor total del contrato y con una vigencia igual al plazo de ejecución del mismo y [TIEMPO] más.\n2. Calidad del servicio: Por un valor equivalente al [PORCENTAJE] del valor total del contrato y con una vigencia igual al plazo de ejecución del mismo y [TIEMPO] más.\n3. [OTRAS GARANTÍAS].",
    editable: true,
    requerido: false
  },
  {
    id: "incumplimiento",
    titulo: "Cláusulas de Incumplimiento",
    tipo: "incumplimiento",
    contenido: "En caso de incumplimiento de las obligaciones por parte de [NOMBRE CONTRATISTA], [NOMBRE EMPRESA] podrá:\n\n1. Imponer multas sucesivas del [PORCENTAJE] del valor total del contrato por cada día de retraso.\n2. Hacer efectivas las garantías constituidas.\n3. Terminar unilateralmente el contrato.",
    editable: true,
    requerido: false
  },
  {
    id: "terminacion",
    titulo: "Resolución y Terminación",
    tipo: "terminacion",
    contenido: "El presente contrato podrá darse por terminado en los siguientes casos:\n\n1. Por mutuo acuerdo entre las partes.\n2. Por incumplimiento de las obligaciones por alguna de las partes.\n3. Por imposibilidad de cumplir con el objeto del contrato.\n4. Por vencimiento del plazo.",
    editable: true,
    requerido: false
  },
  {
    id: "fuerza-mayor",
    titulo: "Fuerza Mayor",
    tipo: "fuerza-mayor",
    contenido: "Ninguna de las partes será responsable por el incumplimiento de sus obligaciones, cuando dicho incumplimiento se deba a causas de fuerza mayor o caso fortuito. La parte afectada deberá notificar a la otra parte la ocurrencia de tales hechos dentro de los [TIEMPO] días siguientes a su ocurrencia.",
    editable: true,
    requerido: false
  },
  {
    id: "confidencialidad",
    titulo: "Confidencialidad",
    tipo: "confidencialidad",
    contenido: "Las partes se obligan a mantener en reserva y no divulgar a terceros la información que conozcan, reciban o intercambien en virtud de la ejecución del presente contrato. Esta obligación permanecerá vigente por un término de [TIEMPO] años contados a partir de la terminación del contrato.",
    editable: true,
    requerido: false
  },
  {
    id: "cesion",
    titulo: "Cesión",
    tipo: "cesion",
    contenido: "El presente contrato no podrá ser cedido total o parcialmente por [NOMBRE CONTRATISTA] sin la autorización previa, expresa y escrita de [NOMBRE EMPRESA].",
    editable: true,
    requerido: false
  },
  {
    id: "modificaciones",
    titulo: "Modificaciones",
    tipo: "modificaciones",
    contenido: "Cualquier modificación al presente contrato deberá constar por escrito y estar firmada por las partes.",
    editable: true,
    requerido: false
  },
  {
    id: "notificaciones",
    titulo: "Notificaciones",
    tipo: "notificaciones",
    contenido: "Todas las notificaciones relacionadas con la ejecución del presente contrato se enviarán a las siguientes direcciones:\n\n[NOMBRE EMPRESA]: [DIRECCIÓN, TELÉFONO, EMAIL]\n[NOMBRE CONTRATISTA]: [DIRECCIÓN, TELÉFONO, EMAIL]",
    editable: true,
    requerido: false
  },
  {
    id: "ley-aplicable",
    titulo: "Ley Aplicable",
    tipo: "ley-aplicable",
    contenido: "El presente contrato se regirá por las leyes de [PAÍS/JURISDICCIÓN].",
    editable: true,
    requerido: false
  },
  {
    id: "resolucion-controversias",
    titulo: "Resolución de Controversias",
    tipo: "controversias",
    contenido: "Cualquier controversia que surja con ocasión del presente contrato será resuelta en primera instancia mediante arreglo directo entre las partes. En caso de no llegar a un acuerdo, las partes acudirán a [MECANISMO DE RESOLUCIÓN DE CONFLICTOS (CONCILIACIÓN, ARBITRAJE, ETC.)].",
    editable: true,
    requerido: false
  },
  {
    id: "clausulas-finales",
    titulo: "Cláusulas Finales",
    tipo: "finales",
    contenido: "Las partes manifiestan que el presente contrato constituye el acuerdo completo y sustituye cualquier acuerdo verbal o escrito anterior entre las mismas. En constancia se firma en [CIUDAD], a los [DÍA] días del mes de [MES] de [AÑO], en dos ejemplares del mismo tenor y valor, uno para cada una de las partes.",
    editable: true,
    requerido: false
  }
];
