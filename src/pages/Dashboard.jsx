import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Mascota from '../components/Mascota'

const CATEGORIAS = ['Sustantivo', 'Verbo', 'Adjetivo', 'Expresión', 'General']
const LETRAS_NORUEGAS = ['æ', 'ø', 'å']
const PREFIJOS_GRAMATICALES = ['en ', 'ei ', 'et ', 'å ']
const META_DIARIA = 25

const PACKS_NORUEGO = [
  {
    id: 'a1_basico', titulo: 'Supervivencia en Noruega (A1)', descripcion: 'Sustantivos con su género y expresiones esenciales para el día a día.', icono: '🇳🇴',
    palabras: [
      { norwegian: 'en dag', spanish: 'un día', category: 'Sustantivo', ejemploNoruego: 'Ha en fin dag!', ejemploEspanol: '¡Que tengas un buen día!' }, 
      { norwegian: 'et hus', spanish: 'una casa', category: 'Sustantivo', ejemploNoruego: 'Vi bor i et stort hus.', ejemploEspanol: 'Vivimos en una casa grande.' },
      { norwegian: 'en bil', spanish: 'un coche', category: 'Sustantivo', ejemploNoruego: 'Han kjøpte en ny bil i går.', ejemploEspanol: 'Él compró un coche nuevo ayer.' }, 
      { norwegian: 'ei bok', spanish: 'un libro', category: 'Sustantivo', ejemploNoruego: 'Jeg leser ei spennende bok.', ejemploEspanol: 'Estoy leyendo un libro emocionante.' },
      { norwegian: 'tusen takk', spanish: 'muchas gracias', category: 'Expresión', ejemploNoruego: 'Tusen takk for hjelpen.', ejemploEspanol: 'Muchas gracias por la ayuda.' }, 
      { norwegian: 'beklager', spanish: 'lo siento / disculpa', category: 'Expresión', ejemploNoruego: 'Beklager, jeg er sen.', ejemploEspanol: 'Lo siento, llego tarde.' }
    ]
  },
  {
    id: 'verbos_clave', titulo: 'Verbos de Acción (Infinitivos)', descripcion: 'Los verbos más frecuentes del Bokmål con su marcador de infinitivo (å).', icono: '⚡',
    palabras: [
      { norwegian: 'å snakke', spanish: 'hablar', category: 'Verbo', ejemploNoruego: 'Jeg liker å snakke norsk.', ejemploEspanol: 'Me gusta hablar noruego.' }, 
      { norwegian: 'å forstå', spanish: 'entender', category: 'Verbo', ejemploNoruego: 'Forstår du hva jeg mener?', ejemploEspanol: '¿Entiendes lo que quiero decir?' },
      { norwegian: 'å jobbe', spanish: 'trabajar', category: 'Verbo', ejemploNoruego: 'Jeg skal jobbe i morgen.', ejemploEspanol: 'Voy a trabajar mañana.' }, 
      { norwegian: 'å kjøpe', spanish: 'comprar', category: 'Verbo', ejemploNoruego: 'Hva vil du kjøpe?', ejemploEspanol: '¿Qué quieres comprar?' }
    ]
  },
  {
    id: 'conversacion_b1', titulo: 'Conectores y Adjetivos (A2/B1)', descripcion: 'Palabras clave para enlazar frases y sonar natural al hablar.', icono: '💬',
    palabras: [
      { norwegian: 'kanskje', spanish: 'quizás / tal vez', category: 'Expresión', ejemploNoruego: 'Kanskje vi kan møtes i morgen.', ejemploEspanol: 'Quizás podamos vernos mañana.' },
      { norwegian: 'selvfølgelig', spanish: 'por supuesto', category: 'Expresión', ejemploNoruego: 'Selvfølgelig vil jeg hjelpe deg.', ejemploEspanol: 'Por supuesto que te ayudaré.' },
      { norwegian: 'egentlig', spanish: 'en realidad', category: 'Expresión', ejemploNoruego: 'Egentlig har jeg ikke tid.', ejemploEspanol: 'En realidad no tengo tiempo.' },
      { norwegian: 'vanskelig', spanish: 'difícil', category: 'Adjetivo', ejemploNoruego: 'Norsk er ikke så vanskelig.', ejemploEspanol: 'El noruego no es tan difícil.' },
      { norwegian: 'viktig', spanish: 'importante', category: 'Adjetivo', ejemploNoruego: 'Det er viktig å øve hver dag.', ejemploEspanol: 'Es importante practicar cada día.' },
      { norwegian: 'hyggelig', spanish: 'agradable / acogedor', category: 'Adjetivo', ejemploNoruego: 'Det var hyggelig å møte deg.', ejemploEspanol: 'Fue agradable conocerte.' },
      { norwegian: 'sliten', spanish: 'cansado / agotado', category: 'Adjetivo', ejemploNoruego: 'Jeg er veldig sliten i dag.', ejemploEspanol: 'Estoy muy cansado hoy.' },
      { norwegian: 'fornøyd', spanish: 'satisfecho / contento', category: 'Adjetivo', ejemploNoruego: 'Jeg er fornøyd med resultatet.', ejemploEspanol: 'Estoy satisfecho con el resultado.' }
    ]
  }
]

function Dashboard() {
  const [vocabulario, setVocabulario] = useState([])
  const [norwegian, setNorwegian] = useState('') 
  const [spanish, setSpanish] = useState('') 
  const [category, setCategory] = useState('Sustantivo')
  // NUEVO: Estados para los ejemplos al crear
  const [ejemploNoruego, setEjemploNoruego] = useState('')
  const [ejemploEspanol, setEjemploEspanol] = useState('')

  const [mensaje, setMensaje] = useState('')
  const [importandoPack, setImportandoPack] = useState(null)
  const [mostrarPacks, setMostrarPacks] = useState(false)
  
  const [editandoId, setEditandoId] = useState(null)
  const [editNorwegian, setEditNorwegian] = useState('')
  const [editSpanish, setEditSpanish] = useState('')
  const [editCategory, setEditCategory] = useState('')
  // NUEVO: Estados para los ejemplos al editar
  const [editEjemploNoruego, setEditEjemploNoruego] = useState('')
  const [editEjemploEspanol, setEditEjemploEspanol] = useState('')

  const [busqueda, setBusqueda] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('Todas')
  const [filtroNivel, setFiltroNivel] = useState('Todos')
  const [menuAbierto, setMenuAbierto] = useState(false)
  
  const [vista, setVista] = useState('diccionario') 
  const [rachaDias, setRachaDias] = useState(1)
  const [mostrarModalRacha, setMostrarModalRacha] = useState(false)
  const [ejerciciosHoy, setEjerciciosHoy] = useState(0)

  // --- ESTADOS DEL VESTIDOR (AVATAR) ---
  const [avatarConfig, setAvatarConfig] = useState(() => JSON.parse(localStorage.getItem('spark_avatar')) || { 
    raza: 'salchicha', color: 'marron', pelo: 'liso', ropa: 'ninguna', accesorio: 'ninguno' 
  })
  const [mostrarModalAvatar, setMostrarModalAvatar] = useState(false)
  const [pestanaVestidor, setPestanaVestidor] = useState('raza')

  const [modoJuego, setModoJuego] = useState('escritura') 
  const [modoInteligente, setModoInteligente] = useState(true)
  const [palabraActual, setPalabraActual] = useState(null)
  const [inputPractica, setInputPractica] = useState('')
  const [opcionesTest, setOpcionesTest] = useState([])
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('')
  const [mostrarCaraB, setMostrarCaraB] = useState(false)
  const [mostrarPistaOido, setMostrarPistaOido] = useState(false)
  const [estadoRespuesta, setEstadoRespuesta] = useState('idle') 
  const [rachaSesion, setRachaSesion] = useState(0)

  const [tiempoRestante, setTiempoRestante] = useState(60)
  const [sprintActivo, setSprintActivo] = useState(false)
  const [sprintTerminado, setSprintTerminado] = useState(false)
  const [puntosSprint, setPuntosSprint] = useState(0)
  const [recordSprint, setRecordSprint] = useState(() => parseInt(localStorage.getItem('spark_record_sprint') || '0', 10))

  const navigate = useNavigate()

  const pronunciar = (texto) => {
    if (!texto) return
    const voces = 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : []
    const vozNoruega = voces.find(v => v.lang.toLowerCase().startsWith('nb') || v.lang.toLowerCase().startsWith('no') || v.lang.toLowerCase().startsWith('nn'))
    if (vozNoruega) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(texto)
      utterance.voice = vozNoruega
      utterance.lang = vozNoruega.lang
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    } else {
      const url = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=no&q=${encodeURIComponent(texto)}`
      const audio = new Audio(url)
      audio.playbackRate = 0.95
      audio.play().catch(err => console.error('Error al reproducir voz noruega:', err))
    }
  }

  const cargarVocabulario = async (token) => {
    try {
      const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/vocab`, { headers: { 'Authorization': `Bearer ${token}` } })
      if (respuesta.ok) setVocabulario(await respuesta.json())
    } catch (error) { console.error('Error de conexión:', error) }
  }

  const verificarRachaDiaria = async (token) => {
    try {
      const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/vocab/racha`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } })
      if (respuesta.ok) {
        const datos = await respuesta.json()
        setRachaDias(datos.rachaDias || 1)
        if (datos.recompensaHoy) setMostrarModalRacha(true)
      }
    } catch (error) { console.error('Error racha:', error) }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/login')
    else {
      cargarVocabulario(token)
      verificarRachaDiaria(token)
      const claveHoy = `spark_meta_${new Date().toISOString().slice(0, 10)}`
      setEjerciciosHoy(parseInt(localStorage.getItem(claveHoy) || '0', 10))
    }
  }, [navigate])

  useEffect(() => {
    if (!sprintActivo) return
    if (tiempoRestante <= 0) {
      setSprintActivo(false)
      setSprintTerminado(true)
      if (puntosSprint > recordSprint) {
        setRecordSprint(puntosSprint)
        localStorage.setItem('spark_record_sprint', puntosSprint.toString())
      }
      return
    }
    const timer = setTimeout(() => setTiempoRestante(prev => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [sprintActivo, tiempoRestante, puntosSprint, recordSprint])

  const sumarEjercicioDiario = () => {
    const claveHoy = `spark_meta_${new Date().toISOString().slice(0, 10)}`
    const nuevoTotal = ejerciciosHoy + 1
    setEjerciciosHoy(nuevoTotal)
    localStorage.setItem(claveHoy, nuevoTotal.toString())
  }

  const guardarAccesorioAvatar = (categoria, valor) => {
    const nuevaConfig = { ...avatarConfig, [categoria]: valor }
    setAvatarConfig(nuevaConfig)
    localStorage.setItem('spark_avatar', JSON.stringify(nuevaConfig))
  }

  const OBJETIVO_ACIERTOS_DOMINIO = 25
  const calcularNivel = (item) => {
    const aciertos = item.aciertos || 0; const fallos = item.fallos || 0; const total = aciertos + fallos; const ratio = total > 0 ? aciertos / total : 0
    if (total === 0) return { etiqueta: 'Nueva', color: 'bg-stone-100 text-stone-600', porcentaje: 4 }
    if (fallos > aciertos || (total >= 3 && ratio < 0.6)) return { etiqueta: 'Difícil', color: 'bg-rose-100 text-rose-700', porcentaje: Math.max(12, Math.round(ratio * 40)) }
    if (aciertos >= OBJETIVO_ACIERTOS_DOMINIO && ratio >= 0.9) return { etiqueta: 'Dominada', color: 'bg-emerald-100 text-emerald-700', porcentaje: 100 }
    if (aciertos >= 15) return { etiqueta: 'Consolidando', color: 'bg-sky-100 text-sky-700', porcentaje: Math.min(95, Math.round((aciertos / OBJETIVO_ACIERTOS_DOMINIO) * 100)) }
    if (aciertos >= 6) return { etiqueta: 'Reteniendo', color: 'bg-indigo-100 text-indigo-700', porcentaje: Math.round((aciertos / OBJETIVO_ACIERTOS_DOMINIO) * 100) }
    return { etiqueta: 'Reconociendo', color: 'bg-amber-100 text-amber-700', porcentaje: Math.max(15, Math.round((aciertos / OBJETIVO_ACIERTOS_DOMINIO) * 100)) }
  }

  const totalAciertosGlobal = vocabulario.reduce((acc, item) => acc + (item.aciertos || 0), 0)
  const totalFallosGlobal = vocabulario.reduce((acc, item) => acc + (item.fallos || 0), 0)
  const totalIntentosGlobal = totalAciertosGlobal + totalFallosGlobal
  const precisionGlobal = totalIntentosGlobal > 0 ? Math.round((totalAciertosGlobal / totalIntentosGlobal) * 100) : 0
  const puntosXP = (vocabulario.length * 5) + (totalAciertosGlobal * 10) + (rachaDias * 25)
  
  const obtenerRangoNoruego = (xp, numPalabras) => {
    if (xp >= 250000 && numPalabras >= 5000) return { titulo: 'Norsk Mester (C2)', icono: '👑', min: 250000, proximo: 500000, reqPalabras: 5000 }
    if (xp >= 120000 && numPalabras >= 3000) return { titulo: 'Viking Skald (C1)', icono: '⚔️', min: 120000, proximo: 250000, reqPalabras: 5000 }
    if (xp >= 55000 && numPalabras >= 1800)  return { titulo: 'Fjellvandrer (B2)', icono: '🏔️', min: 55000, proximo: 120000, reqPalabras: 3000 }
    if (xp >= 25000 && numPalabras >= 1000)  return { titulo: 'Samtalepartner (B1)', icono: '💬', min: 25000, proximo: 55000, reqPalabras: 1800 }
    if (xp >= 10000 && numPalabras >= 500)   return { titulo: 'Utforsker (A2)', icono: '🧭', min: 10000, proximo: 25000, reqPalabras: 1000 }
    if (xp >= 3000 && numPalabras >= 150)    return { titulo: 'Nybegynner (A1)', icono: '🌱', min: 3000, proximo: 10000, reqPalabras: 500 }
    return { titulo: 'Turist (A0)', icono: '🎒', min: 0, proximo: 3000, reqPalabras: 150 }
  }

  const rangoActual = obtenerRangoNoruego(puntosXP, vocabulario.length)
  const progresoRango = Math.min(100, Math.round(((puntosXP - rangoActual.min) / (rangoActual.proximo - rangoActual.min)) * 100))

  const handleAgregar = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vocab`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
        body: JSON.stringify({ 
          norwegian, 
          spanish, 
          category,
          ejemploNoruego,
          ejemploEspanol
        }) 
      })
      if (res.ok) { 
        setNorwegian(''); setSpanish(''); setEjemploNoruego(''); setEjemploEspanol(''); cargarVocabulario(token); 
        setMensaje('Añadida (+5 XP).'); setTimeout(() => setMensaje(''), 3000) 
      }
    } catch (error) { console.error('Error:', error) }
  }

  const handleImportarPack = async (pack) => {
    const token = localStorage.getItem('token'); setImportandoPack(pack.id); setMensaje('Importando...')
    const existentes = new Set(vocabulario.map(v => v.norwegian.toLowerCase().trim()))
    const nuevas = pack.palabras.filter(p => !existentes.has(p.norwegian.toLowerCase().trim()))
    if (nuevas.length === 0) { setMensaje(`Ya tienes el pack.`); setImportandoPack(null); setTimeout(() => setMensaje(''), 4000); return }
    try {
      let guardadas = 0;
      for (const item of nuevas) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vocab`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(item) })
        if (res.status === 401) { alert("Sesión caducada."); setMensaje(''); setImportandoPack(null); return }
        if (res.ok) guardadas++;
      }
      await cargarVocabulario(token); setMensaje(`Éxito: ${guardadas} palabras.`); setTimeout(() => setMensaje(''), 4000)
    } catch (error) { setMensaje('❌ Error de conexión.') } finally { setImportandoPack(null) }
  }

  const iniciarEdicion = (item) => { 
    setEditandoId(item._id); 
    setEditNorwegian(item.norwegian); 
    setEditSpanish(item.spanish); 
    setEditCategory(item.category || 'General');
    setEditEjemploNoruego(item.ejemploNoruego || '');
    setEditEjemploEspanol(item.ejemploEspanol || '');
  }
  
  const cancelarEdicion = () => { 
    setEditandoId(null); setEditNorwegian(''); setEditSpanish(''); setEditCategory(''); setEditEjemploNoruego(''); setEditEjemploEspanol('') 
  }

  const handleEditar = async (e, id) => {
    e.preventDefault(); const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vocab/${id}`, { 
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
        body: JSON.stringify({ 
          norwegian: editNorwegian, 
          spanish: editSpanish, 
          category: editCategory,
          ejemploNoruego: editEjemploNoruego,
          ejemploEspanol: editEjemploEspanol
        }) 
      })
      if (res.ok) { await cargarVocabulario(token); cancelarEdicion(); setMensaje('Actualizada.'); setTimeout(() => setMensaje(''), 3000) }
    } catch (error) { console.error('Error editar:', error) }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Borrar permanente?')) return
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vocab/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
      if (res.ok) setVocabulario(vocabulario.filter(item => item._id !== id))
    } catch (error) { console.error('Error:', error) }
  }

  const cerrarSesion = () => { localStorage.removeItem('token'); navigate('/login') }

  const elegirSiguientePalabra = (lista = vocabulario, modoForzado = modoJuego, palabraEspecifica = null) => {
    if (lista.length === 0) return
    let seleccionada = palabraEspecifica
    if (!seleccionada) {
      if (modoInteligente) {
        const bolsa = []
        lista.forEach((item) => {
          const peso = Math.max(1, ((item.fallos || 0) * 4) + OBJETIVO_ACIERTOS_DOMINIO - Math.min(24, (item.aciertos || 0)))
          for (let i = 0; i < peso; i++) bolsa.push(item)
        })
        seleccionada = bolsa[Math.floor(Math.random() * bolsa.length)]
      } else seleccionada = lista[Math.floor(Math.random() * lista.length)]
    }
    setPalabraActual(seleccionada); setInputPractica(''); setOpcionSeleccionada(''); setMostrarCaraB(false); setMostrarPistaOido(false); setEstadoRespuesta('idle')
    if (modoForzado === 'oido' && seleccionada) setTimeout(() => pronunciar(seleccionada.norwegian), 200)
    if (lista.length >= 4) {
      const distractores = lista.filter(item => item._id !== seleccionada._id).sort(() => 0.5 - Math.random()).slice(0, 3)
      setOpcionesTest([...distractores, seleccionada].sort(() => 0.5 - Math.random()))
    }
  }

  const iniciarPractica = (palabraEspecifica = null) => { setVista('practica'); setMenuAbierto(false); setSprintActivo(false); setSprintTerminado(false); if (vocabulario.length >= 4 || palabraEspecifica) elegirSiguientePalabra(vocabulario, modoJuego, palabraEspecifica) }
  const iniciarSprint = () => { setPuntosSprint(0); setTiempoRestante(60); setSprintTerminado(false); setSprintActivo(true); elegirSiguientePalabra(vocabulario, 'contrarreloj') }

  const registrarResultadoAPI = async (esCorrecto, avanzarAuto = false) => {
    setEstadoRespuesta(esCorrecto ? 'acierto' : 'fallo'); setRachaSesion(prev => esCorrecto ? prev + 1 : 0); sumarEjercicioDiario()
    if (esCorrecto && !avanzarAuto) pronunciar(palabraActual.norwegian)
    const token = localStorage.getItem('token')
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/vocab/${palabraActual._id}/intento`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ resultado: esCorrecto ? 'acierto' : 'fallo' }) })
      cargarVocabulario(token)
    } catch (error) { console.error('Error estadística:', error) }
    if (avanzarAuto) { if (esCorrecto) setPuntosSprint(prev => prev + 1); setTimeout(() => elegirSiguientePalabra(vocabulario, 'contrarreloj'), 320) }
  }

  const comprobarEscritura = (e) => { e.preventDefault(); if (!inputPractica.trim() || !palabraActual) return; registrarResultadoAPI(inputPractica.trim().toLowerCase() === palabraActual.norwegian.toLowerCase(), false) }
  const comprobarTest = (opcion) => { if (estadoRespuesta !== 'idle' || !palabraActual) return; setOpcionSeleccionada(opcion._id); registrarResultadoAPI(opcion._id === palabraActual._id, modoJuego === 'contrarreloj') }
  const insertarPrefijoGramatical = (prefijo) => setNorwegian(prev => prefijo + prev.replace(/^(en |ei |et |å )/i, ''))

  const palabrasFiltradas = vocabulario.filter(item => {
    const coincideTexto = item.norwegian.toLowerCase().includes(busqueda.toLowerCase()) || item.spanish.toLowerCase().includes(busqueda.toLowerCase())
    const coincideCategoria = filtroCategoria === 'Todas' || (item.category || 'General') === filtroCategoria
    const nivel = calcularNivel(item).etiqueta
    const coincideNivel = filtroNivel === 'Todos' || (filtroNivel === 'Dificiles' && nivel === 'Difícil') || (filtroNivel === 'Dominadas' && nivel === 'Dominada')
    return coincideTexto && coincideCategoria && coincideNivel
  })

  const palabrasDominadas = vocabulario.filter(i => calcularNivel(i).etiqueta === 'Dominada')
  const palabrasMasCostosas = [...vocabulario].filter(i => (i.fallos || 0) > 0).sort((a, b) => ((b.fallos || 0) - (b.aciertos || 0)) - ((a.fallos || 0) - (a.aciertos || 0))).slice(0, 5)
  const palabrasMejorAprendidas = [...vocabulario].filter(i => (i.aciertos || 0) > 0).sort((a, b) => (b.aciertos || 0) - (a.aciertos || 0)).slice(0, 5)

  const distribucionCategorias = CATEGORIAS.map(cat => ({
    nombre: cat, cantidad: vocabulario.filter(v => (v.category || 'General') === cat).length, porcentaje: vocabulario.length > 0 ? (vocabulario.filter(v => (v.category || 'General') === cat).length / vocabulario.length) * 100 : 0
  })).sort((a, b) => b.cantidad - a.cantidad);

  const mapaConstancia = Array.from({ length: 30 }, (_, i) => { return (30 - i) <= rachaDias });

  const logros = [
    { id: 1, tier: 'Bronce', categoria: 'Léxico', titulo: 'Vocabulario de Supervivencia', desc: 'Registra tus primeras 100 palabras en noruego', icono: '🌱', actual: vocabulario.length, objetivo: 100, cumplido: vocabulario.length >= 100 },
    { id: 2, tier: 'Plata', categoria: 'Léxico', titulo: 'Base Conversacional (A1/A2)', desc: 'Alcanza las 500 palabras en tu diccionario personal', icono: '🎒', actual: vocabulario.length, objetivo: 500, cumplido: vocabulario.length >= 500 },
    { id: 3, tier: 'Oro', categoria: 'Léxico', titulo: 'Fluidez Intermedia (B1/B2)', desc: 'Construye un repertorio sólido de 2.000 palabras y expresiones', icono: '⛵', actual: vocabulario.length, objetivo: 2000, cumplido: vocabulario.length >= 2000 },
    { id: 4, tier: 'Diamante', categoria: 'Léxico', titulo: 'Léxico Avanzado (Nivel C1)', desc: 'Alcanza el hito profesional de 5.000 términos en tu diccionario', icono: '📚', actual: vocabulario.length, objetivo: 5000, cumplido: vocabulario.length >= 5000 },
    { id: 5, tier: 'Bronce', categoria: 'Constancia', titulo: 'Mes de Disciplina', desc: 'Entra y practica durante 30 días seguidos sin romper la racha', icono: '🔥', actual: rachaDias, objetivo: 30, cumplido: rachaDias >= 30 },
    { id: 6, tier: 'Oro', categoria: 'Constancia', titulo: 'Trimestre Inquebrantable', desc: 'Mantén tu hábito de estudio durante 100 días consecutivos', icono: '⚡', actual: rachaDias, objetivo: 100, cumplido: rachaDias >= 100 },
    { id: 7, tier: 'Diamante', categoria: 'Constancia', titulo: 'Un Año en Noruega (365 Días)', desc: 'Completa un año entero (365 días seguidos) estudiando el idioma', icono: '☀️', actual: rachaDias, objetivo: 365, cumplido: rachaDias >= 365 },
    { id: 8, tier: 'Bronce', categoria: 'Dominio', titulo: 'Retención Sólida', desc: 'Domina 50 palabras (mín. 25 aciertos y 90% de precisión en cada una)', icono: '🧠', actual: palabrasDominadas.length, objetivo: 50, cumplido: palabrasDominadas.length >= 50 },
    { id: 9, tier: 'Oro', categoria: 'Dominio', titulo: 'Memoria Permanente', desc: 'Domina 500 palabras demostrando precisión a largo plazo', icono: '🛡️', actual: palabrasDominadas.length, objetivo: 500, cumplido: palabrasDominadas.length >= 500 },
    { id: 10, tier: 'Diamante', categoria: 'Dominio', titulo: 'Dominio del Bokmål', desc: 'Consolida 2.000 palabras en estado Dominada (25+ aciertos cada una)', icono: '👑', actual: palabrasDominadas.length, objetivo: 2000, cumplido: palabrasDominadas.length >= 2000 },
    { id: 11, tier: 'Oro', categoria: 'Práctica', titulo: '10.000 Repeticiones', desc: 'Acumula 10.000 respuestas correctas en el Centro de Entrenamiento', icono: '🏋️', actual: totalAciertosGlobal, objetivo: 10000, cumplido: totalAciertosGlobal >= 10000 },
    { id: 12, tier: 'Plata', categoria: 'Velocidad', titulo: 'Reflejo Nativo (Contrarreloj)', desc: 'Acierta al menos 25 palabras en un solo minuto en el modo Contrarreloj', icono: '⏱️', actual: recordSprint, objetivo: 25, cumplido: recordSprint >= 25 }
  ]
  const coloresTier = { Bronce: 'bg-orange-100 text-orange-800 border-orange-200', Plata: 'bg-stone-200 text-stone-800 border-stone-300', Oro: 'bg-amber-100 text-amber-800 border-amber-300', Diamante: 'bg-sky-100 text-sky-800 border-sky-300' }

  // --- CONFIGURACIÓN DEL VESTIDOR (DESBLOQUEOS) ---
  const opcionesVestidor = {
    raza: [
      { id: 'salchicha', nombre: 'Dachshund', reqXP: 0 },
      { id: 'pug', nombre: 'Pug', reqXP: 100 },
      { id: 'shiba', nombre: 'Shiba Inu', reqXP: 500 },
      { id: 'terrier', nombre: 'Terrier', reqXP: 1000 }
    ],
    color: [
      { id: 'marron', nombre: 'Marrón Clásico', reqXP: 0, hex: '#8b5a2b' },
      { id: 'negro', nombre: 'Negro Azabache', reqXP: 250, hex: '#292524' },
      { id: 'dorado', nombre: 'Dorado', reqXP: 800, hex: '#fbbf24' },
      { id: 'nieve', nombre: 'Blanco Nieve', reqXP: 2000, hex: '#f5f5f4' }
    ],
    pelo: [
      { id: 'liso', nombre: 'Pelo Liso', reqXP: 0 },
      { id: 'rizado', nombre: 'Despeinado', reqXP: 300 }
    ],
    ropa: [
      { id: 'ninguna', nombre: 'Sin Ropa', reqXP: 0 },
      { id: 'bufanda', nombre: 'Bufanda Bosque', reqXP: 600 },
      { id: 'chubasquero', nombre: 'Chubasquero Fiordo', reqXP: 1500 },
      { id: 'lusekofte', nombre: 'Jersey Lusekofte', reqXP: 4000 }
    ],
    accesorio: [
      { id: 'ninguno', nombre: 'Sin Accesorio', reqXP: 0 },
      { id: 'gafas', nombre: 'Gafas Intelectual', reqXP: 800 },
      { id: 'gorro', nombre: 'Gorro Invierno', reqXP: 2500 },
      { id: 'auriculares', nombre: 'Cascos Rojos', reqXP: 6000 },
      { id: 'corona', nombre: 'Corona Maestro', reqXP: 25000 }
    ]
  }
  return (
    <div className="flex h-screen bg-stone-50 font-sans text-stone-800 overflow-hidden relative">
      
      {/* MODAL RECOMPENSA */}
      {mostrarModalRacha && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl border border-stone-100">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-inner">🔥</div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full">Constancia Diaria</span>
            <h3 className="text-2xl font-extrabold text-stone-900 mt-3 mb-2">¡{rachaDias} {rachaDias === 1 ? 'día' : 'días'} en racha!</h3>
            <p className="text-stone-500 text-sm mb-6">Dominar el noruego es una maratón de meses. Has sumado <strong>+25 XP</strong> y tu objetivo de hoy son {META_DIARIA} ejercicios.</p>
            <button onClick={() => setMostrarModalRacha(false)} className="w-full bg-stone-950 hover:bg-stone-800 text-white font-semibold py-3.5 rounded-2xl transition-all shadow-md">Continuar (+25 XP)</button>
          </div>
        </div>
      )}

{/* MODAL PERSONALIZAR AVATAR */}
      {mostrarModalAvatar && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 sm:p-8">
          <div className="bg-white rounded-3xl max-w-4xl w-full flex flex-col md:flex-row overflow-hidden shadow-2xl h-[90vh] md:h-[600px]">
            <div className="md:w-1/3 bg-gradient-to-b from-stone-100 to-stone-200 p-8 flex flex-col items-center justify-center border-r border-stone-200 relative shrink-0">
              <div className="w-full max-w-[200px] aspect-square relative z-10"><Mascota {...avatarConfig} xp={puntosXP} /></div>
              <div className="mt-8 text-center w-full bg-white/60 p-4 rounded-2xl backdrop-blur-sm border border-white/50">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">XP Disponible</p>
                <p className="text-3xl font-black text-amber-600">{puntosXP} <span className="text-sm">XP</span></p>
              </div>
            </div>
            <div className="md:w-2/3 flex flex-col bg-white overflow-hidden">
              <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
                <h3 className="text-xl font-bold text-stone-900">Personaliza tu Guía</h3>
                <button onClick={() => setMostrarModalAvatar(false)} className="text-stone-400 hover:text-stone-900 p-2 text-2xl leading-none">✕</button>
              </div>
              <div className="flex overflow-x-auto p-4 gap-2 border-b border-stone-100 bg-stone-50 shrink-0">
                {[{ id: 'raza', icon: '🐶', label: 'Raza' }, { id: 'color', icon: '🎨', label: 'Color' }, { id: 'pelo', icon: '✂️', label: 'Pelo' }, { id: 'ropa', icon: '👕', label: 'Ropa' }, { id: 'accesorio', icon: '🎩', label: 'Acces.' }].map(tab => (
                  <button key={tab.id} onClick={() => setPestanaVestidor(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${pestanaVestidor === tab.id ? 'bg-stone-900 text-white shadow-md' : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-100'}`}>
                    <span>{tab.icon}</span> {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto p-6 bg-stone-50/50">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {opcionesVestidor[pestanaVestidor] && opcionesVestidor[pestanaVestidor].map(item => {
                    const desbloqueado = puntosXP >= item.reqXP;
                    const activo = avatarConfig[pestanaVestidor] === item.id;
                    return (
                      <button
                        key={item.id}
                        disabled={!desbloqueado}
                        onClick={() => guardarAccesorioAvatar(pestanaVestidor, item.id)}
                        className={`relative p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 text-center transition-all min-h-[120px] ${
                          activo ? 'border-amber-500 bg-amber-50 shadow-md ring-4 ring-amber-500/20' : 
                          desbloqueado ? 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm' : 
                          'border-stone-100 bg-stone-100/50 opacity-60 cursor-not-allowed grayscale'
                        }`}
                      >
                        <div className="w-12 h-12 flex items-center justify-center">
                          {pestanaVestidor === 'color' ? (
                            <div className="w-8 h-8 rounded-full shadow-inner border-2 border-stone-200" style={{ backgroundColor: item.hex }}></div>
                          ) : (
                            <div className="w-full h-full opacity-80 pointer-events-none">
                              <Mascota 
                                {...avatarConfig} 
                                raza={pestanaVestidor === 'raza' ? item.id : avatarConfig.raza}
                                ropa={pestanaVestidor === 'ropa' ? item.id : 'ninguna'}
                                accesorio={pestanaVestidor === 'accesorio' ? item.id : 'ninguno'}
                                pelo={pestanaVestidor === 'pelo' ? item.id : avatarConfig.pelo}
                                xp={1000000} 
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${activo ? 'text-amber-900' : 'text-stone-700'}`}>{item.nombre}</p>
                          <p className={`text-[10px] font-semibold mt-1 uppercase tracking-wider ${desbloqueado ? (activo ? 'text-amber-600' : 'text-stone-400') : 'text-rose-500 flex items-center justify-center gap-1'}`}>
                            {desbloqueado ? (activo ? 'Equipado' : 'Disponible') : <>🔒 {item.reqXP} XP</>}
                          </p>
                        </div>
                        {activo && <div className="absolute -top-2 -right-2 bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm text-sm">✓</div>}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={`fixed inset-0 bg-black/60 z-20 md:hidden transition-opacity duration-300 ${menuAbierto ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMenuAbierto(false)} />

      {/* Sidebar */}
      <aside className={`fixed md:relative inset-y-0 left-0 z-30 w-64 bg-stone-950 text-stone-300 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${menuAbierto ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-400 text-stone-950 rounded-lg flex items-center justify-center font-black text-lg shadow-sm">S</div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide leading-none">Spark</h1>
              <span className="text-[11px] text-stone-400">{rangoActual.icono} {rangoActual.titulo}</span>
            </div>
          </div>
          <button className="md:hidden text-stone-400 hover:text-white" onClick={() => setMenuAbierto(false)}>✕</button>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <button onClick={() => { setVista('diccionario'); setSprintActivo(false); setMenuAbierto(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${vista === 'diccionario' ? 'bg-stone-800 text-white font-medium' : 'hover:bg-stone-900 hover:text-white'}`}>📚 Diccionario</button>
          <button onClick={() => iniciarPractica()} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${vista === 'practica' ? 'bg-stone-800 text-white font-medium' : 'hover:bg-stone-900 hover:text-white'}`}>🎯 Entrenamiento</button>
          <button onClick={() => { setVista('progreso'); setSprintActivo(false); setMenuAbierto(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${vista === 'progreso' ? 'bg-stone-800 text-white font-medium' : 'hover:bg-stone-900 hover:text-white'}`}>📊 Mi Progreso</button>
        </nav>

        <div className="mx-4 mb-4 p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-3">
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5"><span className="text-stone-400 font-medium">Meta diaria</span><span className="text-amber-400 font-bold">{Math.min(ejerciciosHoy, META_DIARIA)} / {META_DIARIA}</span></div>
            <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden"><div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${Math.min(100, (ejerciciosHoy / META_DIARIA) * 100)}%` }} /></div>
          </div>
          <div className="pt-2 border-t border-stone-800">
            <div className="flex justify-between items-center text-xs mb-1"><span className="text-stone-400">XP Rango</span><span className="text-white font-bold">{puntosXP}</span></div>
            <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden"><div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${progresoRango}%` }} /></div>
          </div>
        </div>
        <div className="p-4 border-t border-stone-800">
          <button onClick={cerrarSesion} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-all">Cerrar sesión</button>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-stone-200 px-4 md:px-10 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-stone-600 hover:text-stone-900 -ml-1 p-1" onClick={() => setMenuAbierto(true)}>☰</button>
            <h2 className="text-xl md:text-2xl font-semibold text-stone-900">
              {vista === 'diccionario' ? 'Tu Diccionario' : vista === 'practica' ? 'Entrenamiento' : 'Estadísticas y Análisis'}
            </h2>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {vista === 'diccionario' && (
              <>
                <button onClick={() => setMostrarPacks(!mostrarPacks)} className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shrink-0">📦 {mostrarPacks ? 'Ocultar Packs' : 'Packs Noruego'}</button>
                <div className="relative flex-1 sm:w-60">
                  <input type="text" placeholder="Buscar palabra..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full pl-4 pr-4 py-2 bg-stone-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-stone-950 outline-none transition-all" />
                </div>
              </>
            )}
            <div onClick={() => setMostrarModalRacha(true)} className="cursor-pointer flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0" title="Tu racha diaria">🔥 {rachaDias} {rachaDias === 1 ? 'día' : 'días'}</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10">
          
          {/* ================= VISTA 1: DICCIONARIO ================= */}
          {vista === 'diccionario' && (
            <div className="max-w-5xl mx-auto space-y-6">
              
              {mostrarPacks && (
                <section className="bg-stone-900 text-white p-6 rounded-2xl shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base">📦 Biblioteca de Packs (Bokmål)</h3>
                      <p className="text-xs text-stone-400">Importa vocabulario esencial en 1 clic. Se omiten duplicados automáticamente.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PACKS_NORUEGO.map(pack => (
                      <div key={pack.id} className="bg-stone-800/90 border border-stone-700 p-4 rounded-xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{pack.icono}</span>
                            <span className="text-[11px] font-bold bg-stone-700 text-stone-300 px-2.5 py-0.5 rounded-full">{pack.palabras.length} palabras</span>
                          </div>
                          <h4 className="font-bold text-sm text-white">{pack.titulo}</h4>
                          <p className="text-xs text-stone-400 mt-1">{pack.descripcion}</p>
                        </div>
                        <button onClick={() => handleImportarPack(pack)} disabled={importandoPack !== null} className="mt-4 w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-stone-950 font-bold text-xs py-2.5 rounded-lg transition-all">
                          {importandoPack === pack.id ? 'Importando...' : '+ Añadir pack a mi diccionario'}
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Formulario NUEVO: Con campos de ejemplos opcionales */}
              <section className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-stone-200/80">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Añadir vocabulario</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1"><span className="text-xs text-stone-400 mr-1">Gramática:</span>{PREFIJOS_GRAMATICALES.map(pref => (<button key={pref} type="button" onClick={() => insertarPrefijoGramatical(pref)} className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-400 text-amber-900 border border-amber-200 font-bold text-xs transition-colors">+{pref.trim()}</button>))}</div>
                    <div className="flex items-center gap-1"><span className="text-xs text-stone-400 mr-1">Letras:</span>{LETRAS_NORUEGAS.map(letra => (<button key={letra} type="button" onClick={() => setNorwegian(prev => prev + letra)} className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-700 font-semibold text-sm transition-colors">{letra}</button>))}</div>
                  </div>
                </div>
                <form onSubmit={handleAgregar} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <input type="text" placeholder="Noruego (ej. å snakke)" value={norwegian} onChange={(e) => setNorwegian(e.target.value)} required className="md:col-span-5 bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-stone-950 font-bold" />
                    <input type="text" placeholder="Español (ej. hablar)" value={spanish} onChange={(e) => setSpanish(e.target.value)} required className="md:col-span-5 bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-stone-950" />
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="md:col-span-2 bg-stone-50 border border-stone-200 px-3 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-stone-950">
                      {CATEGORIAS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  {/* CAMPOS OPCIONALES DE EJEMPLO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input type="text" placeholder="Frase de ejemplo en noruego (Opcional)" value={ejemploNoruego} onChange={(e) => setEjemploNoruego(e.target.value)} className="bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-stone-950 italic" />
                    <input type="text" placeholder="Traducción del ejemplo (Opcional)" value={ejemploEspanol} onChange={(e) => setEjemploEspanol(e.target.value)} className="bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-stone-950 italic" />
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="bg-stone-950 hover:bg-stone-800 text-white font-medium px-8 py-3 rounded-xl transition-all shadow-sm">Guardar Palabra</button>
                  </div>
                </form>
                {mensaje && <p className={`text-sm mt-3 font-medium ${mensaje.includes('❌') ? 'text-rose-600' : 'text-emerald-600'}`}>{mensaje}</p>}
              </section>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {['Todas', ...CATEGORIAS].map(cat => (
                    <button key={cat} onClick={() => setFiltroCategoria(cat)} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${filtroCategoria === cat ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'}`}>{cat}</button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {['Todos', 'Dificiles', 'Dominadas'].map(niv => (
                    <button key={niv} onClick={() => setFiltroNivel(niv)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${filtroNivel === niv ? 'bg-stone-200 text-stone-900 font-bold' : 'text-stone-500 hover:text-stone-800'}`}>{niv === 'Dificiles' ? '⚠️ Difíciles' : niv === 'Dominadas' ? '✅ Dominadas' : 'Todas'}</button>
                  ))}
                </div>
              </div>

              <section>
                {palabrasFiltradas.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-200">
                    <p className="text-stone-400 mb-3">No hay palabras que coincidan con este filtro.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {palabrasFiltradas.map((item) => {
                      const infoNivel = calcularNivel(item); const estaEditando = editandoId === item._id
                      return (
                        <div key={item._id} className="group bg-white p-5 rounded-2xl border border-stone-200/70 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                          {estaEditando ? (
                            <form onSubmit={(e) => handleEditar(e, item._id)} className="flex flex-col gap-2">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Editando palabra</h4>
                              <input type="text" value={editNorwegian} onChange={(e) => setEditNorwegian(e.target.value)} required className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-lg text-sm font-bold" />
                              <input type="text" value={editSpanish} onChange={(e) => setEditSpanish(e.target.value)} required className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-lg text-sm" />
                              <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-lg text-sm">{CATEGORIAS.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select>
                              {/* Editar frases de ejemplo */}
                              <input type="text" placeholder="Ejemplo en noruego" value={editEjemploNoruego} onChange={(e) => setEditEjemploNoruego(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-lg text-xs italic mt-1" />
                              <input type="text" placeholder="Traducción" value={editEjemploEspanol} onChange={(e) => setEditEjemploEspanol(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-lg text-xs italic" />
                              <div className="flex gap-2 mt-2">
                                <button type="submit" className="flex-1 bg-stone-950 text-white text-xs font-bold py-2 rounded-lg hover:bg-stone-800">Guardar</button>
                                <button type="button" onClick={cancelarEdicion} className="flex-1 bg-stone-100 text-stone-700 text-xs font-bold py-2 rounded-lg hover:bg-stone-200">Cancelar</button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-3">
                                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 bg-stone-100 px-2.5 py-0.5 rounded-md">{item.category || 'General'}</span>
                                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${infoNivel.color}`}>{infoNivel.etiqueta}</span>
                                </div>
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 w-full">
                                    <div className="flex items-center gap-2"><p className="text-xl font-bold text-stone-900 truncate">{item.norwegian}</p><button onClick={() => pronunciar(item.norwegian)} className="text-stone-400 hover:text-stone-900 p-1 rounded-full hover:bg-stone-100">🔊</button></div>
                                    <p className="text-stone-500 capitalize truncate">{item.spanish}</p>
                                    
                                    {/* MOSTRAR EJEMPLOS SI LOS HAY */}
                                    {(item.ejemploNoruego || item.ejemploEspanol) && (
                                      <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs">
                                        {item.ejemploNoruego && <p className="font-semibold text-stone-800 italic">"{item.ejemploNoruego}" <button onClick={() => pronunciar(item.ejemploNoruego)} className="ml-1 text-stone-400 hover:text-stone-900">🔊</button></p>}
                                        {item.ejemploEspanol && <p className="text-stone-500 mt-0.5">{item.ejemploEspanol}</p>}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-col items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all shrink-0">
                                    <button onClick={() => iniciarEdicion(item)} className="text-stone-300 hover:text-amber-500 p-1.5">✏️</button>
                                    <button onClick={() => handleEliminar(item._id)} className="text-stone-300 hover:text-rose-500 p-1.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 pt-3 border-t border-stone-100">
                                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mb-2"><div className={`h-full transition-all duration-500 ${infoNivel.etiqueta === 'Dominada' ? 'bg-emerald-500' : infoNivel.etiqueta === 'Difícil' ? 'bg-rose-500' : infoNivel.etiqueta === 'Consolidando' ? 'bg-sky-500' : 'bg-amber-400'}`} style={{ width: `${infoNivel.porcentaje}%` }} /></div>
                                <div className="flex items-center justify-between text-xs text-stone-400"><span>Dominio: <strong className="text-stone-700">{item.aciertos || 0}/{OBJETIVO_ACIERTOS_DOMINIO}</strong></span><span>Fallos: <strong className="text-stone-700">{item.fallos || 0}</strong></span></div>
                              </div>
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* ================= VISTA 2: CENTRO DE ENTRENAMIENTO ================= */}
          {vista === 'practica' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="grid grid-cols-2 sm:flex flex-wrap bg-stone-100 p-1 rounded-xl w-full sm:w-auto gap-1">
                  {[{ id: 'escritura', label: '✍️ Escritura' }, { id: 'test', label: '🎯 Test' }, { id: 'oido', label: '🎧 Oído' }, { id: 'contrarreloj', label: '⏱️ Sprint' }, { id: 'flashcard', label: '🃏 Tarjetas' }].map(modo => (
                    <button key={modo.id} onClick={() => { setModoJuego(modo.id); setSprintActivo(false); setSprintTerminado(false); elegirSiguientePalabra(vocabulario, modo.id); }} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${modoJuego === modo.id ? 'bg-white text-stone-950 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}>{modo.label}</button>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold text-stone-600 cursor-pointer select-none shrink-0">
                  <input type="checkbox" checked={modoInteligente} onChange={(e) => setModoInteligente(e.target.checked)} className="rounded text-stone-900 focus:ring-stone-900" /> Priorizar difíciles
                </label>
              </div>

              {vocabulario.length < 4 ? (
                <div className="text-center bg-white p-10 rounded-3xl border border-stone-200 shadow-sm">
                  <span className="text-4xl block mb-4">🇳🇴</span><h3 className="text-xl font-bold text-stone-800 mb-2">Necesitas al menos 4 palabras</h3>
                  <button onClick={() => { setVista('diccionario'); setMostrarPacks(true); }} className="bg-stone-950 text-white px-6 py-3 rounded-xl font-medium hover:bg-stone-800 transition-all mt-4">Ver Packs de Vocabulario</button>
                </div>
              ) : modoJuego === 'contrarreloj' && !sprintActivo && !sprintTerminado ? (
                <div className="bg-white p-10 rounded-3xl shadow-lg border border-stone-200 text-center space-y-5">
                  <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center text-3xl mx-auto">⏱️</div>
                  <h3 className="text-2xl font-extrabold text-stone-900">Sprint Contrarreloj (60s)</h3>
                  <div className="inline-block bg-stone-100 px-4 py-2 rounded-xl text-xs font-bold text-stone-700">🏆 Récord: {recordSprint} aciertos/min</div>
                  <div><button onClick={iniciarSprint} className="bg-stone-950 hover:bg-stone-800 text-white font-bold px-10 py-4 rounded-2xl shadow-md mt-4">¡Comenzar!</button></div>
                </div>
              ) : modoJuego === 'contrarreloj' && sprintTerminado ? (
                <div className="bg-white p-10 rounded-3xl shadow-lg border border-stone-200 text-center space-y-5">
                  <span className="text-4xl block">🏁</span><h3 className="text-2xl font-extrabold text-stone-900">¡Tiempo agotado!</h3>
                  <p className="text-4xl font-black text-emerald-600">{puntosSprint} aciertos</p>
                  <button onClick={iniciarSprint} className="bg-stone-950 hover:bg-stone-800 text-white font-bold px-8 py-3.5 rounded-2xl shadow-md">Intentar de nuevo</button>
                </div>
              ) : palabraActual && (
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-stone-200/80 text-center relative">
                  
                  {modoJuego === 'contrarreloj' && sprintActivo && (
                    <div className="flex items-center justify-between bg-stone-900 text-white px-4 py-2.5 rounded-xl mb-6 text-sm font-bold">
                      <span>⏱️ Tiempo: <strong className={tiempoRestante <= 10 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}>{tiempoRestante}s</strong></span>
                      <span>⚡ Aciertos: <strong className="text-emerald-400">{puntosSprint}</strong></span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-stone-400">{palabraActual.category || 'General'}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${calcularNivel(palabraActual).color}`}>{calcularNivel(palabraActual).etiqueta}</span>
                  </div>

                  {modoJuego === 'oido' ? (
                    <div className="mb-8">
                      <button type="button" onClick={() => pronunciar(palabraActual.norwegian)} className="w-24 h-24 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-4xl flex items-center justify-center mx-auto shadow-lg mb-4">🔊</button>
                      {!mostrarPistaOido ? <button onClick={() => setMostrarPistaOido(true)} className="text-xs text-stone-400 underline">¿Pista?</button> : <p className="text-sm font-bold text-amber-700 bg-amber-50 inline-block px-3 py-1 rounded-full">{palabraActual.spanish}</p>}
                    </div>
                  ) : <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-8 capitalize">{palabraActual.spanish}</h2>}

                  {(modoJuego === 'escritura' || modoJuego === 'oido') && (
                    <form onSubmit={comprobarEscritura} className="max-w-md mx-auto space-y-4">
                      {estadoRespuesta === 'idle' && (
                        <div className="flex justify-center gap-2 mb-2">{LETRAS_NORUEGAS.map(letra => (<button key={letra} type="button" onClick={() => setInputPractica(prev => prev + letra)} className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-900 hover:text-white font-bold text-stone-700">{letra}</button>))}</div>
                      )}
                      <input type="text" autoFocus disabled={estadoRespuesta !== 'idle'} value={inputPractica} onChange={(e) => setInputPractica(e.target.value)} className={`w-full text-center text-xl px-4 py-4 rounded-2xl border-2 outline-none ${estadoRespuesta === 'idle' ? 'border-stone-200 focus:border-stone-900 bg-stone-50' : estadoRespuesta === 'acierto' ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold' : 'border-rose-500 bg-rose-50 text-rose-800 font-bold'}`} />
                      {estadoRespuesta === 'idle' && <button type="submit" className="w-full bg-stone-950 text-white font-semibold py-4 rounded-2xl">Comprobar</button>}
                    </form>
                  )}

                  {(modoJuego === 'test' || modoJuego === 'contrarreloj') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                      {opcionesTest.map((opcion) => {
                        let estilo = 'border-stone-200 bg-stone-50 text-stone-800'; if (estadoRespuesta !== 'idle') { estilo = opcion._id === palabraActual._id ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold' : opcionSeleccionada === opcion._id ? 'border-rose-500 bg-rose-50 text-rose-800' : 'border-stone-100 bg-stone-50 text-stone-400 opacity-60' }
                        return <button key={opcion._id} disabled={estadoRespuesta !== 'idle'} onClick={() => comprobarTest(opcion)} className={`p-4 rounded-2xl border-2 text-lg font-medium transition-all ${estilo}`}>{opcion.norwegian}</button>
                      })}
                    </div>
                  )}

                  {modoJuego === 'flashcard' && (
                    <div className="max-w-md mx-auto">
                      {!mostrarCaraB ? <button onClick={() => { setMostrarCaraB(true); pronunciar(palabraActual.norwegian); }} className="bg-stone-950 text-white font-semibold px-10 py-4 rounded-2xl shadow-md">Mostrar traducción</button> : (
                        <div className="space-y-6">
                          <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200"><p className="text-3xl font-bold text-stone-900">{palabraActual.norwegian}</p></div>
                          {estadoRespuesta === 'idle' && (
                            <div className="flex gap-3 justify-center">
                              <button onClick={() => registrarResultadoAPI(false, false)} className="flex-1 bg-rose-100 text-rose-800 font-bold py-3.5 rounded-xl">Me costó 😅</button>
                              <button onClick={() => registrarResultadoAPI(true, false)} className="flex-1 bg-emerald-100 text-emerald-800 font-bold py-3.5 rounded-xl">¡La sabía! 🎯</button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* RESULTADO Y REFUERZO DE CONTEXTO */}
                  {estadoRespuesta !== 'idle' && modoJuego !== 'contrarreloj' && (
                    <div className="mt-8 pt-6 border-t border-stone-100">
                      {estadoRespuesta === 'acierto' ? <p className="text-emerald-600 font-bold text-lg mb-4">¡Correcto! +10 XP</p> : <p className="text-stone-600 mb-4">Era: <strong className="text-stone-950 text-lg">{palabraActual.norwegian}</strong> <button onClick={() => pronunciar(palabraActual.norwegian)} className="ml-2">🔊</button></p>}
                      
                      {/* MOSTRAR EJEMPLO EN CONTEXTO AL ACERTAR/FALLAR */}
                      {(palabraActual.ejemploNoruego || palabraActual.ejemploEspanol) && (
                        <div className="mb-6 p-4 bg-stone-50 rounded-2xl text-left border border-stone-200/60 max-w-sm mx-auto">
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">💡 Ejemplo en contexto</p>
                          {palabraActual.ejemploNoruego && <p className="font-semibold text-stone-800 italic">"{palabraActual.ejemploNoruego}"</p>}
                          {palabraActual.ejemploEspanol && <p className="text-sm text-stone-500 mt-0.5">"{palabraActual.ejemploEspanol}"</p>}
                        </div>
                      )}

                      <button onClick={() => elegirSiguientePalabra()} className="bg-stone-950 text-white font-semibold px-10 py-3.5 rounded-xl">Siguiente palabra →</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= VISTA 3: MI PROGRESO ================= */}
          {vista === 'progreso' && (
            <div className="max-w-5xl mx-auto space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-b from-stone-100 to-stone-200 p-6 rounded-3xl border border-stone-200/80 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-stone-700 shadow-sm z-10">{rangoActual.titulo}</div>
                  <div className="w-48 h-48 relative z-0 my-2"><Mascota {...avatarConfig} xp={puntosXP} /></div>
                  <div className="mt-2 text-center z-10 w-full">
                    <p className="text-stone-500 text-xs font-semibold uppercase tracking-widest mb-1">Experiencia total</p>
                    <p className="text-3xl font-black text-stone-900">{puntosXP} <span className="text-lg text-amber-500">XP</span></p>
                    <button onClick={() => setMostrarModalAvatar(true)} className="mt-3 bg-white/80 hover:bg-white text-stone-700 text-xs font-bold py-1.5 px-4 rounded-full shadow-sm transition-colors border border-stone-200">✏️ Personalizar Avatar</button>
                  </div>
                </div>

                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col justify-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Progreso de Rango</span>
                    <p className="text-xl font-extrabold text-stone-900 mt-2">{vocabulario.length} / {rangoActual.reqPalabras} pal.</p>
                    <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mt-3"><div className="bg-stone-900 h-full transition-all" style={{ width: `${progresoRango}%` }} /></div>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col justify-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Racha Diaria</span>
                    <p className="text-2xl font-extrabold text-amber-600 mt-2">🔥 {rachaDias} {rachaDias === 1 ? 'día' : 'días'}</p>
                    <p className="text-xs text-stone-400 mt-1">Meta anual: 365 días</p>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col justify-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Precisión Global</span>
                    <p className="text-2xl font-extrabold text-emerald-600 mt-2">{precisionGlobal}%</p>
                    <p className="text-xs text-stone-400 mt-1">{totalAciertosGlobal} aciertos · {totalFallosGlobal} fallos</p>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col justify-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Dominadas</span>
                    <p className="text-2xl font-extrabold text-stone-900 mt-2">{palabrasDominadas.length} / {vocabulario.length}</p>
                    <p className="text-xs text-stone-400 mt-1">Mín. 25 aciertos y 90% prec.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm">
                  <h3 className="font-bold text-stone-900 flex items-center gap-2 mb-6">📊 Distribución de tu Léxico</h3>
                  {vocabulario.length === 0 ? <p className="text-sm text-stone-400 text-center py-4">Añade palabras.</p> : (
                    <div className="space-y-4">
                      {distribucionCategorias.map(cat => (
                        <div key={cat.nombre}>
                          <div className="flex justify-between text-xs font-semibold mb-1"><span className="text-stone-700">{cat.nombre}</span><span className="text-stone-400">{cat.cantidad} ({Math.round(cat.porcentaje)}%)</span></div>
                          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden"><div className="bg-stone-900 h-full rounded-full" style={{ width: `${cat.porcentaje}%` }}></div></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm">
                  <h3 className="font-bold text-stone-900 flex items-center gap-2 mb-6">🗓️ Constancia (Últimos 30 días)</h3>
                  <div className="flex flex-wrap gap-2 justify-center mt-8">
                    {mapaConstancia.map((activo, index) => <div key={index} className={`w-6 h-6 rounded-md transition-colors ${activo ? 'bg-amber-400 shadow-sm' : 'bg-stone-100'}`}></div>)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm">
                  <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-stone-900 flex items-center gap-2"><span>⚠️</span> Palabras que más te cuestan</h3></div>
                  {palabrasMasCostosas.length === 0 ? <p className="text-sm text-stone-400 py-8 text-center">Sin fallos.</p> : (
                    <div className="space-y-3">
                      {palabrasMasCostosas.map(item => (
                        <div key={item._id} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100">
                          <div><div className="flex items-center gap-2"><p className="font-bold text-stone-900">{item.norwegian}</p><button onClick={() => pronunciar(item.norwegian)} className="text-xs">🔊</button></div><p className="text-xs text-stone-500 capitalize">{item.spanish}</p></div>
                          <div className="flex items-center gap-3"><span className="text-xs font-semibold text-rose-600">{item.fallos} fallos</span><button onClick={() => iniciarPractica(item)} className="text-xs bg-stone-900 hover:bg-stone-700 text-white px-3 py-1.5 rounded-lg">Repasar</button></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm">
                  <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-stone-900 flex items-center gap-2"><span>✅</span> Más consolidadas</h3></div>
                  {palabrasMejorAprendidas.length === 0 ? <p className="text-sm text-stone-400 py-8 text-center">Practica primero.</p> : (
                    <div className="space-y-3">
                      {palabrasMejorAprendidas.map(item => (
                        <div key={item._id} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100">
                          <div><div className="flex items-center gap-2"><p className="font-bold text-stone-900">{item.norwegian}</p><button onClick={() => pronunciar(item.norwegian)} className="text-xs">🔊</button></div><p className="text-xs text-stone-500 capitalize">{item.spanish}</p></div>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">{item.aciertos}/{OBJETIVO_ACIERTOS_DOMINIO}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div><h3 className="font-bold text-stone-900 text-lg">🏆 Vitrina de Trofeos</h3></div>
                  <span className="text-xs font-bold bg-stone-100 text-stone-700 px-3 py-1.5 rounded-xl self-start sm:self-auto">{logros.filter(l => l.cumplido).length} / {logros.length} desbloqueados</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {logros.map(logro => {
                    const porcentajeLogro = Math.min(100, Math.round((logro.actual / logro.objetivo) * 100))
                    return (
                      <div key={logro.id} className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${logro.cumplido ? 'bg-amber-50/70 border-amber-300 shadow-sm' : 'bg-stone-50/70 border-stone-200/80 text-stone-700'}`}>
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-3"><div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 ${logro.cumplido ? 'bg-amber-100 shadow-sm' : 'bg-stone-200/70 grayscale opacity-70'}`}>{logro.icono}</div><span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${coloresTier[logro.tier]}`}>{logro.tier}</span></div>
                          <p className="font-bold text-sm text-stone-900">{logro.titulo}</p><p className="text-xs text-stone-500 mt-1 leading-relaxed">{logro.desc}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-stone-200/60">
                          <div className="flex justify-between items-center text-[11px] font-semibold mb-1.5"><span className={logro.cumplido ? 'text-emerald-700 font-bold' : 'text-stone-500'}>{logro.cumplido ? '¡Desbloqueado!' : `${logro.actual.toLocaleString()} / ${logro.objetivo.toLocaleString()}`}</span><span className="text-stone-700 font-bold">{porcentajeLogro}%</span></div>
                          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden"><div className={`h-full transition-all duration-500 ${logro.cumplido ? 'bg-emerald-500' : 'bg-stone-800'}`} style={{ width: `${porcentajeLogro}%` }} /></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default Dashboard