// src/components/BarraForca.jsx
const NIVEIS = {
  0: { texto: '—',          cor: '#888' },
  1: { texto: 'Fraca',      cor: '#E24B4A' },
  2: { texto: 'Média',      cor: '#EF9F27' },
  3: { texto: 'Forte',      cor: '#639922' },
  4: { texto: 'Muito forte', cor: '#1D9E75' },
};

export function BarraForca({ forca }) {
  const { texto, cor } = NIVEIS[forca] || NIVEIS[0];

  return (
    <div className="barra-forca">
      <div className="barra-forca__header">
        <span>Força</span>
        <span style={{ color: cor }}>{texto}</span>
      </div>
      <div className="barra-forca__segmentos">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="barra-forca__seg"
            style={{ background: i <= forca ? cor : 'var(--borda)' }}
          />
        ))}
      </div>
    </div>
  );
}

// Componente recebe forca via props — não sabe como foi calculado
// Renderização condicional com estilo dinâmico pelo style={{ }}
// .map() pra renderizar os 4 segmentos sem repetir código

