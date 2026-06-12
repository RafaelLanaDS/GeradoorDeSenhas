// src/hooks/useGerador.js
import { useState, useCallback } from 'react';

const CHARS = {
  maiusculas: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  minusculas: 'abcdefghijklmnopqrstuvwxyz',
  numeros:    '0123456789',
  simbolos:   '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

export function useGerador() {
  const [tamanho, setTamanho] = useState(16);
  const [opcoes, setOpcoes] = useState({
    maiusculas: true,
    minusculas: true,
    numeros:    true,
    simbolos:   true,
  });
  const [senha, setSenha] = useState('');
  const [copiado, setCopiado] = useState(false);

  // Gera a senha com base nas opções
  const gerarSenha = useCallback(() => {
    let pool = '';
    let garantidos = [];

    // Garante pelo menos 1 char de cada tipo marcado
    Object.entries(opcoes).forEach(([tipo, ativo]) => {
      if (ativo) {
        pool += CHARS[tipo];
        const charAleatorio = CHARS[tipo][Math.floor(Math.random() * CHARS[tipo].length)];
        garantidos.push(charAleatorio);
      }
    });

    if (!pool) return;

    // Preenche o restante com chars aleatórios do pool
    const restante = Array.from(
      { length: tamanho - garantidos.length },
      () => pool[Math.floor(Math.random() * pool.length)]
    );

    // Embaralha pra não ficar previsível
    const senhaFinal = [...garantidos, ...restante]
      .sort(() => Math.random() - 0.5)
      .join('');

    setSenha(senhaFinal);
  }, [tamanho, opcoes]);

  // Calcula a força: retorna 1, 2, 3 ou 4
  const calcularForca = useCallback(() => {
    if (!senha) return 0;
    let pontos = 0;
    if (senha.length >= 12) pontos++;
    if (senha.length >= 20) pontos++;
    const tiposAtivos = Object.values(opcoes).filter(Boolean).length;
    pontos += Math.min(tiposAtivos - 1, 2);
    return Math.min(pontos, 4);
  }, [senha, opcoes]);

  // Copia pra área de transferência
  const copiarSenha = useCallback(() => {
    if (!senha) return;
    navigator.clipboard.writeText(senha).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }, [senha]);

  // Alterna uma opção (maiusculas, numeros etc.)
  const toggleOpcao = useCallback((opcao) => {
    setOpcoes(prev => ({ ...prev, [opcao]: !prev[opcao] }));
  }, []);

  return {
    tamanho, setTamanho,
    opcoes, toggleOpcao,
    senha, gerarSenha,
    copiado, copiarSenha,
    forca: calcularForca(),
  };
}

// useState — guarda os valores que mudam (tamanho, senha, opções)
// useCallback — evita recriar funções desnecessariamente
// Separar lógica do visual é um padrão profissional chamado custom hook

