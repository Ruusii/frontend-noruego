export default function Mascota({ 
  xp = 0, 
  raza = 'salchicha', 
  color = 'marron', 
  pelo = 'liso', 
  ropa = 'ninguna', 
  accesorio = 'ninguno' 
}) {

  // --- PALETAS DE COLOR DINÁMICAS ---
  const paletas = {
    marron: { base: '#8b5a2b', oscuro: '#6b4629', hocico: '#d2a679', vientre: '#8b5a2b' },
    negro: { base: '#292524', oscuro: '#1c1917', hocico: '#57534e', vientre: '#44403c' },
    dorado: { base: '#fbbf24', oscuro: '#d97706', hocico: '#fef3c7', vientre: '#fde68a' },
    nieve: { base: '#f5f5f4', oscuro: '#d6d3d1', hocico: '#e7e5e4', vientre: '#fff' }
  };
  
  const c = paletas[color] || paletas.marron;

  // Ajustes estructurales por raza
  const isPug = raza === 'pug';
  const isShiba = raza === 'shiba';
  const isTerrier = raza === 'terrier';
  const isSalchicha = raza === 'salchicha';

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl transition-all duration-300" xmlns="http://www.w3.org/2000/svg">
      
      {/* --- COLA --- */}
      {isSalchicha && <path d="M 140 150 Q 170 140 180 110" fill="none" stroke={c.oscuro} strokeWidth="8" strokeLinecap="round" />}
      {isPug && <path d="M 125 145 C 145 130 145 155 130 150" fill="none" stroke={c.oscuro} strokeWidth="6" strokeLinecap="round" />}
      {isShiba && <path d="M 130 145 C 160 120 150 160 125 140" fill="none" stroke={c.base} strokeWidth="12" strokeLinecap="round" />}
      {isTerrier && <path d="M 125 145 L 140 110" fill="none" stroke={c.base} strokeWidth="8" strokeLinecap="round" />}

      {/* --- OREJAS (FONDO) --- */}
      {isSalchicha && (
        <><path d="M 60 70 C 40 90 40 120 55 125 C 65 128 70 100 70 80 Z" fill={c.oscuro} /><path d="M 140 70 C 160 90 160 120 145 125 C 135 128 130 100 130 80 Z" fill={c.oscuro} /></>
      )}
      {isPug && (
        <><path d="M 65 60 L 50 85 L 75 80 Z" fill={c.oscuro} /><path d="M 135 60 L 150 85 L 125 80 Z" fill={c.oscuro} /></>
      )}
      {isShiba && (
        <><path d="M 75 70 L 60 30 L 90 60 Z" fill={c.base} stroke={c.oscuro} strokeWidth="2" /><path d="M 125 70 L 140 30 L 110 60 Z" fill={c.base} stroke={c.oscuro} strokeWidth="2" /></>
      )}
      {isTerrier && (
        <><path d="M 70 65 L 55 40 L 85 55 Z" fill={c.oscuro} /><path d="M 130 65 L 145 40 L 115 55 Z" fill={c.oscuro} /></>
      )}

      {/* --- TORSO Y PATAS --- */}
      {isSalchicha && <rect x="75" y="90" width="50" height="70" rx="25" fill={c.base} />}
      {isPug && <rect x="80" y="90" width="40" height="60" rx="20" fill={c.base} />}
      {(isShiba || isTerrier) && (
        <><rect x="78" y="90" width="44" height="65" rx="22" fill={c.base} /><rect x="85" y="100" width="30" height="50" rx="15" fill={c.vientre} /></>
      )}
      
      <rect x={isPug ? 85 : 80} y={isPug ? 140 : 150} width="12" height="25" rx="6" fill={c.oscuro} />
      <rect x={isPug ? 103 : 108} y={isPug ? 140 : 150} width="12" height="25" rx="6" fill={c.oscuro} />

      {/* --- TIPO DE PELO (MECHONES SI ES RIZADO) --- */}
      {pelo === 'rizado' && (
        <g id="pelo-rizado" fill={c.base}>
          <circle cx="75" cy="110" r="8" />
          <circle cx="125" cy="110" r="8" />
          <circle cx="75" cy="130" r="8" />
          <circle cx="125" cy="130" r="8" />
          <circle cx="100" cy="40" r="10" />
        </g>
      )}

      {/* --- CABEZA --- */}
      {isPug ? <ellipse cx="100" cy="75" rx="38" ry="32" fill={c.base} /> : <ellipse cx="100" cy="70" rx="35" ry="30" fill={c.base} />}
      
      {/* --- HOCICO Y CARA --- */}
      {(isShiba || isTerrier) && (
        <><circle cx="85" cy="80" r="12" fill={c.vientre} /><circle cx="115" cy="80" r="12" fill={c.vientre} /></>
      )}

      <ellipse cx="100" cy={isPug ? 85 : 82} rx={isPug ? 18 : 22} ry={isPug ? 14 : 16} fill={color === 'negro' ? '#111' : c.hocico} />
      <ellipse cx="100" cy={isPug ? 80 : 75} rx="6" ry="4" fill={isPug || color === 'negro' ? '#fff' : '#111'} /> 

      {/* --- OJOS --- */}
      <circle cx={isPug ? 80 : 85} cy={isPug ? 68 : 62} r="4.5" fill="#111" />
      <circle cx={isPug ? 120 : 115} cy={isPug ? 68 : 62} r="4.5" fill="#111" />
      <circle cx={isPug ? 79 : 84} cy={isPug ? 66 : 60} r="1.5" fill="#fff" />
      <circle cx={isPug ? 119 : 114} cy={isPug ? 66 : 60} r="1.5" fill="#fff" />

      {/* --- CAPA DE ROPA --- */}
      {ropa === 'lusekofte' && (
        <g id="lusekofte">
          <path d={`M ${isPug ? 80 : 75} 100 L ${isPug ? 120 : 125} 100 L ${isPug ? 123 : 128} 145 L ${isPug ? 77 : 72} 145 Z`} fill="#b91c1c" />
          <path d="M 73 115 L 127 115 M 74 130 L 126 130" stroke="#fff" strokeWidth="4" strokeDasharray="4 4" />
          <path d="M 73 122 L 127 122" stroke="#fff" strokeWidth="2" />
          <rect x={isPug ? 85 : 80} y="90" width={isPug ? 30 : 40} height="15" rx="5" fill="#fff" />
        </g>
      )}

      {ropa === 'chubasquero' && (
        <g id="chubasquero">
          <path d={`M ${isPug ? 78 : 73} 95 L ${isPug ? 122 : 127} 95 L ${isPug ? 125 : 132} 150 L ${isPug ? 75 : 68} 150 Z`} fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
          <rect x="95" y="100" width="10" height="50" fill="#fef08a" />
          <circle cx="100" cy="110" r="3" fill="#111" />
          <circle cx="100" cy="130" r="3" fill="#111" />
        </g>
      )}

      {ropa === 'bufanda' && (
        <g id="bufanda">
          <rect x="75" y="85" width="50" height="18" rx="8" fill="#10b981" />
          <path d="M 85 85 L 85 103 M 95 85 L 95 103 M 105 85 L 105 103 M 115 85 L 115 103" stroke="#047857" strokeWidth="4" />
          <path d="M 110 95 L 110 130" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
          <path d="M 110 100 L 110 125" stroke="#047857" strokeWidth="4" strokeDasharray="6 6" />
        </g>
      )}

      {/* --- CAPA DE ACCESORIOS --- */}
      {accesorio === 'gorro' && (
        <g id="gorro-lana">
          <path d="M 65 50 Q 100 10 135 50 Z" fill="#0284c7" />
          <rect x="62" y="45" width="76" height="12" rx="4" fill="#38bdf8" />
          <circle cx="100" cy="15" r="8" fill="#e0f2fe" />
        </g>
      )}

      {accesorio === 'gafas' && (
        <g id="gafas">
          <rect x={isPug ? 70 : 75} y={isPug ? 62 : 55} width="20" height="14" rx="4" fill="none" stroke="#111" strokeWidth="3" />
          <rect x={isPug ? 110 : 105} y={isPug ? 62 : 55} width="20" height="14" rx="4" fill="none" stroke="#111" strokeWidth="3" />
          <path d={`M ${isPug ? 90 : 95} ${isPug ? 69 : 62} L ${isPug ? 110 : 105} ${isPug ? 69 : 62}`} stroke="#111" strokeWidth="3" />
        </g>
      )}

      {accesorio === 'auriculares' && (
        <g id="auriculares">
          <path d="M 65 70 C 65 20 135 20 135 70" fill="none" stroke="#ef4444" strokeWidth="6" />
          <rect x="55" y="60" width="15" height="25" rx="5" fill="#111" />
          <rect x="130" y="60" width="15" height="25" rx="5" fill="#111" />
        </g>
      )}

      {accesorio === 'corona' && (
        <g id="corona">
          <path d="M 70 45 L 80 20 L 100 35 L 120 20 L 130 45 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
          <circle cx="80" cy="20" r="3" fill="#ef4444" />
          <circle cx="100" cy="35" r="3" fill="#3b82f6" />
          <circle cx="120" cy="20" r="3" fill="#ef4444" />
        </g>
      )}
    </svg>
  );
}