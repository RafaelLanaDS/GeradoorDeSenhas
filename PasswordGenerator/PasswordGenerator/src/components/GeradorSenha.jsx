import React, { useEffect, useState } from 'react';
import { useGerador } from '../hooks/useGerador';
import { BarraForca } from './BarraForca';
import '../styles/GeradorSenha.css';

const OPCOES_LABELS = {
  maiusculas: 'Maiúsculas (A-Z)',
  minusculas: 'Minúsculas (a-z)',
  numeros:    'Números (0-9)',
  simbolos:   'Símbolos (!@#)',
};

export function GeradorSenha() {
  const {
    tamanho, setTamanho,
    opcoes, toggleOpcao,
    senha, gerarSenha,
    copiado, copiarSenha,
    forca,
  } = useGerador();

  const [tema, setTema] = useState(() => {
    return localStorage.getItem('tema') || 'claro';
  });

  // Aplica o tema no <html> para afetar tudo
  useEffect(() => {
    document.documentElement.setAttribute('data-tema', tema);
    localStorage.setItem('tema', tema);
  }, [tema]);

  const alternarTema = () => {
    setTema(prev => prev === 'claro' ? 'escuro' : 'claro');
  };

  useEffect(() => {
    gerarSenha();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    gerarSenha();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tamanho, opcoes]);

  const nenhumaOpcao = !Object.values(opcoes).some(Boolean);

  return (
    <div className="pagina">
      <div className="gerador">

        {/* Cabeçalho com botão de tema */}
        <div className="gerador__header">
          <div>
            <h1 className="gerador__titulo">Gerador de senha</h1>
            <p className="gerador__sub">Crie senhas seguras instantaneamente</p>
          </div>
          <button
            className="gerador__btn-tema"
            onClick={alternarTema}
            title={tema === 'claro' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            aria-label="Alternar tema"
          >
            {tema === 'claro' ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Caixa da senha */}
        <div className={`gerador__senha-box ${copiado ? 'gerador__senha-box--copiado' : ''}`}>
          <span className="gerador__senha-texto">
            {nenhumaOpcao ? 'Selecione uma opção' : senha || '—'}
          </span>
          <button
            className="gerador__btn-copiar"
            onClick={copiarSenha}
            disabled={!senha || nenhumaOpcao}
            title="Copiar senha"
            aria-label="Copiar senha"
          >
            {copiado ? '✓' : '⎘'}
          </button>
        </div>

        {/* Feedback de cópia */}
        <div className={`gerador__feedback ${copiado ? 'gerador__feedback--visivel' : ''}`}>
          ✓ Copiado para a área de transferência!
        </div>

        {/* Slider */}
        <div className="gerador__campo">
          <label htmlFor="slider-tamanho" className="gerador__label">
            Tamanho
            <span className="gerador__label-valor">{tamanho} caracteres</span>
          </label>
          <input
            id="slider-tamanho"
            type="range"
            min={6}
            max={32}
            step={1}
            value={tamanho}
            onChange={e => setTamanho(Number(e.target.value))}
          />
          <div className="gerador__slider-extremos">
            <span>6</span>
            <span>32</span>
          </div>
        </div>

        {/* Checkboxes */}
        <fieldset className="gerador__fieldset">
          <legend className="gerador__legend">Incluir caracteres</legend>
          <div className="gerador__opcoes">
            {Object.entries(OPCOES_LABELS).map(([chave, label]) => (
              <label key={chave} className={`gerador__opt ${opcoes[chave] ? 'gerador__opt--ativo' : ''}`}>
                <input
                  type="checkbox"
                  checked={opcoes[chave]}
                  onChange={() => toggleOpcao(chave)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Barra de força */}
        <BarraForca forca={nenhumaOpcao ? 0 : forca} />

        {/* Botão gerar */}
        <button
          className="gerador__btn-gerar"
          onClick={gerarSenha}
          disabled={nenhumaOpcao}
        >
          <span className="gerador__btn-icone">↻</span>
          Gerar nova senha
        </button>

      </div>
    </div>
  );
}
// useEffect com array vazio [] → roda só na montagem
// useEffect com dependências [tamanho, opcoes] → roda quando esses valores mudam
// .map() nos checkboxes — lista dinâmica em vez de repetir HTML
// Props passadas pro componente filho <BarraForca forca={forca} />