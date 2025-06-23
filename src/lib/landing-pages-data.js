const commonData = {
  ctaText: "Empezar ahora gratis",
  secondaryTitle: "Todo lo que necesitas en un solo lugar",
  secondarySubtitle: "Fedrita te ofrece un conjunto de herramientas potentes y fáciles de usar para llevar tu negocio al siguiente nivel.",
  benefits: [
    {
      title: "Ahorra tiempo valioso",
      description: "Automatiza tareas repetitivas como la gestión de citas y recordatorios para que puedas centrarte en tus clientes."
    },
    {
      title: "Reduce las ausencias",
      description: "Envía recordatorios automáticos por WhatsApp y reduce hasta en un 90% las citas no asistidas."
    },
    {
      title: "Mejora la experiencia del cliente",
      description: "Ofrece a tus clientes la comodidad de reservar online 24/7 y gestionar sus citas desde su móvil."
    },
    {
      title: "Toma decisiones informadas",
      description: "Accede a métricas y reportes clave sobre tu negocio para entender qué funciona y cómo puedes mejorar."
    }
  ],
  benefitImage: "Dashboard de Fedrita en una tablet mostrando la agenda y métricas."
};

export const landingPagesData = {
  peluquerias: {
    ...commonData,
    title: "El Software Definitivo para Gestionar tu Peluquería",
    subtitle: "Automatiza citas, gestiona clientes y haz crecer tu negocio con Fedrita. Dedica más tiempo a crear estilos y menos a la administración.",
    heroImageDescription: "Una peluquería moderna y elegante con un estilista trabajando en el cabello de un cliente.",
    heroImage: "Estilista sonriente cortando el cabello a una clienta en un salón de peluquería moderno y luminoso.",
    benefitImage: "Recepcionista de peluquería usando una tablet para agendar una cita en un mostrador elegante.",
    features: [
      { title: "Agenda Online 24/7", description: "Permite que tus clientes reserven a cualquier hora, incluso cuando tu salón está cerrado." },
      { title: "Recordatorios por WhatsApp", description: "Disminuye las ausencias con notificaciones automáticas para tus clientes." },
      { title: "Gestión de Clientes", description: "Guarda historiales de servicios, preferencias y notas para un trato personalizado." },
      { title: "Control de Inventario", description: "Lleva un seguimiento de tus productos de venta y de uso interno de forma sencilla." },
      { title: "Marketing y Fidelización", description: "Envía promociones y campañas a tus clientes para aumentar la recurrencia." },
      { title: "Caja y Facturación", description: "Gestiona los pagos, cierra la caja diaria y emite facturas simplificadas." }
    ]
  },
  barberias: {
    ...commonData,
    title: "Software de Gestión para Barberías Modernas",
    subtitle: "Optimiza tu agenda, fideliza a tus clientes y controla tu barbería como nunca antes. Con Fedrita, tu negocio no para de crecer.",
    heroImageDescription: "Una barbería con estilo, con barberos atendiendo a clientes.",
    heroImage: "Barbero con estilo aplicando espuma de afeitar a un cliente en una silla de barbería clásica.",
    benefitImage: "Primer plano de un smartphone mostrando una app de agenda de citas con el logo de una barbería.",
    features: [
      { title: "Reservas Online Inteligentes", description: "Tus clientes eligen barbero, servicio y hora. Tú solo te preocupas de cortar el pelo." },
      { title: "Fichas de Cliente Detalladas", description: "Apunta sus cortes preferidos, productos y mantén un historial completo." },
      { title: "Notificaciones Automáticas", description: "Reduce las ausencias y mantén a tus clientes informados sin esfuerzo." },
      { title: "Gestión de Empleados", description: "Controla horarios, comisiones y rendimiento de tu equipo de barberos." },
      { title: "Venta de Productos", description: "Gestiona tu stock de ceras, aceites y otros productos y aumenta tus ingresos." },
      { title: "Análisis de Negocio", description: "Descubre tus servicios más rentables y tus horas de mayor afluencia." }
    ]
  },
  centros_unas: {
    ...commonData,
    title: "Software para Centros de Uñas y Manicura",
    subtitle: "Gestiona tus citas de manicura, pedicura y nail art de forma eficiente. Fedrita es la herramienta que tu centro de uñas necesita.",
    heroImageDescription: "Un centro de uñas profesional con una clienta recibiendo una manicura.",
    heroImage: "Manos de una clienta con una manicura perfecta, con la manicurista aplicando el toque final.",
    benefitImage: "Mujer feliz reservando su próxima cita de manicura en su móvil, sentada en un café.",
    features: [
      { title: "Agenda Visual por Puesto", description: "Organiza las citas por cada puesto de manicura y profesional." },
      { title: "Galería de Diseños", description: "Muestra tus trabajos de nail art y permite que los clientes elijan su favorito al reservar." },
      { title: "Recordatorios de Citas", description: "Asegura que tus clientas no olviden su cita para el relleno o el nuevo diseño." },
      { title: "Base de Datos de Clientes", description: "Guarda los colores, diseños preferidos y alergias de cada clienta." },
      { title: "Programas de Fidelización", description: "Crea bonos de sesiones o descuentos por recurrencia para premiar a tus clientas." },
      { title: "Control de Stock", description: "Gestiona tus esmaltes, geles y otros consumibles para no quedarte sin material." }
    ]
  },
  centros_estetica: {
    ...commonData,
    title: "Software de Gestión para Centros de Estética",
    subtitle: "Desde tratamientos faciales hasta corporales, Fedrita te ayuda a gestionar tu centro de estética de manera integral y profesional.",
    heroImageDescription: "Un ambiente de spa tranquilo en un centro de estética.",
    heroImage: "Mujer con los ojos cerrados disfrutando de una mascarilla facial en una camilla de un centro de estética de lujo.",
    benefitImage: "Esteticista profesional sonriendo mientras revisa la agenda digital en una tablet en su clínica.",
    features: [
      { title: "Citas Online para Tratamientos", description: "Tus clientes pueden reservar peelings, limpiezas faciales o masajes 24/7." },
      { title: "Historial y Consentimientos", description: "Almacena de forma segura los consentimientos informados y el historial de tratamientos." },
      { title: "Gestión de Cabinas y Equipos", description: "Organiza la disponibilidad de tus cabinas y aparatología para optimizar su uso." },
      { title: "Bonos y Packs de Sesiones", description: "Vende packs de tratamientos y gestiona las sesiones consumidas automáticamente." },
      { title: "Comunicación con Clientes", description: "Envía recomendaciones post-tratamiento y promociones personalizadas." },
      { title: "Análisis de Rentabilidad", description: "Conoce qué tratamientos y productos te generan más beneficios." }
    ]
  },
  masajistas_spa: {
    ...commonData,
    title: "Software para Masajistas y Spas",
    subtitle: "Crea un ambiente de relajación desde el momento de la reserva. Fedrita simplifica la gestión para que te dediques al bienestar de tus clientes.",
    heroImageDescription: "Una persona recibiendo un masaje relajante en un spa.",
    heroImage: "Camilla de masaje preparada con toallas blancas, pétalos de flores y velas en una sala de spa con luz tenue.",
    benefitImage: "Vista desde arriba de un hombre recibiendo un masaje de espalda con piedras calientes en un spa.",
    features: [
      { title: "Reservas Sencillas y Rápidas", description: "Tus clientes eligen el tipo de masaje y la duración con total facilidad." },
      { title: "Gestión de Terapeutas", description: "Asigna masajes a cada terapeuta y gestiona sus horarios y especialidades." },
      { title: "Ficha de Cliente Confidencial", description: "Anota contraindicaciones, zonas a tratar y preferencias de cada cliente." },
      { title: "Venta de Tarjetas Regalo", description: "Ofrece experiencias de bienestar para regalar y gestiona su canjeo fácilmente." },
      { title: "Ambiente Personalizado", description: "Permite que los clientes indiquen sus preferencias de música o aceites al reservar." },
      { title: "Recordatorios Relajantes", description: "Envía recordatorios que evocan tranquilidad y preparan al cliente para su cita." }
    ]
  },
  psicologos: {
    ...commonData,
    title: "Software para Psicólogos y Terapeutas",
    subtitle: "Gestiona tus consultas con la máxima confidencialidad y eficiencia. Fedrita te ayuda a organizar tu práctica para que te centres en tus pacientes.",
    heroImageDescription: "Un despacho de psicología acogedor y profesional.",
    heroImage: "Despacho de psicología luminoso y acogedor con dos sillones cómodos, una planta y libros en la estantería.",
    benefitImage: "Persona hablando con su terapeuta por videollamada en un ordenador portátil, en un ambiente hogareño.",
    features: [
      { title: "Portal de Paciente Seguro", description: "Ofrece a tus pacientes un espacio privado para reservar y gestionar sus sesiones." },
      { title: "Citas Online y Presenciales", description: "Gestiona tu calendario con sesiones en consulta o por videollamada." },
      { title: "Notas de Sesión Privadas", description: "Lleva un registro confidencial del progreso de cada paciente, cumpliendo con la LOPD." },
      { title: "Recordatorios Discretos", description: "Envía notificaciones de citas de forma segura y discreta para proteger la privacidad." },
      { title: "Facturación y Pagos", description: "Automatiza el cobro de las sesiones y la emisión de facturas." },
      { title: "Gestión de Documentos", description: "Comparte y recibe documentos de forma segura con tus pacientes." }
    ]
  },
  dentistas: {
    ...commonData,
    title: "Software de Gestión para Clínicas Dentales",
    subtitle: "Moderniza tu clínica dental con Fedrita. Optimiza la agenda, la gestión de pacientes y la comunicación para ofrecer la mejor atención.",
    heroImageDescription: "Una clínica dental moderna con un dentista y un paciente.",
    heroImage: "Dentista amable explicando un procedimiento a un paciente sonriente en una clínica dental de última generación.",
    benefitImage: "Monitor de ordenador en una recepción de clínica dental mostrando un software de gestión con un odontograma.",
    features: [
      { title: "Agenda por Gabinete y Doctor", description: "Organiza las citas de forma eficiente, asignando a cada profesional y gabinete." },
      { title: "Odontograma Digital", description: "Registra el estado y los tratamientos de cada pieza dental de forma visual e intuitiva." },
      { title: "Historial Clínico Completo", description: "Almacena radiografías, tratamientos, alergias y toda la información del paciente." },
      { title: "Planes de Tratamiento y Presupuestos", description: "Crea y envía presupuestos detallados a tus pacientes y haz seguimiento." },
      { title: "Recordatorios de Revisiones", description: "Automatiza las notificaciones para las próximas revisiones o higienes dentales." },
      { title: "Comunicación con Laboratorios", description: "Gestiona los pedidos y fechas de entrega con tus laboratorios protésicos." }
    ]
  },
  fisioterapeutas: {
    ...commonData,
    title: "Software para Fisioterapeutas y Rehabilitación",
    subtitle: "Dedica tu tiempo a la recuperación de tus pacientes, no a la administración. Fedrita agiliza la gestión de tu consulta de fisioterapia.",
    heroImageDescription: "Un fisioterapeuta trabajando con un paciente en una clínica.",
    heroImage: "Fisioterapeuta ayudando a un deportista a realizar un ejercicio de estiramiento en una clínica luminosa.",
    benefitImage: "Paciente en ropa deportiva siguiendo una rutina de ejercicios desde una tablet en su casa.",
    features: [
      { title: "Citas Online por Especialidad", description: "Permite que los pacientes reserven según la especialidad: deportiva, neurológica, etc." },
      { title: "Historial de Lesiones y Evolución", description: "Lleva un seguimiento detallado del progreso de cada paciente con notas y gráficos." },
      { title: "Ejercicios y Pautas", description: "Envía planes de ejercicios personalizados a tus pacientes a través de la plataforma." },
      { title: "Gestión de Bonos de Sesiones", description: "Facilita la compra y el seguimiento de bonos de tratamiento para tus pacientes." },
      { title: "Consentimiento Informado Digital", description: "Recoge la firma de los consentimientos de forma digital y segura." },
      { title: "Facturación a Mutuas y Aseguradoras", description: "Simplifica el proceso de facturación a las diferentes entidades colaboradoras." }
    ]
  },
  clinicas_fisioterapia: {
    ...commonData,
    title: "Software para Clínicas de Fisioterapia",
    subtitle: "Gestiona múltiples profesionales, salas y equipos en tu clínica de fisioterapia. Fedrita es la solución integral para escalar tu negocio.",
    heroImageDescription: "Una clínica de fisioterapia con varias salas y pacientes.",
    heroImage: "Clínica de fisioterapia espaciosa y moderna, con varios pacientes realizando ejercicios supervisados por fisioterapeutas.",
    benefitImage: "Grupo de fisioterapeutas sonrientes colaborando frente a un gran monitor con la planificación de la clínica.",
    features: [
      { title: "Agenda Multiprofesional", description: "Coordina los horarios de todos tus fisioterapeutas en una única agenda." },
      { title: "Gestión de Salas y Equipamiento", description: "Optimiza el uso de tus salas de tratamiento y equipos especializados." },
      { title: "Informes y Estadísticas", description: "Analiza el rendimiento de la clínica, la ocupación y la facturación por profesional." },
      { title: "Portal del Paciente Centralizado", description: "Ofrece un único punto de acceso para que los pacientes gestionen sus citas." },
      { title: "Comunicación Interna", description: "Facilita la comunicación y coordinación entre los miembros de tu equipo." },
      { title: "Control de Facturación y Cobros", description: "Gestiona la facturación de pacientes privados y mutuas de forma centralizada." }
    ]
  },
  veterinarias: {
    ...commonData,
    title: "Software de Gestión para Clínicas Veterinarias",
    subtitle: "Cuida de tus pacientes de cuatro patas con la mejor organización. Fedrita simplifica la gestión de tu clínica veterinaria.",
    heroImageDescription: "Un veterinario atendiendo a un perro en una clínica.",
    heroImage: "Veterinaria cariñosa examinando a un cachorro juguetón en la mesa de exploración de una clínica limpia.",
    benefitImage: "Mano de una persona sosteniendo un móvil que muestra una notificación de recordatorio de cita para su mascota.",
    features: [
      { title: "Ficha Completa de Mascota", description: "Registra historial clínico, vacunas, desparasitaciones y todos los datos de la mascota." },
      { title: "Agenda de Consultas y Cirugías", description: "Organiza las citas, urgencias y el uso del quirófano de forma eficiente." },
      { title: "Recordatorios de Vacunación", description: "Envía avisos automáticos a los dueños para las próximas vacunas o revisiones." },
      { title: "Gestión de Hospitalización", description: "Controla los pacientes ingresados, sus tratamientos y evolución." },
      { title: "Control de Farmacia y Stock", description: "Gestiona el inventario de medicamentos y productos de la tienda." },
      { title: "Planes de Salud", description: "Crea y gestiona planes de salud anuales para fidelizar a tus clientes." }
    ]
  },
  yoga_pilates: {
    ...commonData,
    title: "Software para Centros de Yoga y Pilates",
    subtitle: "Gestiona tus clases, alumnos y suscripciones sin esfuerzo. Fedrita te da la paz mental para que te centres en impartir tus clases.",
    heroImageDescription: "Una clase de yoga en un estudio luminoso y tranquilo.",
    heroImage: "Grupo diverso de personas practicando yoga en una sala luminosa con grandes ventanales y vistas a la naturaleza.",
    benefitImage: "Mujer en ropa de yoga usando su móvil para reservar una clase de pilates después de su sesión.",
    features: [
      { title: "Horario de Clases Online", description: "Publica tu horario y permite que tus alumnos reserven su plaza en las clases." },
      { title: "Gestión de Aforos", description: "Controla el número de plazas por clase para no superar el aforo." },
      { title: "Bonos de Clases y Membresías", description: "Vende diferentes tipos de bonos y suscripciones mensuales o anuales." },
      { title: "Lista de Espera Automática", description: "Si una clase se llena, los alumnos pueden apuntarse a la lista de espera." },
      { title: "Check-in de Alumnos", description: "Lleva un registro de asistencia a las clases de forma rápida y sencilla." },
      { title: "Comunicación con Alumnos", description: "Informa sobre cambios de horario, nuevos talleres o promociones." }
    ]
  },
  clinicas_estetica_laser: {
    ...commonData,
    title: "Software para Clínicas de Estética y Depilación Láser",
    subtitle: "Gestiona con precisión tus tratamientos de estética avanzada y depilación láser. Fedrita es la herramienta para negocios de alta tecnología.",
    heroImageDescription: "Una persona recibiendo un tratamiento de depilación láser.",
    heroImage: "Profesional cualificado realizando un tratamiento de depilación láser con equipo de alta tecnología en una clínica moderna.",
    benefitImage: "Primer plano de la pantalla de un dispositivo de depilación láser mostrando los ajustes de la sesión.",
    features: [
      { title: "Agenda por Máquina y Cabina", description: "Optimiza el uso de tu aparatología láser y organiza las cabinas." },
      { title: "Seguimiento de Sesiones", description: "Controla las sesiones de los bonos de depilación y otros tratamientos." },
      { title: "Consentimiento Informado Digital", description: "Almacena de forma segura los consentimientos para cada tipo de tratamiento." },
      { title: "Historial Fotográfico", description: "Guarda fotos del antes y después para visualizar la evolución del tratamiento." },
      { title: "Recordatorios de Próxima Sesión", description: "Avisa a tus clientes cuándo les toca su siguiente sesión según el protocolo." },
      { title: "Gestión de Personal Técnico", description: "Organiza los horarios y las comisiones de tus técnicos especializados." }
    ]
  },
  tatuadores: {
    ...commonData,
    title: "Software para Tatuadores y Estudios de Tatuajes",
    subtitle: "Organiza tus citas, diseños y clientes. Fedrita te ayuda a gestionar tu arte para que solo te preocupes de crear piezas increíbles.",
    heroImageDescription: "Un tatuador trabajando en el brazo de un cliente en un estudio de tatuajes.",
    heroImage: "Tatuador con guantes negros trabajando meticulosamente en un tatuaje detallado en el brazo de un cliente.",
    benefitImage: "Cliente emocionado revisando diseños de tatuajes en una tablet junto al artista en un estudio de tatuajes con estilo.",
    features: [
      { title: "Gestión de Citas por Artista", description: "Cada artista de tu estudio puede gestionar su propia agenda y disponibilidad." },
      { title: "Formulario de Reserva Detallado", description: "Recoge información sobre la idea, tamaño, zona del cuerpo y referencias." },
      { title: "Depósitos y Pagos", description: "Solicita un depósito online para confirmar la cita y gestiona el pago final." },
      { title: "Galería de Trabajos (Portfolio)", description: "Integra tu portfolio para que los clientes vean tu estilo y trabajos anteriores." },
      { title: "Consentimientos y Cuidados", description: "Envía el formulario de consentimiento y las instrucciones de cuidado post-tatuaje." },
      { title: "Base de Datos de Clientes", description: "Mantén un registro de los tatuajes realizados a cada cliente y sus datos." }
    ]
  },
  logopedia: {
    ...commonData,
    title: "Software de Gestión para Gabinetes de Logopedia",
    subtitle: "Organiza tus sesiones, gestiona el progreso de los pacientes y simplifica la comunicación con las familias. Fedrita es tu aliado en la terapia del habla.",
    heroImageDescription: "Logopeda trabajando con un niño en una sala de terapia colorida, usando juegos y materiales didácticos.",
    heroImage: "Logopeda sonriente interactuando con un niño en una sesión de terapia, rodeados de materiales educativos.",
    benefitImage: "Padre revisando el progreso de su hijo en una tablet que muestra un informe de Fedrita en un entorno hogareño.",
    features: [
      { title: "Agenda Adaptada a Terapias", description: "Gestiona sesiones individuales y grupales con facilidad, estableciendo la recurrencia necesaria." },
      { title: "Historial Clínico y Evolución", description: "Registra notas de sesión, objetivos terapéuticos y avances de forma segura y estructurada." },
      { title: "Portal para Padres", description: "Comparte informes de progreso, materiales y pautas con las familias de forma privada y segura." },
      { title: "Recordatorios Automáticos", description: "Reduce el ausentismo en las terapias con notificaciones automáticas por WhatsApp." },
      { title: "Facturación Simplificada", description: "Gestiona pagos de sesiones privadas, bonos y genera facturas para entidades o seguros." },
      { title: "Gestión Documental Segura", description: "Almacena informes de evaluación, consentimientos y pruebas de forma centralizada y segura." }
    ]
  },
  psicologia_infantil: {
    ...commonData,
    title: "Software Especializado en Psicología Infantil",
    subtitle: "Dedica más tiempo a los más pequeños y menos a la administración. Fedrita te ofrece las herramientas para gestionar tu consulta de forma eficiente y segura.",
    heroImageDescription: "Psicóloga infantil jugando con un niño en un entorno de consulta cálido y seguro, lleno de juguetes.",
    heroImage: "Psicóloga infantil sentada en el suelo jugando con un niño en una sala de consulta acogedora y luminosa.",
    benefitImage: "Dos psicólogos colaborando y revisando el historial de un caso en un ordenador en su despacho profesional.",
    features: [
      { title: "Citas Familiares e Individuales", description: "Agenda fácilmente sesiones con el niño, los padres, o sesiones familiares conjuntas." },
      { title: "Notas de Sesión Confidenciales", description: "Documenta las sesiones con la máxima seguridad y privacidad, cumpliendo con la normativa LOPD/GDPR." },
      { title: "Comunicación Segura con Padres", description: "Comparte pautas, observaciones y feedback con los tutores a través de un canal seguro y privado." },
      { title: "Planificación de Evaluaciones", description: "Organiza todo el proceso de evaluación, desde la cita inicial hasta la entrega de informes." },
      { title: "Recordatorios Discretos", description: "Envía recordatorios de citas de forma profesional y discreta para proteger la confidencialidad." },
      { title: "Gestión de Consentimientos", description: "Digitaliza, solicita y almacena los consentimientos informados de los padres o tutores legales." }
    ]
  }
};