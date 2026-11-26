/* =====================================================================
   MOMENTUM · CONTENIDO EN ESPAÑOL — GRADOS 6 a 8
   Misma estructura y mismo orden que curriculum6_8.js (se mezcla por índice).
   formulas: { n, m: [significado de cada variable], tip }
   quiz: [pregunta, [opciones], explicación]  (la respuesta correcta viene del inglés)
   ===================================================================== */
export const ES_6_8 = {
  "6-1": {
    title: "Midiendo el mundo",
    sdg: "ODS 9 · Industria, innovación e infraestructura",
    challenge: "¿Cómo podemos garantizar espacios inclusivos en la construcción de la infraestructura de nuestro entorno?",
    bigIdea: "La física empieza con una pregunta y una medición. Si medimos bien, podemos construir rampas, puertas y colegios que funcionen para todos.",
    topics: ["¿Qué es la física?", "Sistemas físicos", "¿Qué es medir?", "Sistema Internacional (SI)", "Sistema inglés", "Magnitudes", "Unidades", "Conversión de unidades"],
    ideas: [
      { t: "¿Qué es la física?", b: "La física estudia la materia, la energía, el movimiento y las fuerzas: todo lo que se mueve, calienta, brilla o suena.", pts: ["Una pelota que rueda 🏀 = movimiento", "Una olla caliente 🍳 = calor", "Una lámpara 💡 = electricidad y luz"] },
      { t: "Medir = comparar", b: "Cuando medimos, comparamos una cantidad con una unidad patrón. Una medida siempre tiene un NÚMERO + una UNIDAD.", pts: ["3,5 m ✅", "3,5 ❌ (¿3,5 qué?)", "Instrumentos: regla, balanza, termómetro, cronómetro"] },
      { t: "Dos grandes sistemas", b: "Colombia y la ciencia usan el Sistema Internacional (SI). Estados Unidos todavía usa el sistema inglés (imperial).", pts: ["SI: metro (m), kilogramo (kg), segundo (s)", "Inglés: pulgada, pie, milla, libra", "1 pulgada = 2,54 cm · 1 milla ≈ 1,6 km"] },
      { t: "Los prefijos son atajos", b: "kilo, centi y mili nos dicen cuántas veces más grande o más pequeña es una unidad.", pts: ["kilo (k) = × 1 000", "centi (c) = ÷ 100", "mili (m) = ÷ 1 000"] },
    ],
    formulas: [
      { n: "Factor de conversión", m: ["una fracción igual a 1"], tip: "Escribe abajo la unidad que quieres ELIMINAR. ¡Las unidades se cancelan como los números!" },
      { n: "Escalera métrica", m: ["cada escalón hacia abajo multiplica por 10"], tip: "“Kilo Hecto Deca Base deci centi mili”: si BAJAS la escalera, multiplicas." },
      { n: "Puentes al sistema inglés", m: ["pulgada", "pie", "libra"], tip: "Una pulgada es más o menos el ancho de tu pulgar 👍." },
    ],
    examples: [
      { q: "Una rampa accesible debe medir 1 200 cm. ¿Cuántos metros son?", steps: ["De cm a m subimos 2 escalones", "Dividimos entre 100", "1 200 ÷ 100 = 12"], a: "12 m" },
      { q: "Una puerta mide 36 pulgadas de ancho. ¿Es más ancha que 90 cm (mínimo para silla de ruedas)?", steps: ["36 in × 2,54 cm/in", "= 91,44 cm", "91,44 > 90"], a: "Sí: 91,4 cm, ¡cabe una silla de ruedas!" },
      { q: "Convierte 2,5 kg a gramos.", steps: ["kilo = × 1 000", "2,5 × 1 000"], a: "2 500 g" },
    ],
    labs: [
      { t: "La escalera de unidades", predict: "¿5 000 mm es más largo o más corto que 50 cm?", steps: ["Elige longitud y escribe 5000 mm", "Cambia la unidad destino a cm y luego a m", "Mira la animación de la escalera"], observe: "Cada escalón cambia el valor ×10 o ÷10.", explain: "Las unidades más pequeñas necesitan números más grandes para describir la misma longitud." },
      { t: "Inspector de puertas inclusivas", predict: "¿Qué puertas del colegio son suficientemente anchas (≥ 90 cm)?", steps: ["Los estudiantes miden 3 puertas en pulgadas o cm", "Convierten todo a cm con el conversor", "Marcan ✅ o ❌ en el tablero"], observe: "Comparen los resultados en una sola unidad.", explain: "Usar UN solo sistema evita errores en la construcción." },
    ],
    tips: ["Escribe siempre número + unidad.", "Bajar la escalera → multiplicar. Subir → dividir.", "Usen la “pulgada del pulgar” y la cuarta de la mano para estimar antes de medir."],
    reading: {
      t: "La rampa que quedó corta",
      text: [
        "El colegio de Lucía quería una rampa nueva para los estudiantes en silla de ruedas. El constructor leyó el plano: “Rampa: 1 200”. Construyó una rampa de 1 200 milímetros. ¡Pero el plano decía 1 200 centímetros!",
        "La rampa medía solo 1,2 metros. Era muy empinada y peligrosa. El colegio tuvo que construirla otra vez y costó mucho dinero.",
        "Los científicos y los ingenieros siempre escriben un número Y una unidad. En 1999 la NASA perdió una nave rumbo a Marte porque un equipo usó unidades inglesas y otro usó unidades métricas.",
        "Hoy la clase de Lucía mide todo dos veces y escribe la unidad cada vez. Su lema es: “¡Sin unidad no hay respuesta!”",
      ],
      gloss: [["unidad", "cantidad patrón que se usa para medir (m, kg, s)"], ["empinada", "con mucha inclinación; difícil de subir"], ["constructor", "persona que construye edificios"], ["nave", "vehículo que viaja por el espacio"]],
      qs: [["¿Cuánto medía en metros la rampa que hizo el constructor?", "1,2 m"], ["¿Por qué la NASA perdió una nave en 1999?", "Dos equipos usaron sistemas de unidades distintos (inglés y métrico)."], ["¿Cuál es el lema de la clase?", "“¡Sin unidad no hay respuesta!”"]],
    },
    quiz: [
      ["¿Cuál de estas es una medida correcta?", ["15", "15 m", "metros", "m 15 de largo"], "Una medida necesita un número y una unidad."],
      ["La unidad de masa del SI es…", ["gramo", "libra", "kilogramo", "newton"], "El kilogramo (kg) es la unidad base de masa."],
      ["¿Qué instrumento mide el tiempo?", ["Termómetro", "Cronómetro", "Regla", "Balanza"], "El cronómetro mide intervalos de tiempo."],
      ["Para pasar de metros a centímetros debes…", ["dividir entre 100", "multiplicar por 100", "sumar 100", "multiplicar por 10"], "1 m = 100 cm, entonces multiplicas."],
      ["La física NO estudia…", ["el movimiento", "la energía", "la luz", "la gramática de un idioma"], "La gramática pertenece a los estudios del lenguaje."],
    ],
  },

  "6-2": {
    title: "Calor, temperatura y materia",
    sdg: "ODS 10 · Reducción de las desigualdades",
    challenge: "¿Qué acciones podemos emprender para ayudar a reducir las desigualdades que viven las comunidades?",
    bigIdea: "La temperatura nos dice qué tan caliente está algo; el calor es energía que viaja de lo caliente a lo frío. Un buen aislamiento puede proteger a las familias de temperaturas extremas.",
    topics: ["Masa", "Volumen", "Densidad", "Peso", "Temperatura", "Escalas de temperatura", "Conversión de temperaturas", "Calor", "Conducción", "Convección", "Radiación"],
    ideas: [
      { t: "Masa, volumen, densidad", b: "La masa es cuánta materia hay. El volumen es cuánto espacio ocupa. La densidad dice qué tan apretada está la materia.", pts: ["El hierro es más denso que la madera", "El aceite flota en el agua: es menos denso", "ρ = m / V"] },
      { t: "Masa ≠ Peso", b: "La masa es la misma en todas partes. El peso es la fuerza de la gravedad sobre esa masa.", pts: ["En la Luna pesas menos…", "…pero tu masa no cambia", "W = m · g"] },
      { t: "Temperatura vs calor", b: "La temperatura mide qué tan rápido se mueven las partículas. El calor es energía que pasa de un cuerpo caliente a uno frío.", pts: ["El chocolate caliente se enfría ☕", "El hielo se derrite en tu mano", "El calor siempre va de caliente → frío"] },
      { t: "Tres formas de viajar del calor", b: "Conducción (por contacto), convección (fluidos en movimiento) y radiación (ondas, incluso en el espacio).", pts: ["🍳 El mango de la olla se calienta = conducción", "🫕 El agua hirviendo circula = convección", "☀️ El Sol te calienta la cara = radiación"] },
    ],
    formulas: [
      { n: "Densidad", m: ["densidad", "masa", "volumen"], tip: "Dibuja el “triángulo mágico”: m arriba, ρ y V abajo. ¡Tapa lo que quieres hallar!" },
      { n: "Peso", m: ["peso", "masa", "gravedad, 9,8 en la Tierra"], tip: "Usa g ≈ 10 m/s² para cálculo mental rápido." },
      { n: "Celsius → Fahrenheit", m: ["Celsius", "Fahrenheit"], tip: "Truco rápido: duplica y suma 30 (da un estimado)." },
      { n: "Celsius → Kelvin", m: ["kelvin (¡sin el signo °!)"], tip: "El kelvin nunca baja de cero: 0 K es el cero absoluto." },
    ],
    examples: [
      { q: "Una piedra tiene 60 g de masa y 20 cm³ de volumen. ¿Cuál es su densidad?", steps: ["ρ = m / V", "ρ = 60 / 20"], a: "3 g/cm³: se hunde en el agua (1 g/cm³)" },
      { q: "Una niña tiene 40 kg de masa. ¿Cuál es su peso en la Tierra (g = 10)?", steps: ["W = m · g", "W = 40 × 10"], a: "400 N" },
      { q: "En Miami hace 86 °F. ¿Cuánto es en °C?", steps: ["°C = (°F − 32) × 5/9", "(86 − 32) = 54", "54 × 5/9 = 30"], a: "30 °C" },
    ],
    labs: [
      { t: "¿Flota o se hunde?", predict: "¿Un bloque de 1,2 g/cm³ flotará en agua salada (1,03 g/cm³)?", steps: ["Elige la densidad del objeto", "Cambia el líquido", "Observa el bloque y el empuje"], observe: "Si el objeto es más denso que el líquido, se hunde.", explain: "Flotar depende de la densidad, no solo del peso." },
      { t: "Carrera del calor", predict: "¿Qué forma de transferencia mueve el calor a través del espacio vacío?", steps: ["Cambia entre conducción, convección y radiación", "Sube la potencia", "Describe las partículas"], observe: "Solo la radiación funciona en el vacío.", explain: "Así llega a la Tierra la energía del Sol." },
    ],
    tips: ["Masa en kg y peso en newtons: ¡nunca los mezcles!", "De °F a °C: primero resta 32 y LUEGO multiplica por 5/9.", "El metal se siente más frío que la madera a la misma temperatura porque conduce el calor más rápido."],
    reading: {
      t: "Casas que pelean contra el calor",
      text: [
        "En algunos pueblos de La Guajira la temperatura puede llegar a 40 °C. Muchas familias viven en casas con techo de metal. El metal es un buen conductor, así que el calor del Sol entra muy rápido.",
        "Un grupo de estudiantes tuvo una idea. Cubrieron un techo de metal con cartón reciclado y botellas plásticas. Estos materiales son aislantes: hacen más lenta la transferencia de calor.",
        "Midieron la temperatura dentro de dos casas. La casa con el techo viejo estaba a 38 °C. La casa con el techo nuevo estaba a 31 °C. ¡Siete grados es una gran diferencia!",
        "La física puede ayudar a reducir la desigualdad. No todas las familias pueden comprar aire acondicionado, pero todos pueden usar la ciencia para vivir mejor.",
      ],
      gloss: [["conductor", "material que deja pasar fácilmente el calor o la electricidad"], ["aislante", "material que frena el calor o la electricidad"], ["techo", "la cubierta superior de una casa"], ["reciclado", "usado de nuevo después de ser desecho"]],
      qs: [["¿Por qué los techos de metal calientan las casas?", "El metal es buen conductor, entonces el calor entra rápido."], ["¿Qué materiales usaron los estudiantes?", "Cartón reciclado y botellas plásticas (aislantes)."], ["¿Cuál fue la diferencia de temperatura?", "7 °C (38 °C vs 31 °C)."]],
    },
    quiz: [
      ["El calor siempre fluye…", ["de lo frío a lo caliente", "de lo caliente a lo frío", "solo hacia arriba", "solo en metales"], "El calor pasa espontáneamente de mayor a menor temperatura."],
      ["El Sol calienta la Tierra por…", ["conducción", "convección", "radiación", "fricción"], "La radiación viaja por el espacio vacío."],
      ["¿Qué propiedad cambia en la Luna?", ["masa", "volumen", "peso", "densidad"], "Cambia la gravedad, entonces cambia el peso."],
      ["El agua hierve a 100 °C. En kelvin es…", ["100 K", "173 K", "373 K", "212 K"], "K = °C + 273."],
      ["El aceite flota en el agua porque el aceite es…", ["más pesado", "menos denso", "más caliente", "más viscoso"], "Los líquidos menos densos flotan sobre los más densos."],
    ],
  },

  "6-3": {
    title: "Movimiento y leyes de Newton",
    sdg: "ODS 14 · Vida submarina",
    challenge: "¿Cómo podemos ajustar nuestras prácticas cotidianas para reducir la contaminación marina y la acidificación de los océanos?",
    bigIdea: "Las cosas se mueven porque actúan fuerzas sobre ellas. Las tres leyes de Newton explican patinetas, cohetes e incluso las corrientes que llevan el plástico por todo el océano.",
    topics: ["Mecánica", "Trayectoria", "Desplazamiento", "Rapidez y velocidad", "Movimiento rectilíneo", "Velocidad constante", "Dinámica", "Leyes de Newton", "Fuerza", "Gravedad"],
    ideas: [
      { t: "Trayectoria vs desplazamiento", b: "La trayectoria es el camino. El desplazamiento es la flecha recta desde el inicio hasta el final.", pts: ["Una vuelta a la pista: trayectoria larga…", "…¡pero desplazamiento = 0!", "El desplazamiento tiene dirección"] },
      { t: "Rapidez y velocidad", b: "Rapidez = qué tan rápido. Velocidad = qué tan rápido Y en qué dirección.", pts: ["Rapidez: 20 km/h", "Velocidad: 20 km/h hacia el norte", "Velocidad constante = misma distancia cada segundo"] },
      { t: "Las 3 leyes de Newton", b: "1. Inercia: los objetos siguen haciendo lo que hacían. 2. F = m·a. 3. Toda acción tiene una reacción igual y opuesta.", pts: ["🚌 Te vas hacia adelante cuando el bus frena", "🛒 El carrito vacío acelera más", "🚀 El cohete empuja el gas hacia abajo y el gas empuja el cohete hacia arriba"] },
      { t: "Gravedad", b: "La gravedad es la fuerza que atrae las masas entre sí. En la Tierra jala todo hacia abajo a unos 9,8 m/s².", pts: ["Mantiene a la Luna en órbita", "Produce las mareas 🌊", "Peso = fuerza de gravedad"] },
    ],
    formulas: [
      { n: "Rapidez", m: ["rapidez", "distancia", "tiempo"], tip: "Triángulo: d arriba, v y t abajo. Tapa la que buscas." },
      { n: "Segunda ley de Newton", m: ["fuerza", "masa", "aceleración"], tip: "Más fuerza → más aceleración. Más masa → menos aceleración." },
      { n: "km/h → m/s", m: ["1 000 m ÷ 3 600 s"], tip: "36 km/h = 10 m/s. ¡Recuerda esta pareja!" },
    ],
    examples: [
      { q: "Una tortuga nada 30 m en 15 s. ¿Cuál es su rapidez?", steps: ["v = d / t", "v = 30 / 15"], a: "2 m/s" },
      { q: "Empujas una caja de 20 kg con 60 N (sin fricción). ¿Cuál es su aceleración?", steps: ["a = F / m", "a = 60 / 20"], a: "3 m/s²" },
      { q: "Un bote viaja a 72 km/h. Conviértelo a m/s.", steps: ["72 ÷ 3,6"], a: "20 m/s" },
    ],
    labs: [
      { t: "La gran carrera", predict: "Si el carro A va a 5 m/s y el B a 8 m/s, ¿quién llega primero a 40 m?", steps: ["Ajusta las dos velocidades", "Dale play", "Lee la gráfica distancia–tiempo"], observe: "Una recta más inclinada significa un carro más rápido.", explain: "La pendiente de la gráfica d–t = rapidez." },
      { t: "Empuja la caja", predict: "¿Qué le pasa a la aceleración si duplicamos la masa?", steps: ["Aplica 50 N a 10 kg", "Cambia a 20 kg", "Compara las aceleraciones"], observe: "La aceleración se reduce a la mitad.", explain: "a = F/m: la masa se resiste a los cambios de movimiento (inercia)." },
    ],
    tips: ["Una recta en la gráfica d–t = velocidad constante.", "Primero las unidades: km/h ↔ m/s antes de calcular.", "Representen la tercera ley con dos estudiantes en sillas empujándose."],
    reading: {
      t: "El viaje de una botella de plástico",
      text: [
        "Una botella de plástico cae a un río en Bogotá. El agua la empuja con una fuerza y la botella empieza a moverse. Es la segunda ley de Newton: una fuerza hace que la botella acelere.",
        "El río lleva la botella hasta el mar. Las corrientes oceánicas se mueven a cerca de 1 metro por segundo. ¡En un día la botella puede viajar 86 kilómetros!",
        "Sin fuerzas, la botella seguiría moviéndose en línea recta. Eso es la inercia, la primera ley de Newton. Pero el viento, las olas y las corrientes cambian su dirección todo el tiempo. Su trayectoria es larga y curva.",
        "Muchas botellas terminan en la Gran Mancha de Basura del Pacífico, una zona enorme de plástico flotante. Peces y tortugas se comen ese plástico. Entender el movimiento ayuda a los científicos a predecir a dónde va el plástico y cómo limpiarlo.",
      ],
      gloss: [["corriente", "agua que se mueve en una dirección"], ["inercia", "tendencia a mantener el mismo movimiento"], ["trayectoria", "camino que sigue un objeto"], ["mancha", "área pequeña que es diferente"]],
      qs: [["¿Qué ley explica por qué la botella empieza a moverse?", "La segunda ley de Newton (F = m·a)."], ["¿Cuánto puede viajar una botella en un día?", "Unos 86 km."], ["¿Qué es la Gran Mancha de Basura del Pacífico?", "Una zona enorme de plástico flotando en el océano."]],
    },
    quiz: [
      ["Una corredora da una vuelta completa a una pista de 400 m. Su desplazamiento es…", ["400 m", "200 m", "0 m", "800 m"], "Termina donde empezó."],
      ["Cuando un bus frena de golpe, los pasajeros se van hacia adelante por…", ["la gravedad", "la inercia", "la fricción", "la presión del aire"], "Primera ley de Newton."],
      ["Un cohete sube porque…", ["empuja el aire", "el gas empuja el cohete hacia arriba mientras el cohete empuja el gas hacia abajo", "se apaga la gravedad", "es liviano"], "Pares acción–reacción (3.ª ley)."],
      ["La unidad de fuerza es el…", ["kilogramo", "julio", "newton", "vatio"], "1 N = 1 kg·m/s²."],
      ["La velocidad es diferente de la rapidez porque incluye…", ["el tiempo", "la dirección", "la masa", "la temperatura"], "La velocidad es un vector."],
    ],
  },

  "6-4": {
    title: "El mundo eléctrico",
    sdg: "ODS 15 · Vida de ecosistemas terrestres",
    challenge: "¿De qué manera podemos contribuir a la restauración de los ecosistemas que se encuentran en peligro?",
    bigIdea: "Las cargas eléctricas se atraen y se repelen. Desde los peces eléctricos hasta los rayos, la electricidad está en todas partes, y la electricidad limpia puede proteger los ecosistemas.",
    topics: ["Peces eléctricos", "Historia de la electricidad", "Carga eléctrica", "Fuerzas entre cargas", "Ley de Coulomb", "Conservación de la carga", "Conductores y aislantes", "Carga por frotamiento, contacto e inducción", "Campo eléctrico", "Potencial eléctrico", "Condensadores"],
    ideas: [
      { t: "Peces eléctricos ⚡🐟", b: "¡La anguila eléctrica del Amazonas puede producir 600 voltios! Los científicos estudiaron estos peces para entender la electricidad.", pts: ["Alessandro Volta copió sus órganos", "Construyó la primera pila (1800)", "La naturaleza inspiró la tecnología"] },
      { t: "Cargas: + y −", b: "La materia tiene protones (+) y electrones (−). Cargas iguales se repelen y cargas opuestas se atraen.", pts: ["+ y + → se alejan", "− y − → se alejan", "+ y − → se atraen"] },
      { t: "Tres formas de cargar", b: "Frotamiento (frotar), contacto (tocar) e inducción (solo acercar).", pts: ["🎈 Globo en el pelo = frotamiento", "Tocar una esfera cargada = contacto", "Acercar una barra cargada = inducción"] },
      { t: "Conductores y aislantes", b: "Los conductores dejan moverse los electrones (metales, agua salada). Los aislantes los detienen (plástico, caucho, madera).", pts: ["Cables: cobre adentro, plástico afuera", "Semiconductores: silicio en los celulares 📱", "Nunca toques la electricidad con las manos mojadas"] },
    ],
    formulas: [
      { n: "Ley de Coulomb", m: ["fuerza eléctrica", "9 × 10⁹", "cargas", "distancia"], tip: "Si duplicas la distancia, la fuerza se hace 4 veces más pequeña (¡r²!)." },
      { n: "Cuantización de la carga", m: ["número de electrones", "carga elemental"], tip: "La carga viene en “paquetes” diminutos: no puedes tener medio electrón." },
    ],
    examples: [
      { q: "Dos cargas se atraen con 36 N. Si la distancia se duplica, ¿cuál es la nueva fuerza?", steps: ["F ∝ 1/r²", "Distancia ×2 → fuerza ÷ 4", "36 ÷ 4"], a: "9 N" },
      { q: "Un globo frotado en el pelo queda negativo. ¿Ganó o perdió electrones?", steps: ["Negativo = electrones de más"], a: "Ganó electrones del pelo." },
    ],
    labs: [
      { t: "Parque de cargas", predict: "¿Qué pasa con la fuerza cuando las cargas se acercan?", steps: ["Arrastra las dos cargas", "Cambia los signos + / −", "Lee el valor de la fuerza"], observe: "Más cerca = fuerza mucho mayor.", explain: "La ley de Coulomb depende de 1/r²." },
      { t: "Enciende el bombillo", predict: "¿Una regla de plástico cierra el circuito?", steps: ["Arma un circuito sencillo", "Aumenta el voltaje", "Mira cómo fluyen los electrones"], observe: "Más voltaje = bombillo más brillante.", explain: "La corriente solo pasa por los conductores." },
    ],
    tips: ["Los opuestos se atraen, como en los imanes, pero con cargas.", "En la ley de Coulomb la distancia va AL CUADRADO.", "Hagan la demostración del globo y papelitos para la inducción."],
    reading: {
      t: "El pez que inventó la pila",
      text: [
        "En los ríos del Amazonas vive un animal increíble: la anguila eléctrica. En realidad no es una anguila: es un pez. Puede producir una descarga de 600 voltios para cazar y defenderse.",
        "La anguila tiene miles de células especiales llamadas electrocitos. Cada célula produce un pequeño voltaje. Juntas funcionan como muchas pilas en fila.",
        "En 1800 el científico italiano Alessandro Volta estudió estos peces. Puso discos de zinc y de cobre uno encima del otro, con papel salado entre ellos. ¡Fue la primera pila de la historia!",
        "Hoy la selva amazónica está en peligro. Cuando protegemos los ecosistemas, también protegemos a los animales que nos enseñan ciencia.",
      ],
      gloss: [["descarga", "paso repentino de electricidad por el cuerpo"], ["célula", "la unidad más pequeña de un ser vivo"], ["voltaje", "el “empujón” eléctrico que mueve las cargas"], ["selva", "bosque con mucha lluvia y biodiversidad"]],
      qs: [["¿Cuántos voltios puede producir una anguila eléctrica?", "Unos 600 voltios."], ["¿Qué son los electrocitos?", "Células especiales que producen pequeños voltajes."], ["¿Qué inventó Volta?", "La primera pila (1800)."]],
    },
    quiz: [
      ["Dos cargas negativas…", ["se atraen", "se repelen", "no hacen nada", "se vuelven positivas"], "Cargas iguales se repelen."],
      ["¿Cuál es un buen conductor?", ["Caucho", "Cobre", "Vidrio", "Madera seca"], "Los metales conducen la electricidad."],
      ["Frotar un globo en el pelo lo carga por…", ["inducción", "contacto", "frotamiento", "radiación"], "Los electrones pasan del pelo al globo."],
      ["Si la distancia entre dos cargas se reduce a la mitad, la fuerza…", ["se reduce a la mitad", "se duplica", "es 4 veces mayor", "queda igual"], "F ∝ 1/r²: (1/2)² → ×4."],
      ["Un dispositivo que almacena energía eléctrica es un…", ["resistor", "condensador", "interruptor", "fusible"], "Los condensadores almacenan carga y energía."],
    ],
  },

  "7-1": {
    title: "Partículas en movimiento",
    sdg: "ODS 11 · Ciudades y comunidades sostenibles",
    challenge: "¿Cómo podemos involucrar a nuestra comunidad en procesos de reutilización de materiales?",
    bigIdea: "Todo está hecho de partículas diminutas que nunca dejan de moverse. La temperatura es su rapidez, y entenderlo nos ayuda a fundir, moldear y reutilizar materiales.",
    topics: ["Teoría cinético-molecular", "Estados de la materia", "Cambios de estado", "Temperatura", "Escalas de temperatura", "Conversión de temperaturas", "Calor", "Conducción, convección, radiación", "Energía", "Notación científica"],
    ideas: [
      { t: "Teoría cinético-molecular", b: "La materia está hecha de partículas que siempre se mueven. Más energía = partículas más rápidas.", pts: ["Sólido: las partículas vibran en su lugar", "Líquido: las partículas se deslizan", "Gas: las partículas vuelan libres"] },
      { t: "Cambios de estado", b: "Agregar o quitar calor cambia el estado de la materia.", pts: ["Fusión: sólido → líquido", "Evaporación/ebullición: líquido → gas", "Condensación, solidificación, sublimación"] },
      { t: "Tres termómetros", b: "Celsius para la vida diaria, Fahrenheit en Estados Unidos y Kelvin para la ciencia.", pts: ["El agua se congela: 0 °C = 32 °F = 273 K", "El agua hierve: 100 °C = 212 °F = 373 K", "0 K = cero absoluto: las partículas casi se detienen"] },
      { t: "Notación científica", b: "La física usa números enormes y diminutos. Los escribimos como a × 10ⁿ.", pts: ["300 000 000 m/s = 3 × 10⁸ m/s", "0,000 001 m = 1 × 10⁻⁶ m", "n positivo = grande, n negativo = pequeño"] },
    ],
    formulas: [
      { n: "Kelvin", m: ["kelvin"], tip: "Kelvin = Celsius corrido 273 escalones hacia arriba." },
      { n: "Fahrenheit", m: ["9/5"], tip: "Punto de congelación 32 °F: piensa en “32 dientes castañeteando del frío” 🥶." },
      { n: "Notación científica", m: ["coeficiente", "exponente"], tip: "Cuenta cuántos lugares salta la coma: a la izquierda = +, a la derecha = −." },
    ],
    examples: [
      { q: "El nitrógeno líquido hierve a 77 K. ¿Cuánto es en °C?", steps: ["°C = K − 273", "77 − 273"], a: "−196 °C" },
      { q: "Escribe 45 000 000 en notación científica.", steps: ["Mueve la coma 7 lugares a la izquierda", "4,5 × 10⁷"], a: "4,5 × 10⁷" },
      { q: "Convierte 25 °C a °F.", steps: ["1,8 × 25 = 45", "45 + 32"], a: "77 °F" },
    ],
    labs: [
      { t: "Caja de partículas", predict: "¿Qué pasa con las partículas a 0 °C y a 100 °C?", steps: ["Empieza en −20 °C", "Sube la temperatura despacio", "Observa la fusión y la ebullición"], observe: "Las partículas se mueven más rápido y se separan.", explain: "Temperatura = energía cinética promedio de las partículas." },
      { t: "Termómetro de tres escalas", predict: "¿Existe una temperatura donde °C = °F?", steps: ["Baja el termómetro", "Compara °C y °F"], observe: "¡En −40 ambas son iguales!", explain: "−40 × 1,8 + 32 = −40." },
    ],
    tips: ["0 K es la temperatura más fría posible.", "Fundan tapas plásticas en una demostración (con cuidado) para mostrar que reciclar = cambio de estado.", "−40 °C = −40 °F: ¡dato curioso para la clase!"],
    reading: {
      t: "Tapas plásticas, baile de partículas",
      text: [
        "Cada semana, un colegio de Medellín recoge miles de tapas de botellas plásticas. Los estudiantes las llevan a una pequeña fábrica que las funde y fabrica objetos nuevos: sillas, mesas y hasta ladrillos.",
        "¿Por qué el plástico se puede fundir y moldear otra vez? La respuesta son las partículas. En una tapa sólida las partículas vibran pero se quedan en su lugar. Cuando la máquina calienta el plástico a unos 200 °C, las partículas se mueven cada vez más rápido y empiezan a deslizarse. El sólido se vuelve líquido.",
        "Luego el plástico líquido entra en un molde. Se enfría, las partículas se frenan y se vuelve sólido otra vez, con una forma nueva.",
        "Esta es la teoría cinético-molecular en acción. Una simple tapa puede tener una segunda vida gracias a la física y a una comunidad que decide recogerla.",
      ],
      gloss: [["molde", "recipiente que le da forma a un líquido"], ["vibrar", "moverse rápido hacia adelante y atrás"], ["deslizarse", "moverse suavemente sobre una superficie"], ["ladrillo", "bloque que se usa para construir paredes"]],
      qs: [["¿Qué recogen los estudiantes?", "Tapas de botellas plásticas."], ["¿Qué les pasa a las partículas cuando se calienta el plástico?", "Se mueven más rápido y empiezan a deslizarse (se funde)."], ["¿Qué objetos se pueden hacer con tapas recicladas?", "Sillas, mesas y ladrillos."]],
    },
    quiz: [
      ["En un sólido, las partículas…", ["se mueven libres", "vibran en posiciones fijas", "no se mueven", "se deslizan unas sobre otras"], "Los sólidos mantienen su forma porque las partículas se quedan en su lugar."],
      ["De líquido a gas se llama…", ["condensación", "fusión", "evaporación", "sublimación"], "Evaporación (o ebullición)."],
      ["El cero absoluto es…", ["0 °C", "−100 °C", "0 K", "32 °F"], "0 K ≈ −273 °C."],
      ["0,0005 en notación científica es…", ["5 × 10⁴", "5 × 10⁻⁴", "0,5 × 10⁻³", "5 × 10⁻³"], "La coma salta 4 lugares a la derecha → 10⁻⁴."],
      ["La temperatura mide de las partículas su…", ["tamaño", "color", "energía cinética promedio", "número"], "Más caliente = partículas más rápidas."],
    ],
  },

  "7-2": {
    title: "Energía para la vida",
    sdg: "ODS 3 · Salud y bienestar",
    challenge: "¿Cuál es la importancia de fomentar hábitos saludables?",
    bigIdea: "La energía no se crea ni se destruye, solo se transforma. Tu cuerpo, una montaña rusa y un panel solar siguen la misma regla.",
    topics: ["Energía para la paz", "Tipos de energía", "Propiedades de la energía", "Fuentes renovables y no renovables", "Combustibles fósiles", "Energía cinética", "Energía potencial gravitacional", "Conservación de la energía", "Energía mecánica", "Fuerza", "Trabajo", "Fuerzas conservativas y no conservativas"],
    ideas: [
      { t: "La energía está en todas partes", b: "La energía es la capacidad de producir cambios. Tiene muchas formas.", pts: ["Cinética: movimiento 🏃", "Potencial: posición (altura) 🧗", "Térmica, química 🍎, eléctrica, luminosa, sonora"] },
      { t: "Fuentes de energía", b: "Las fuentes renovables se regeneran naturalmente. Las no renovables se agotan.", pts: ["Renovables: sol, viento, agua, biomasa", "No renovables: petróleo, carbón, gas", "Los combustibles fósiles producen CO₂"] },
      { t: "Conservación de la energía", b: "La energía nunca se pierde: cambia de forma. La energía total se mantiene.", pts: ["Arriba: máxima potencial", "Abajo: máxima cinética", "La fricción convierte parte en calor"] },
      { t: "Trabajo", b: "Haces trabajo cuando una fuerza mueve un objeto. Sin movimiento no hay trabajo (¡en física!).", pts: ["Levantar la maleta = trabajo ✅", "Sostenerla quieta = sin trabajo ❌", "W = F · d"] },
    ],
    formulas: [
      { n: "Energía cinética", m: ["energía cinética", "masa", "rapidez"], tip: "La rapidez va AL CUADRADO: doble rapidez = 4 × energía. ¡Por eso es peligroso el exceso de velocidad!" },
      { n: "Energía potencial", m: ["energía potencial gravitacional", "altura"], tip: "Piensa en “m-g-h”: masa, gravedad, altura." },
      { n: "Trabajo", m: ["trabajo", "fuerza", "distancia"], tip: "1 julio = levantar una manzana 1 metro 🍎." },
      { n: "Energía mecánica", m: ["energía mecánica"], tip: "¿Sin fricción? La suma nunca cambia." },
    ],
    examples: [
      { q: "Una estudiante de 50 kg corre a 4 m/s. ¿Cuál es su energía cinética?", steps: ["Ek = ½ m v²", "½ × 50 × 16"], a: "400 J" },
      { q: "Un libro de 2 kg está en un estante de 1,5 m (g = 10). ¿Energía potencial?", steps: ["Ep = m g h", "2 × 10 × 1,5"], a: "30 J" },
      { q: "Empujas un carrito con 40 N durante 5 m. ¿Cuánto trabajo haces?", steps: ["W = F · d", "40 × 5"], a: "200 J" },
    ],
    labs: [
      { t: "Parque de patinaje de energía", predict: "¿Dónde va más rápido el patinador?", steps: ["Suelta al patinador desde arriba", "Mira las barras de energía", "Activa la fricción"], observe: "Sin fricción, Ek + Ep es constante.", explain: "Con fricción, una parte se vuelve energía térmica." },
      { t: "Trabajo y fuerza", predict: "¿Más fuerza en la misma distancia = ?", steps: ["Aplica una fuerza", "Lee el trabajo = F × d"], observe: "El trabajo crece con la fuerza y la distancia.", explain: "W = F · d." },
    ],
    tips: ["Prueba del salto: los estudiantes saltan y sienten Ep → Ek → Ep.", "¡Un banano tiene unos 400 000 J de energía química!", "Revisa unidades: kg, m/s, m → resultado en julios."],
    reading: {
      t: "Tu cuerpo es una máquina de energía",
      text: [
        "Cada mañana desayunas. La comida tiene energía química. Tu cuerpo la transforma en energía cinética cuando caminas, en energía térmica para mantenerte a 37 °C y hasta en energía eléctrica en tus nervios.",
        "Cuando subes escaleras, ganas energía potencial gravitacional. Una estudiante de 50 kg que sube 3 metros gana 1 500 julios. ¡Es como la energía de un pedacito de chocolate!",
        "Tu cuerpo no es 100 % eficiente. Cerca del 75 % de la energía se convierte en calor. Por eso sientes calor cuando haces ejercicio.",
        "Los hábitos saludables significan equilibrio: la energía que comes debería ser parecida a la energía que usas. La física nos muestra que la energía nunca se pierde: solo cambia de forma.",
      ],
      gloss: [["transformar", "cambiar de una forma a otra"], ["eficiente", "que usa bien la energía, con poco desperdicio"], ["nervios", "fibras que llevan señales en el cuerpo"], ["equilibrio", "estado en el que dos cosas son iguales"]],
      qs: [["¿Qué tipo de energía hay en la comida?", "Energía química."], ["¿Cuánta energía gana una estudiante de 50 kg al subir 3 m?", "1 500 J."], ["¿Por qué sientes calor cuando haces ejercicio?", "Cerca del 75 % de la energía se convierte en calor."]],
    },
    quiz: [
      ["Una pelota en la cima de una colina tiene principalmente…", ["energía cinética", "energía potencial", "energía sonora", "ninguna energía"], "La altura le da energía potencial gravitacional."],
      ["¿Cuál fuente es renovable?", ["Carbón", "Petróleo", "Viento", "Gas natural"], "El viento se regenera naturalmente."],
      ["Si la rapidez se duplica, la energía cinética…", ["se duplica", "se triplica", "es 4 veces mayor", "queda igual"], "Ek ∝ v²."],
      ["La unidad de energía es el…", ["vatio", "newton", "julio", "voltio"], "La energía y el trabajo se miden en julios."],
      ["Al sostener una caja pesada sin moverla, el trabajo realizado es…", ["positivo", "negativo", "cero", "infinito"], "Sin desplazamiento no hay trabajo."],
    ],
  },

  "7-3": {
    title: "Calor y sonido",
    sdg: "ODS 13 · Acción por el clima",
    challenge: "¿Qué acciones debemos implementar frente al clima para garantizar un futuro sostenible?",
    bigIdea: "El calor y el sonido son energía en movimiento. Uno calienta el planeta; el otro viaja como ondas por el aire, el agua y los sólidos.",
    topics: ["Teorema trabajo–energía", "Aplicaciones de la conservación de la energía", "Calor", "Cambio de temperatura", "Calor específico", "Equilibrio térmico", "Puntos de fusión y ebullición", "Transferencia de calor", "Propagación del sonido", "Energía de las ondas sonoras", "Tono", "Intensidad", "Timbre"],
    ideas: [
      { t: "Calor específico", b: "Algunos materiales necesitan más energía para calentarse. El agua tiene un calor específico muy alto.", pts: ["La arena de la playa se calienta rápido 🏖️", "El mar se mantiene fresco", "Los océanos regulan el clima"] },
      { t: "Equilibrio térmico", b: "Dos cuerpos en contacto intercambian calor hasta llegar a la misma temperatura.", pts: ["Leche fría + café caliente = café tibio ☕", "El caliente da, el frío recibe", "La temperatura final queda en medio"] },
      { t: "El sonido es una onda", b: "El sonido es una vibración que viaja por un medio. Sin medio no hay sonido.", pts: ["Aire: 343 m/s", "Agua: ~1 500 m/s", "Espacio: silencio 🌌"] },
      { t: "Tono, intensidad, timbre", b: "Tono = agudo o grave (frecuencia). Intensidad = fuerte o suave (amplitud). Timbre = la “voz” de cada instrumento.", pts: ["🎻 Violín: tono agudo", "🥁 Tambor: tono grave", "Misma nota en piano y guitarra = distinto timbre"] },
    ],
    formulas: [
      { n: "Calor", m: ["calor", "masa", "calor específico", "cambio de temperatura"], tip: "“Q = m-c-ΔT”: masa, calor específico y cambio de temperatura." },
      { n: "Rapidez del sonido", m: ["rapidez del sonido"], tip: "Truenos: cuenta los segundos después del relámpago y divide entre 3 → distancia en km ⛈️." },
      { n: "Distancia del eco", m: ["tiempo de ida y vuelta"], tip: "Divide entre 2: el sonido va Y vuelve." },
    ],
    examples: [
      { q: "¿Cuánto calor se necesita para subir 10 °C la temperatura de 2 kg de agua? (c = 4 186 J/kg°C)", steps: ["Q = m c ΔT", "2 × 4 186 × 10"], a: "83 720 J" },
      { q: "Oyes un trueno 6 s después del relámpago. ¿A qué distancia está la tormenta?", steps: ["d = v t", "343 × 6"], a: "≈ 2 058 m ≈ 2 km" },
      { q: "Un eco regresa después de 2 s. ¿A qué distancia está la pared?", steps: ["d = v t / 2", "343 × 2 / 2"], a: "343 m" },
    ],
    labs: [
      { t: "Estudio de sonido", predict: "¿Qué cambia cuando aumentamos la frecuencia?", steps: ["Enciende el parlante 🔈 (¡volumen bajo!)", "Mueve el control de frecuencia", "Cambia la forma de onda"], observe: "Mayor frecuencia = tono más agudo, ondas más cortas.", explain: "El tono depende de la frecuencia; el timbre, de la forma de la onda." },
      { t: "Laboratorio de ondas", predict: "¿El sonido es transversal o longitudinal?", steps: ["Cambia al modo longitudinal", "Observa las compresiones"], observe: "Las partículas de aire van y vienen.", explain: "El sonido es una onda mecánica longitudinal." },
    ],
    tips: ["Mete un diapasón en un vaso con agua 💦 para VER las vibraciones.", "Los humanos oímos de 20 Hz a 20 000 Hz.", "El calor específico del agua (4 186) explica el clima suave de las ciudades costeras."],
    reading: {
      t: "El océano: el aire acondicionado de la Tierra",
      text: [
        "¿Por qué en Cartagena nunca hace muchísimo frío ni muchísimo calor entre el día y la noche? La respuesta es el mar. El agua tiene un calor específico muy alto: necesita mucha energía para cambiar su temperatura.",
        "Durante el día el océano absorbe calor del Sol. En la noche lo libera despacio. Eso mantiene estables las ciudades costeras. Los océanos absorben cerca del 90 % del calor extra causado por el cambio climático.",
        "Pero hay un problema. Cuando el océano se calienta, el hielo se derrite, el nivel del mar sube y los arrecifes de coral se vuelven blancos. Los científicos escuchan el océano con micrófonos submarinos. El sonido viaja 4 veces más rápido en el agua que en el aire, así que pueden oír ballenas a cientos de kilómetros.",
        "La física nos ayuda a medir, escuchar y actuar por el clima.",
      ],
      gloss: [["absorber", "tomar energía o un líquido"], ["liberar", "dejar salir algo"], ["costero", "cerca del mar"], ["arrecife", "estructura submarina hecha por corales"]],
      qs: [["¿Por qué las ciudades costeras tienen temperaturas estables?", "El alto calor específico del agua absorbe y libera el calor despacio."], ["¿Qué porcentaje del calor extra absorben los océanos?", "Cerca del 90 %."], ["¿Cuántas veces más rápido viaja el sonido en el agua que en el aire?", "Unas 4 veces."]],
    },
    quiz: [
      ["El sonido NO puede viajar por…", ["el agua", "el acero", "el aire", "el vacío"], "El sonido necesita un medio material."],
      ["Un sonido agudo tiene una alta…", ["amplitud", "frecuencia", "longitud de onda", "timbre"], "El tono depende de la frecuencia."],
      ["La intensidad (volumen) depende de…", ["la frecuencia", "la amplitud", "el color", "solo el medio"], "Mayor amplitud = más fuerte."],
      ["Café caliente y leche fría llegan a la misma temperatura. Esto es…", ["convección", "equilibrio térmico", "radiación", "condensación"], "El calor fluye hasta que las temperaturas se igualan."],
      ["Con la misma energía, ¿qué material se calienta más rápido?", ["Agua", "Arena", "Son iguales", "Hielo"], "La arena tiene menor calor específico."],
    ],
  },

  "7-4": {
    title: "Cargas para la paz",
    sdg: "ODS 16 · Paz, justicia e instituciones sólidas",
    challenge: "¿De qué manera podemos participar en la construcción de la paz escolar?",
    bigIdea: "Como las cargas, las personas pueden atraerse o repelerse. La electricidad enseña que el equilibrio (la materia neutra) es el estado más estable.",
    topics: ["Peces eléctricos", "Historia", "Carga eléctrica", "Ley de Coulomb", "Cuantización y conservación de la carga", "Las fuerzas de contacto son eléctricas", "Conductores, aislantes, semiconductores", "Métodos de carga", "Campo eléctrico y dipolos", "Potencial eléctrico", "Condensadores", "La Tierra como condensador"],
    ideas: [
      { t: "Conservación de la carga", b: "La carga no se crea ni se destruye. Solo pasa de un cuerpo a otro.", pts: ["Frota vidrio con seda: vidrio +, seda −", "Carga total = 0 antes y después", "Como la energía, la carga se conserva"] },
      { t: "Campo eléctrico", b: "Una carga crea un campo invisible a su alrededor. Las líneas de campo salen de + y entran a −.", pts: ["Líneas juntas = campo fuerte", "Un dipolo: + y − juntos", "Los campos empujan otras cargas"] },
      { t: "Las fuerzas de contacto son eléctricas", b: "¡Cuando empujas una pared, los electrones de tu mano repelen los electrones de la pared!", pts: ["En realidad nunca “tocas” nada", "La fricción también es eléctrica", "Las sillas te sostienen gracias a fuerzas eléctricas"] },
      { t: "Condensadores", b: "Un condensador guarda carga en dos placas separadas por un aislante. ¡La Tierra y las nubes forman un condensador gigante!", pts: ["Flash de cámara 📸", "Desfibriladores ❤️", "Un rayo = un condensador que se descarga"] },
    ],
    formulas: [
      { n: "Ley de Coulomb", m: ["9 × 10⁹", "distancia"], tip: "Cargas ×2 → fuerza ×2. Distancia ×2 → fuerza ÷4." },
      { n: "Campo eléctrico", m: ["campo eléctrico", "carga de prueba"], tip: "Campo = fuerza por unidad de carga." },
      { n: "Condensador", m: ["carga", "capacitancia", "voltaje"], tip: "“Q = C·V”: carga = capacitancia × voltaje." },
    ],
    examples: [
      { q: "Dos cargas de 2 μC están a 0,3 m. Halla F. (k = 9×10⁹)", steps: ["F = k q₁q₂ / r²", "9×10⁹ × (2×10⁻⁶)² / 0,09", "= 9×10⁹ × 4×10⁻¹² / 0,09"], a: "0,4 N" },
      { q: "Un condensador de 0,002 F a 12 V guarda ¿cuánta carga?", steps: ["Q = C V", "0,002 × 12"], a: "0,024 C" },
    ],
    labs: [
      { t: "Artista de líneas de campo", predict: "¿Qué forma hacen las líneas de un dipolo?", steps: ["Pon una carga + y una −", "Activa las líneas de campo", "Acércalas"], observe: "Las líneas salen de + y llegan a −.", explain: "Las líneas de campo muestran la dirección de la fuerza sobre una carga +." },
      { t: "Laboratorio de corriente", predict: "¿Más resistencia = más o menos corriente?", steps: ["Cambia la resistencia", "Lee el amperímetro"], observe: "Más resistencia, menos corriente.", explain: "I = V / R." },
    ],
    tips: ["Analogía de paz: los átomos neutros (equilibrados) son estables, como un salón respetuoso 🕊️.", "1 μC = 1 × 10⁻⁶ C. Convierte antes de usar Coulomb.", "¡Un rayo transporta unos 15 C de carga!"],
    reading: {
      t: "Lo neutro es poderoso",
      text: [
        "La mayoría de los objetos que te rodean son neutros. Tienen el mismo número de protones y electrones. La materia neutra es estable y tranquila.",
        "Cuando frotamos dos materiales, los electrones pasan de uno al otro. Ahora un objeto es positivo y el otro negativo. Se atraen con fuerza. Si la carga es muy grande, puede saltar como una chispa ⚡.",
        "En un salón, los conflictos pueden ser como cargas. Cuando una persona toma demasiado, otra siente que le falta y crece la tensión. Pero, igual que las cargas, las personas pueden encontrar el equilibrio otra vez.",
        "Benjamin Franklin elevó una cometa en una tormenta para estudiar los rayos. Inventó el pararrayos, que lleva las cargas peligrosas de forma segura a la tierra. Quizás la paz también necesita “pararrayos”: diálogo, escucha y justicia.",
      ],
      gloss: [["neutro", "sin carga eléctrica neta"], ["chispa", "pequeño destello de electricidad"], ["tensión", "sentimiento de conflicto o estrés"], ["pararrayos", "barra de metal que protege los edificios de los rayos"]],
      qs: [["¿Qué significa neutro?", "El mismo número de protones y electrones."], ["¿Qué pasa cuando frotamos dos materiales?", "Los electrones pasan de uno al otro."], ["¿Qué inventó Franklin?", "El pararrayos."]],
    },
    quiz: [
      ["Las líneas de campo eléctrico apuntan…", ["hacia las cargas +", "saliendo de las cargas +", "en círculos", "a ninguna parte"], "Van de + a −."],
      ["Cuando empujas una pared, la fuerza es principalmente…", ["gravitacional", "magnética", "eléctrica", "nuclear"], "Los electrones repelen electrones."],
      ["El silicio es un…", ["conductor", "aislante", "semiconductor", "superconductor"], "Se usa en los chips."],
      ["La carga total de un sistema aislado…", ["aumenta", "disminuye", "se conserva", "se vuelve cero"], "Conservación de la carga."],
      ["La unidad de capacitancia es el…", ["culombio", "faradio", "voltio", "ohmio"], "Faradio (F)."],
    ],
  },

  "8-1": {
    title: "Vectores y cinemática",
    sdg: "ODS 2 · Hambre cero",
    challenge: "¿Qué estrategias podemos implementar para ayudar a frenar el desperdicio de alimentos en nuestra comunidad?",
    bigIdea: "Para describir el movimiento necesitamos tamaño Y dirección: vectores. Con ellos podemos predecir dónde estará un camión de reparto, una manzana que cae o un balón.",
    topics: ["¿Qué es la física?", "Sistemas físicos", "Magnitudes", "Sistema internacional e inglés", "Conversión de unidades", "Vectores", "Método cabeza-cola", "Método del paralelogramo", "Distancia y desplazamiento", "Rapidez y velocidad", "Aceleración", "Movimiento rectilíneo uniforme (MRU)", "Movimiento uniformemente acelerado (MRUA)", "Caída libre", "Tiro vertical"],
    ideas: [
      { t: "Escalares vs vectores", b: "Un escalar solo tiene magnitud. Un vector tiene magnitud Y dirección.", pts: ["Escalares: masa, tiempo, temperatura", "Vectores: desplazamiento, velocidad, fuerza", "Los vectores se dibujan como flechas ➡️"] },
      { t: "Sumar vectores", b: "Cabeza-cola: pon la cola de la 2.ª flecha en la cabeza de la 1.ª. Paralelogramo: mismas colas y completa la figura.", pts: ["3 m al este + 4 m al norte = 5 m", "Misma dirección: se suman", "Direcciones opuestas: se restan"] },
      { t: "Aceleración", b: "La aceleración es qué tan rápido cambia la velocidad. Positiva = acelera; negativa = frena.", pts: ["a = Δv / t", "Unidad: m/s²", "MRU: a = 0 · MRUA: a = constante"] },
      { t: "Caída libre", b: "Sin aire, todos los objetos caen con la misma aceleración: g = 9,8 m/s².", pts: ["Pluma y martillo en la Luna 🪶🔨", "La velocidad aumenta 9,8 m/s cada segundo", "Tiro vertical: sube, se detiene, baja"] },
    ],
    formulas: [
      { n: "Velocidad media", m: ["desplazamiento", "tiempo"], tip: "¡Desplazamiento, no distancia!" },
      { n: "Aceleración", m: ["velocidad final", "velocidad inicial"], tip: "“Final menos inicial”, siempre en ese orden." },
      { n: "Ecuaciones del MRUA", m: ["desplazamiento"], tip: "Si parte del reposo, vᵢ = 0 y todo es más fácil." },
      { n: "Caída libre", m: ["9,8 m/s²"], tip: "1 s → 5 m, 2 s → 20 m, 3 s → 45 m (g ≈ 10). ¡Cuadrados!" },
      { n: "Magnitud de un vector", m: ["componentes perpendiculares"], tip: "Los triángulos 3-4-5 son tus mejores amigos." },
    ],
    examples: [
      { q: "Un camión pasa de 0 a 20 m/s en 10 s. ¿Aceleración?", steps: ["a = (20 − 0) / 10"], a: "2 m/s²" },
      { q: "Una moto de domicilios va 6 km al este y 8 km al norte. ¿Desplazamiento?", steps: ["R = √(6² + 8²)", "√100"], a: "10 km (hacia el noreste)" },
      { q: "Una manzana cae durante 2 s. ¿Cuánto cae? (g = 10)", steps: ["h = ½ g t²", "½ × 10 × 4"], a: "20 m" },
    ],
    labs: [
      { t: "Mapa del tesoro con vectores", predict: "¿Dos vectores de 5 unidades pueden sumar 0?", steps: ["Arrastra las dos flechas", "Cambia entre cabeza-cola / paralelogramo", "Lee la resultante"], observe: "Los vectores opuestos se cancelan.", explain: "La dirección importa tanto como el tamaño." },
      { t: "Zona de caída", predict: "¿Una bola pesada cae más rápido que una liviana?", steps: ["Cambia la masa", "Cambia el planeta", "Lee el tiempo hasta el suelo"], observe: "La masa no cambia la caída (sin aire).", explain: "Todos los objetos tienen la misma g." },
      { t: "Carrera al mercado", predict: "¿Qué camión llega primero: 10 m/s constantes o partiendo de 0 con 2 m/s²?", steps: ["Pon el carro A en MRU", "Pon el carro B en MRUA", "Dale play y compara gráficas"], observe: "La gráfica x–t del MRUA es una curva.", explain: "La velocidad cambia, entonces la pendiente cambia." },
    ],
    tips: ["Primero dibuja, después calcula.", "Gráfica v–t: el área bajo la línea = desplazamiento.", "Usa g = 10 m/s² para cálculo mental rápido; 9,8 para precisión."],
    reading: {
      t: "La física de la ruta de un camión de comida",
      text: [
        "Cada noche, un banco de alimentos de Bogotá recoge la comida que los supermercados no venden. Un camión visita cinco tiendas y lleva la comida a las familias. Entre más rápida la ruta, menos comida se daña.",
        "Los conductores usan un GPS. El GPS calcula el desplazamiento entre tiendas: un vector con distancia y dirección. También mide la velocidad y la aceleración para estimar la hora de llegada.",
        "La distancia total de la ruta era 18 km, pero el desplazamiento desde el inicio hasta la última tienda era solo 6 km. Con un mejor orden de tiendas, el equipo redujo la distancia a 12 km y ahorró 20 minutos.",
        "La cinemática no son solo ecuaciones. Puede ahorrar comida, combustible y tiempo.",
      ],
      gloss: [["dañarse", "ponerse malo, ya no sirve para comer"], ["ruta", "camino de un lugar a otro"], ["estimar", "calcular de forma aproximada"], ["combustible", "material que se quema para producir energía, como la gasolina"]],
      qs: [["¿Cuál es la diferencia entre la distancia y el desplazamiento de la ruta?", "Distancia 18 km (camino), desplazamiento 6 km (línea recta)."], ["¿Qué calcula el GPS?", "Desplazamiento, velocidad y aceleración para estimar la llegada."], ["¿Cuánto tiempo ahorró la nueva ruta?", "20 minutos."]],
    },
    quiz: [
      ["¿Qué magnitud es un vector?", ["Masa", "Temperatura", "Velocidad", "Tiempo"], "La velocidad tiene dirección."],
      ["Un objeto en MRU tiene aceleración igual a…", ["9,8 m/s²", "cero", "constante pero no cero", "creciente"], "Velocidad constante → a = 0."],
      ["En caída libre sin aire, una bola pesada y una liviana…", ["la pesada llega primero", "la liviana llega primero", "llegan juntas", "flotan"], "La misma g para todos."],
      ["En el punto más alto de un tiro vertical, la velocidad es…", ["máxima", "cero", "9,8 m/s", "negativa"], "Se detiene un instante."],
      ["Dos fuerzas de 6 N y 8 N a 90° dan una resultante de…", ["14 N", "2 N", "10 N", "48 N"], "√(36 + 64) = 10."],
    ],
  },

  "8-2": {
    title: "Fuerzas, trabajo y ondas",
    sdg: "ODS 8 · Trabajo decente y crecimiento económico",
    challenge: "¿Cómo el empleo decente puede contribuir a una economía sostenible e inclusiva?",
    bigIdea: "Las fuerzas hacen trabajo, el trabajo transfiere energía y la energía puede viajar como ondas. Las máquinas y los buenos empleos dependen de usar bien la energía.",
    topics: ["Dinámica", "Leyes de Newton", "Trabajo", "Potencia mecánica", "Energía cinética", "Energía potencial", "Ek ↔ Ep", "Vibraciones", "Fuentes de vibración", "Ondas y su clasificación", "Reflexión", "Refracción y ley de Snell", "Difracción"],
    ideas: [
      { t: "Potencia", b: "La potencia es qué tan rápido haces trabajo. Mismo trabajo en menos tiempo = más potencia.", pts: ["Ascensor vs escaleras: mismo trabajo", "El ascensor tiene más potencia", "Unidad: vatio (W) = J/s"] },
      { t: "Las ondas llevan energía, no materia", b: "Una onda es una perturbación que transporta energía. El medio solo vibra.", pts: ["Transversal: vibración ⊥ a la dirección (cuerda)", "Longitudinal: vibración ∥ a la dirección (sonido)", "Mecánicas vs electromagnéticas"] },
      { t: "Partes de una onda", b: "Cresta, valle, amplitud, longitud de onda (λ), frecuencia (f) y periodo (T).", pts: ["λ = distancia entre dos crestas", "f = ondas por segundo (Hz)", "v = λ · f"] },
      { t: "Fenómenos ondulatorios", b: "Reflexión (rebota), refracción (cambia de rapidez y se desvía) y difracción (rodea obstáculos).", pts: ["Eco = reflexión 🗣️", "Un pitillo se ve quebrado en el agua = refracción", "Oyes detrás de una esquina = difracción"] },
    ],
    formulas: [
      { n: "Segunda ley de Newton", m: ["fuerza neta"], tip: "Primero suma TODAS las fuerzas (con signos)." },
      { n: "Trabajo y potencia", m: ["potencia"], tip: "¡No confundas W (trabajo, J) con W (vatio)!" },
      { n: "Rapidez de una onda", m: ["longitud de onda", "frecuencia", "periodo"], tip: "v = λ · f: rapidez = longitud de onda × frecuencia 🐸." },
      { n: "Ley de Snell", m: ["índice de refracción", "ángulo con la normal"], tip: "¿Entra a un medio más denso? El rayo se acerca a la normal." },
    ],
    examples: [
      { q: "Un trabajador levanta cajas con 300 J de trabajo en 6 s. ¿Potencia?", steps: ["P = W / t", "300 / 6"], a: "50 W" },
      { q: "Una onda tiene λ = 2 m y f = 5 Hz. ¿Rapidez?", steps: ["v = λ f", "2 × 5"], a: "10 m/s" },
      { q: "La luz pasa del aire (n = 1) a 30° al agua (n = 1,33). ¿Ángulo de refracción?", steps: ["sen θ₂ = 1 × sen 30° / 1,33", "= 0,5 / 1,33 = 0,376"], a: "θ₂ ≈ 22°" },
    ],
    labs: [
      { t: "Máquina de ondas", predict: "Si la frecuencia se duplica y la rapidez no cambia, ¿qué le pasa a λ?", steps: ["Ajusta la frecuencia", "Mide λ con la regla", "Duplica f"], observe: "λ se reduce a la mitad.", explain: "v = λ f la fija el medio." },
      { t: "Doblando la luz", predict: "¿La luz puede quedar “atrapada” dentro del agua?", steps: ["Envía luz del agua al aire", "Aumenta el ángulo", "Encuentra el ángulo crítico"], observe: "¡Reflexión total interna!", explain: "Así la fibra óptica lleva internet 🌐." },
      { t: "Empujando la economía", predict: "¿Cuánta potencia necesita un trabajador para empujar un carro?", steps: ["Aplica fuerza con fricción", "Calcula trabajo y potencia"], observe: "La fricción exige más fuerza.", explain: "La fuerza neta decide la aceleración." },
    ],
    tips: ["Potencia humana subiendo escaleras ≈ 200–500 W.", "Hagan una ola humana en clase 🙋‍♀️🙋 para mostrar que la energía viaja mientras las personas se quedan en su lugar.", "Snell: mide siempre los ángulos desde la NORMAL, no desde la superficie."],
    reading: {
      t: "Fibra óptica: luz que crea empleos",
      text: [
        "En 2021, muchos pueblos de Colombia tuvieron internet por primera vez gracias a la fibra óptica. Una fibra óptica es un hilo de vidrio más delgado que un pelo. La luz viaja dentro de él llevando millones de mensajes por segundo.",
        "¿Cómo se queda la luz adentro? Cuando la luz pasa del vidrio al aire con un ángulo grande, no se refracta hacia afuera: se refleja por completo. Esto se llama reflexión total interna. La luz rebota kilómetros y kilómetros dentro de la fibra.",
        "Con internet, una joven artesana de Boyacá puede vender sus productos en línea, un campesino puede consultar precios y los estudiantes pueden tomar cursos. La física crea empleos.",
        "Las ondas (luz, radio, sonido) son los caminos ocultos de la economía moderna.",
      ],
      gloss: [["hilo", "pedazo muy delgado y largo de un material"], ["artesana", "persona que hace cosas a mano"], ["refractarse", "cambiar de dirección al entrar a un medio nuevo"], ["rebotar", "chocar contra algo y devolverse"]],
      qs: [["¿Qué es una fibra óptica?", "Un hilo de vidrio más delgado que un pelo que transporta luz."], ["¿Por qué la luz se queda dentro de la fibra?", "Por la reflexión total interna."], ["Da un ejemplo de un trabajo que ayuda internet.", "Una artesana que vende en línea / un campesino que consulta precios."]],
    },
    quiz: [
      ["Las ondas transportan…", ["materia", "energía", "aire", "agua"], "Solo viaja la energía."],
      ["El número de ondas por segundo es la…", ["periodo", "amplitud", "frecuencia", "longitud de onda"], "Se mide en hercios."],
      ["Un pitillo se ve quebrado en un vaso de agua por…", ["reflexión", "difracción", "refracción", "interferencia"], "La luz cambia de rapidez."],
      ["1 vatio es igual a…", ["1 N·m", "1 J/s", "1 kg·m/s", "1 J·s"], "Potencia = energía por tiempo."],
      ["La luz que entra a un medio más denso se desvía…", ["alejándose de la normal", "hacia la normal", "no se desvía", "hacia atrás"], "Se vuelve más lenta."],
    ],
  },

  "8-3": {
    title: "Fluidos y leyes de los gases",
    sdg: "ODS 6 · Agua limpia y saneamiento",
    challenge: "¿Qué cambios debemos implementar para garantizar los recursos hídricos a las próximas generaciones?",
    bigIdea: "Los fluidos empujan en todas las direcciones. La presión explica las represas, los tanques de agua, los barcos que flotan, los aviones y cómo cambian los gases con la temperatura.",
    topics: ["La energía del agua en movimiento", "Fluidos", "Presión", "Densidad", "Presión en los líquidos", "Principio de Pascal", "Principio de Arquímedes", "Fuerza de empuje", "Presión atmosférica", "Principio de Bernoulli", "Fuerza de sustentación", "Ley de Boyle", "Ley de Charles", "Ley de Gay-Lussac", "Ley combinada de los gases", "Ley de los gases ideales"],
    ideas: [
      { t: "Presión", b: "La presión es una fuerza repartida en un área. Área pequeña = presión grande.", pts: ["Los tacones se hunden en el pasto 👠", "Las raquetas de nieve no 🎿", "Más profundidad en el agua = más presión"] },
      { t: "Pascal y Arquímedes", b: "Pascal: la presión en un líquido se reparte por igual. Arquímedes: un fluido empuja hacia arriba con una fuerza igual al peso del líquido desplazado.", pts: ["Gatos hidráulicos para carros 🚗", "Los barcos flotan gracias al empuje 🚢", "¡Eureka! 🛁"] },
      { t: "Bernoulli", b: "Donde un fluido se mueve más rápido, su presión es menor.", pts: ["Alas de avión ✈️", "La cortina de la ducha se mete hacia adentro", "Soplar sobre un papel lo levanta"] },
      { t: "Leyes de los gases", b: "La presión, el volumen y la temperatura de un gas están relacionados.", pts: ["Boyle: P↑ V↓ (T constante)", "Charles: T↑ V↑ (P constante)", "Gay-Lussac: T↑ P↑ (V constante)"] },
    ],
    formulas: [
      { n: "Presión", m: ["presión", "área"], tip: "Presión = qué tan “concentrada” está la fuerza." },
      { n: "Presión hidrostática", m: ["profundidad"], tip: "Cada 10 m de agua suman ≈ 1 atmósfera." },
      { n: "Fuerza de empuje", m: ["volumen sumergido"], tip: "Usa la densidad del FLUIDO, no la del objeto." },
      { n: "Leyes de los gases", m: ["temperatura en KELVIN", "8,31"], tip: "La temperatura SIEMPRE en kelvin. ¡Siempre!" },
    ],
    examples: [
      { q: "Una persona de 600 N se para sobre 0,04 m² de zapatos. ¿Presión?", steps: ["P = F / A", "600 / 0,04"], a: "15 000 Pa" },
      { q: "¿Presión a 5 m de profundidad en un tanque de agua? (ρ = 1 000, g = 10)", steps: ["P = ρ g h", "1 000 × 10 × 5"], a: "50 000 Pa" },
      { q: "Un gas a 2 atm y 3 L se comprime a 1 L (T constante). ¿Nueva presión?", steps: ["P₁V₁ = P₂V₂", "2 × 3 = P₂ × 1"], a: "6 atm" },
    ],
    labs: [
      { t: "Laboratorio de Arquímedes", predict: "¿Un barco flota porque es liviano?", steps: ["Prueba diferentes densidades", "Mira la parte sumergida", "Lee empuje vs peso"], observe: "Flota cuando E = W.", explain: "Flotar depende de la densidad y del volumen desplazado." },
      { t: "Pistón de gas", predict: "Si calientas el gas a volumen constante, ¿qué le pasa a P?", steps: ["Fija el volumen", "Sube T", "Lee la presión"], observe: "P crece proporcional a T (en K).", explain: "Las partículas más rápidas golpean más fuerte las paredes." },
    ],
    tips: ["Bucear 10 m = +1 atm. ¡Por eso duelen los oídos!", "Kelvin, kelvin, kelvin (leyes de los gases).", "Demo: una tarjeta sobre un vaso lleno de agua boca abajo: ¡presión atmosférica!"],
    reading: {
      t: "El secreto de los tanques de agua",
      text: [
        "¿Has visto tanques de agua enormes en lo alto de colinas o edificios? No necesitan bombas para mandar el agua a tu casa. Usan la presión del agua misma.",
        "La presión en un líquido depende de la profundidad: P = ρgh. Un tanque de 30 metros de alto produce una presión de 300 000 pascales en el fondo. Eso basta para que el agua salga por tu ducha en el quinto piso.",
        "Pero hay un problema: en algunas ciudades se pierde hasta el 40 % del agua por fugas en tuberías viejas. La alta presión empuja el agua por cada grieta pequeña.",
        "Los ingenieros usan sensores de presión para encontrar las fugas. Arreglarlas puede ahorrar millones de litros. La física es una herramienta poderosa para proteger el agua de las futuras generaciones.",
      ],
      gloss: [["tanque", "recipiente grande para líquidos"], ["bomba", "máquina que mueve líquidos"], ["fuga", "agujero por donde se escapa un líquido"], ["sensor", "dispositivo que detecta y mide algo"]],
      qs: [["¿Por qué los tanques de agua no necesitan bombas?", "Usan la presión creada por la altura (P = ρgh)."], ["¿Qué presión produce un tanque de 30 m?", "Unos 300 000 Pa."], ["¿Cuánta agua se puede perder por fugas?", "Hasta el 40 %."]],
    },
    quiz: [
      ["La misma fuerza sobre un área más pequeña produce…", ["menos presión", "más presión", "la misma presión", "ninguna presión"], "P = F/A."],
      ["Un barco flota porque…", ["es de madera", "el empuje es igual a su peso", "el agua es liviana", "el aire lo empuja"], "Principio de Arquímedes."],
      ["Las alas de los aviones funcionan gracias a…", ["Pascal", "Boyle", "Bernoulli", "Charles"], "Aire más rápido arriba → menor presión."],
      ["Si la temperatura de un gas aumenta a presión constante, su volumen…", ["disminuye", "aumenta", "se mantiene", "se vuelve cero"], "Ley de Charles."],
      ["Los gatos hidráulicos usan…", ["el principio de Pascal", "la ley de Snell", "la ley de Ohm", "la ley de Hooke"], "La presión se transmite por igual."],
    ],
  },

  "8-4": {
    title: "Termodinámica y ciudades inteligentes",
    sdg: "ODS 11 · Ciudades y comunidades sostenibles",
    challenge: "¿Cómo avanzar en la urbanización inclusiva a un ritmo responsable y con menor impacto ambiental?",
    bigIdea: "Motores, neveras y centrales eléctricas convierten calor en trabajo, pero nunca al 100 %. La termodinámica muestra los límites y ayuda a diseñar ciudades más limpias.",
    topics: ["Ciudades inteligentes", "Temperatura y calor", "Equilibrio térmico", "Medición de la temperatura", "Conducción, convección, radiación", "Radiación solar", "Equivalente mecánico del calor", "Primera ley", "Trabajo de los gases", "Procesos termodinámicos", "Segunda ley y máquinas térmicas", "Tercera ley y entropía"],
    ideas: [
      { t: "Primera ley", b: "La energía se conserva: el calor que entra a un sistema se vuelve energía interna y/o trabajo.", pts: ["ΔU = Q − W", "Q > 0: entra calor", "W > 0: el gas hace trabajo (se expande)"] },
      { t: "Procesos", b: "Isotérmico (T constante), isobárico (P constante), isocórico (V constante), adiabático (sin calor).", pts: ["Inflar una llanta de bici: adiabático → se calienta", "Olla a presión: isocórico", "Globo al sol: isobárico"] },
      { t: "Segunda ley y motores", b: "El calor fluye naturalmente de lo caliente a lo frío. Un motor no puede convertir todo el calor en trabajo.", pts: ["Eficiencia de un motor de carro ≈ 25–30 %", "Nevera = bomba de calor (usa trabajo)", "La entropía (desorden) siempre aumenta"] },
      { t: "El descubrimiento de Joule", b: "El trabajo y el calor son lo mismo: energía. 4,186 J = 1 caloría.", pts: ["Joule agitó agua con pesas que caían", "¡El agua se calentó!", "Equivalente mecánico del calor"] },
    ],
    formulas: [
      { n: "Primera ley", m: ["cambio de energía interna", "calor que entra", "trabajo hecho POR el gas"], tip: "Cuenta bancaria: Q = consignaciones, W = gastos, ΔU = ahorro 💰." },
      { n: "Trabajo de un gas", m: ["cambio de volumen"], tip: "Expansión = trabajo positivo." },
      { n: "Eficiencia", m: ["calor de la fuente caliente", "calor liberado al sumidero frío"], tip: "Siempre < 1 (< 100 %). La naturaleza cobra un “impuesto de calor”." },
      { n: "Límite de Carnot", m: ["temperaturas en kelvin"], tip: "Mayor diferencia de temperatura = mejor motor." },
    ],
    examples: [
      { q: "Un gas recibe 500 J de calor y hace 200 J de trabajo. ¿ΔU?", steps: ["ΔU = Q − W", "500 − 200"], a: "300 J" },
      { q: "Un motor usa 2 000 J de calor y hace 500 J de trabajo. ¿Eficiencia?", steps: ["η = W / Qh", "500 / 2 000"], a: "0,25 = 25 %" },
      { q: "Un gas a 100 000 Pa se expande 0,002 m³. ¿Trabajo?", steps: ["W = P ΔV", "100 000 × 0,002"], a: "200 J" },
    ],
    labs: [
      { t: "Motor en un pistón", predict: "Al calentar a presión constante, ¿el gas hace trabajo?", steps: ["Libera el pistón", "Calienta el gas", "Mira cómo crece el volumen"], observe: "El volumen aumenta: el gas empuja el pistón.", explain: "W = PΔV > 0." },
      { t: "Calor en la ciudad", predict: "¿Cómo enfría un techo verde un edificio?", steps: ["Explora la radiación y la convección", "Compara superficies oscuras y claras"], observe: "Las superficies oscuras absorben más radiación.", explain: "Las islas de calor urbanas se reducen con plantas y colores claros." },
    ],
    tips: ["Convención de signos: ¡escríbela en el tablero cada clase!", "Demo de la nevera: la parte de atrás está caliente, el calor se bombea hacia afuera.", "Ejemplo de entropía: un cuarto desordenado nunca se arregla solo 🧦."],
    reading: {
      t: "Ciudades que sudan menos",
      text: [
        "Las ciudades grandes son más calientes que el campo, a veces 5 °C más. Esto se llama isla de calor urbana. El asfalto y el concreto absorben la radiación solar durante el día y la liberan en la noche.",
        "Los aires acondicionados empeoran el problema. Una máquina que enfría tu cuarto debe mandar el calor afuera. La segunda ley de la termodinámica dice que el calor no va de lo frío a lo caliente por sí solo: necesita trabajo, y el trabajo necesita electricidad.",
        "Las ciudades inteligentes responden. Medellín creó “corredores verdes” con árboles y plantas en sus calles. Las plantas usan la energía solar para evaporar agua, lo que enfría el aire. La temperatura en esas calles bajó cerca de 2 °C.",
        "La termodinámica no es solo de motores. Es una guía para diseñar ciudades donde todos puedan vivir cómodos.",
      ],
      gloss: [["asfalto", "material negro de las carreteras"], ["isla de calor", "zona mucho más caliente que sus alrededores"], ["corredor", "zona larga y angosta que conecta lugares"], ["evaporar", "pasar de líquido a gas"]],
      qs: [["¿Qué es una isla de calor urbana?", "Una zona de la ciudad mucho más caliente que el campo."], ["¿Por qué los aires acondicionados necesitan trabajo?", "El calor no fluye solo de lo frío a lo caliente (2.ª ley)."], ["¿Cuánto bajaron la temperatura los corredores verdes?", "Cerca de 2 °C."]],
    },
    quiz: [
      ["La primera ley de la termodinámica trata de…", ["la entropía", "la conservación de la energía", "el cero absoluto", "la presión"], "ΔU = Q − W."],
      ["Ninguna máquina térmica real puede tener una eficiencia del…", ["10 %", "30 %", "50 %", "100 %"], "Segunda ley."],
      ["Un proceso a temperatura constante es…", ["isobárico", "isocórico", "isotérmico", "adiabático"], "Iso = igual, térmico = temperatura."],
      ["La entropía de un sistema aislado tiende a…", ["disminuir", "aumentar", "quedarse en cero", "oscilar"], "El desorden crece."],
      ["Cuando un gas se expande, el trabajo hecho por el gas es…", ["negativo", "cero", "positivo", "infinito"], "W = PΔV > 0."],
    ],
  },
};
