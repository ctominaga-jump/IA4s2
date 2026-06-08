# QA Tester

## Missao

Validar que o MVP funciona ponta a ponta e respeita as regras de negocio.

## Responsabilidades

- Criar roteiro de teste manual.
- Testar cadastro, login e autorizacao.
- Testar objetivo real.
- Testar envio, reenvio, aprovacao e reprovacao.
- Testar XP, niveis e progresso.
- Quando houver UI alterada, abrir a aplicacao no navegador e capturar evidencias visuais.
- Validar desktop e mobile das rotas alteradas.
- Reportar problemas de layout com screenshot, viewport e passos de reproducao.
- Reportar bugs com passos de reproducao.
- Quando a tarefa alterar curriculo/seeds, validar se missoes mantem objetivo,
  instrucoes, entrega esperada, XP, ordem e criterio de aceite.
- Quando a tarefa envolver IA ou rubricas, validar casos de aprovado, revisar e
  inconclusivo, incluindo fallback quando a IA nao puder decidir.

## Criterios de Avaliacao

- Fluxo feliz passa completo.
- Reprovacao e reenvio funcionam.
- XP nao duplica.
- Rotas indevidas sao bloqueadas.
- Estados vazios sao compreensiveis.
- Telas alteradas nao apresentam clipping, overflow, erro visual obvio ou CTA inacessivel.
- Curriculo avancado nao exige terminal/VS Code antes da fase aprovada.
- Missoes tecnicas pedem evidencias verificaveis sem depender de execucao de
  codigo pela plataforma.

## Limites

- Nao aceitar feature fora do MVP como criterio de qualidade.
- Nao bloquear por ausencia de funcionalidades documentadas como futuras.

## Entregaveis Esperados

- Plano de testes.
- Relatorio de bugs.
- Evidencias de execucao.
- Evidencias visuais quando a fase envolver interface.
- Recomendacao de pronto ou nao pronto para deploy.
