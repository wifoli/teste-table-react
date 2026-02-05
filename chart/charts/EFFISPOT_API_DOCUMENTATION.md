# 📚 EFFISPOT - Documentação da API
## Sistema de Gestão de Quadras Esportivas

---

## 📖 Visão Geral

Esta documentação descreve todas as rotas disponíveis na API do Effispot, um sistema completo para gerenciar quadras esportivas, incluindo planos, matrículas, turmas, presença e integração financeira.

**Base URL**: `/api/effispot`

---

## 🎯 MÓDULO 1: PLANOS

Os planos representam os produtos que você vende aos seus clientes. Eles definem o tipo de contrato, valor, frequência de pagamento e quantas aulas por semana o aluno terá direito.

### 📋 Listar Todos os Planos
**Rota**: `GET /plans`

**O que faz**: Retorna uma lista completa de todos os planos cadastrados no sistema, incluindo ativos e inativos.

**Quando usar**:
- Para exibir um catálogo de planos disponíveis na tela de matrícula
- Para mostrar opções de upgrade/downgrade para clientes existentes
- Para relatórios gerenciais de produtos oferecidos

**Retorna**:
- Lista com nome, descrição, preço, frequência e quantidade de aulas por semana de cada plano

---

### 🔍 Buscar Plano Específico
**Rota**: `GET /plans/{id}`

**O que faz**: Busca e retorna os detalhes completos de um plano específico usando seu ID.

**Quando usar**:
- Para exibir detalhes de um plano antes da matrícula
- Para edição de um plano específico
- Para auditoria e conferência de informações

**Retorna**:
- Todos os dados do plano incluindo histórico de matrículas ativas

---

### ➕ Criar Novo Plano
**Rota**: `POST /plans`

**O que faz**: Cria um novo plano no catálogo de produtos.

**Quando usar**:
- Ao lançar uma nova modalidade ou promoção
- Para criar planos sazonais (férias, verão, etc)
- Ao ajustar a grade de preços

**Dados necessários**:
- Nome do plano (ex: "Mensal 2x por semana")
- Descrição detalhada
- Preço
- Frequência (AVULSO, MENSAL, TRIMESTRAL, SEMESTRAL, ANUAL)
- Quantidade de aulas por semana

**Efeito**: Novo plano fica disponível para novas matrículas

---

### ✏️ Atualizar Plano
**Rota**: `PUT /plans/{id}`

**O que faz**: Atualiza as informações de um plano existente.

**Quando usar**:
- Para reajuste de preços
- Para modificar descrições ou benefícios
- Para alterar quantidade de aulas permitidas

**Importante**: Alterações em planos NÃO afetam matrículas já existentes, apenas novas matrículas.

---

### 🗑️ Excluir Plano
**Rota**: `DELETE /plans/{id}`

**O que faz**: Remove um plano do sistema (soft delete - mantém histórico).

**Quando usar**:
- Ao descontinuar um plano
- Para "esconder" planos antigos sem perdê-los do histórico

**Importante**: Só é possível excluir planos sem matrículas ativas vinculadas.

---

## 👥 MÓDULO 2: MATRÍCULAS

As matrículas são o vínculo entre o aluno (pessoa) e o plano contratado. É aqui que acontece a integração com o módulo financeiro, gerando as cobranças automaticamente.

### 📋 Listar Todas as Matrículas
**Rota**: `GET /enrollments`

**O que faz**: Lista todas as matrículas do sistema com informações do aluno, plano e esporte.

**Quando usar**:
- Tela administrativa de gestão de contratos
- Relatórios de alunos ativos
- Dashboard de ocupação

**Retorna**:
- Nome do aluno
- Plano contratado
- Esporte escolhido
- Status (ATIVO, INATIVO, SUSPENSO)
- Datas de início e término

---

### 🔍 Buscar Matrícula Específica
**Rota**: `GET /enrollments/{id}`

**O que faz**: Retorna todos os detalhes de uma matrícula específica, incluindo as turmas em que o aluno está matriculado.

**Quando usar**:
- Para ver o histórico completo do aluno
- Antes de fazer alterações na matrícula
- Para atendimento ao cliente

**Retorna**:
- Dados completos do aluno e plano
- Lista de turmas matriculadas
- Quantidade de aulas de reposição pendentes
- Status de pagamento

---

### ➕ Criar Nova Matrícula
**Rota**: `POST /enrollments`

**O que faz**: Realiza a matrícula de um aluno em um plano específico e **automaticamente cria as cobranças no módulo financeiro**.

**Quando usar**:
- Ao fechar uma venda
- Após aula experimental bem-sucedida
- Ao reativar um ex-aluno

**Dados necessários**:
- ID do aluno (person_id)
- ID do plano escolhido (plan_id)
- ID do esporte (sport_id)
- Data de início (opcional, padrão: hoje)
- Data de término (opcional, para planos temporários)

**Efeito automático**:
1. Cria a matrícula com status ATIVO
2. Gera uma conta a receber (account_receivable)
3. Cria as parcelas conforme frequência do plano:
   - **AVULSO**: 1 parcela única
   - **MENSAL**: 12 parcelas (uma por mês)
   - **TRIMESTRAL**: 4 parcelas (uma a cada 3 meses)
   - **SEMESTRAL**: 2 parcelas (uma a cada 6 meses)
   - **ANUAL**: 1 parcela única

**Regra de Ouro**: Toda matrícula criada **sempre** gera lançamentos financeiros automaticamente.

---

### 🎓 Matricular Aluno em Turma
**Rota**: `POST /enrollments/{id}/enroll-in-class`

**O que faz**: Adiciona o aluno em uma turma específica (dia e horário da semana).

**Quando usar**:
- Após criar a matrícula, para definir os horários do aluno
- Para adicionar o aluno em uma segunda turma (se o plano permitir)

**Dados necessários**:
- ID da turma (class_id)

**Validações automáticas**:
1. ✅ Verifica se a turma está lotada (max_students)
2. ✅ Verifica se o aluno já atingiu o limite de aulas do plano
3. ✅ Verifica se o aluno já está nesta turma (evita duplicação)

**Erro comum**: Se o aluno tem plano "1x por semana" e tentar matricular em 2 turmas, o sistema bloqueia com mensagem de erro.

---

### ⏸️ Suspender Matrícula
**Rota**: `POST /enrollments/{id}/suspend`

**O que faz**: Coloca a matrícula em status SUSPENSO (aluno temporariamente afastado).

**Quando usar**:
- Aluno com lesão/problema de saúde temporário
- Viagem prolongada
- Inadimplência (opcional)

**Efeito**:
- Aluno não aparece mais nas listas de chamada
- Impede marcação de presença
- Mantém o histórico e vínculo com turmas

**Importante**: Cobranças continuam sendo geradas (a menos que integração financeira seja customizada).

---

### ▶️ Reativar Matrícula
**Rota**: `POST /enrollments/{id}/reactivate`

**O que faz**: Retorna o status da matrícula para ATIVO.

**Quando usar**:
- Quando o aluno retornar após suspensão
- Após regularização de pagamentos
- Fim de afastamento temporário

**Efeito**:
- Aluno volta a aparecer nas listas de chamada
- Pode ter presença marcada novamente

---

## 📅 MÓDULO 3: TURMAS

As turmas definem a agenda física da quadra. Cada turma é um horário fixo na semana (ex: Toda segunda-feira das 19h às 20h).

### 📋 Listar Todas as Turmas
**Rota**: `GET /classes`

**O que faz**: Lista todas as turmas cadastradas, ordenadas por dia da semana e horário.

**Quando usar**:
- Para visualizar a grade semanal completa
- Para planejamento de ocupação das quadras
- Para gestão de horários

**Retorna**:
- Nome da turma
- Esporte
- Quadra
- Dia da semana
- Horário de início e fim
- Vagas totais e disponíveis

---

### 🔍 Buscar Turma Específica
**Rota**: `GET /classes/{id}`

**O que faz**: Retorna detalhes de uma turma específica, incluindo lista de alunos matriculados.

**Quando usar**:
- Para ver quem está matriculado em determinado horário
- Para verificar disponibilidade de vagas
- Para planejamento de professores

**Retorna**:
- Informações completas da turma
- Lista de alunos matriculados
- Vagas disponíveis
- Indicador se está lotada

---

### ➕ Criar Nova Turma
**Rota**: `POST /classes`

**O que faz**: Cria uma nova turma na grade horária.

**Quando usar**:
- Ao abrir um novo horário
- Para criar turmas temporárias (férias, eventos)
- Ao expandir a capacidade

**Dados necessários**:
- ID do esporte (sport_id)
- ID da quadra (court_id)
- Nome da turma (ex: "Vôlei Iniciante Segunda 19h")
- Dia da semana (0=Domingo, 1=Segunda, ..., 6=Sábado)
- Horário de início (ex: 19:00)
- Horário de término (ex: 20:00)
- Número máximo de alunos

**Efeito**: Nova turma fica disponível para matrícula de alunos.

---

### 📆 Buscar Turmas por Dia da Semana
**Rota**: `GET /classes/weekday/{weekday}`

**O que faz**: Filtra e retorna apenas as turmas de um dia específico da semana.

**Quando usar**:
- Para visualizar a agenda de um dia específico
- Para planejamento de escala de professores
- Para mostrar opções de horário ao aluno durante matrícula

**Exemplo**: `GET /classes/weekday/1` retorna todas as turmas de segunda-feira

---

## ✅ MÓDULO 4: PRESENÇA E CHAMADA

Este é o módulo operacional diário. É aqui que professores registram quem veio ou faltou, e onde aulas são canceladas por chuva ou outros motivos.

### 📝 Gerar Logs de Aula de uma Data
**Rota**: `POST /attendance/generate-logs`

**O que faz**: Cria automaticamente os registros de aula (class_logs) para um dia específico e prepara a lista de chamada com todos os alunos.

**Quando usar**:
- Todos os dias pela manhã (pode ser automático via cron)
- Manualmente para dias futuros (planejamento)
- Para regenerar logs de dias passados (correção)

**Dados necessários**:
- Data (ex: 2026-01-06)

**O que acontece nos bastidores**:
1. Sistema busca todas as turmas daquele dia da semana
2. Cria um registro de aula (class_log) para cada turma
3. Para cada aula, cria registros de presença (attendance) para todos os alunos ATIVOS matriculados naquela turma
4. Define status inicial como "não presente"

**Exemplo prático**:
- Dia: Segunda-feira (06/01/2026)
- Sistema encontra: "Vôlei 19h" e "Tênis 20h"
- Cria 2 class_logs
- Se a turma de Vôlei tem 8 alunos ativos, cria 8 registros de presença

---

### 👥 Buscar Lista de Chamada
**Rota**: `GET /attendance/class-log/{classLogId}`

**O que faz**: Retorna a lista completa de alunos esperados para uma aula específica, com indicadores visuais importantes.

**Quando usar**:
- No início da aula, para o professor fazer a chamada
- Durante a aula, para registrar presenças
- Após a aula, para conferência

**Retorna para cada aluno**:
- ✅ Nome completo
- ✅ Status de presença (presente/ausente)
- ✅ Se é aula experimental
- ⚠️ **ALERTA VERMELHO**: Se tem pagamento atrasado
- 📋 Nome do plano contratado

**Uso prático**: Professor abre a tela, vê lista com nomes marcados em vermelho (inadimplentes) e pode decidir abordar o aluno sobre pagamento.

---

### ✓ Marcar Presença/Falta
**Rota**: `POST /attendance/mark/{attendanceId}`

**O que faz**: Registra se um aluno específico compareceu ou faltou à aula.

**Quando usar**:
- Durante ou imediatamente após a aula
- Para correções (aluno chegou atrasado, esqueceu de marcar)

**Dados necessários**:
- is_present: true (presente) ou false (ausente)

**Efeito**:
- Atualiza o registro de presença
- Alimenta estatísticas de frequência
- Usado para identificar alunos com risco de evasão

**Regra importante**: Sistema calcula automaticamente "ausências consecutivas". Se aluno faltar 3 vezes seguidas, pode disparar alertas.

---

### ❌ Cancelar Aula
**Rota**: `POST /attendance/cancel-class/{classLogId}`

**O que faz**: Cancela uma aula e define se os alunos terão direito a reposição.

**Quando usar**:
- Chuva forte que impede uso da quadra
- Manutenção emergencial
- Feriado não previsto
- Professor ausente

**Dados necessários**:
- Motivo do cancelamento:
  - `CANCELADA_CHUVA` → **Gera direito a reposição**
  - `CANCELADA_MANUTENCAO` → **Gera direito a reposição**
  - `CANCELADA_FERIADO` → Não gera reposição
  - `CANCELADA_OUTRO` → Não gera reposição
- Detalhes/observações (opcional)

**Efeito automático**:
1. Muda status do class_log para o motivo escolhido
2. Se for CHUVA ou MANUTENÇÃO, marca `needs_replacement = true`
3. Cada aluno registrado naquela aula ganha "crédito de reposição"

**Exemplo prático**:
- Turma de Vôlei Segunda 19h cancelada por chuva
- 8 alunos estavam registrados
- Sistema marca que esses 8 alunos têm 1 aula de reposição pendente
- Gestor pode depois criar "aulas de reposição" extras e convidar esses alunos

---

## 🎯 FLUXOS COMPLETOS DE USO

### 📌 Fluxo 1: Nova Matrícula Completa

**Cenário**: João quer começar a jogar tênis 2x por semana

1. **POST /enrollments**
   - Matricula João no plano "Mensal 2x semana"
   - Sistema automaticamente cria 12 parcelas mensais no financeiro

2. **POST /enrollments/{id}/enroll-in-class** (primeira turma)
   - Adiciona João na turma "Tênis Segunda 18h"

3. **POST /enrollments/{id}/enroll-in-class** (segunda turma)
   - Adiciona João na turma "Tênis Quarta 18h"

**Resultado**: João está oficialmente matriculado, pode frequentar as aulas, e as cobranças já estão no sistema.

---

### 📌 Fluxo 2: Dia de Aula Normal

**Cenário**: Hoje é segunda-feira, dia de aulas

1. **POST /attendance/generate-logs** (automático às 6h da manhã)
   - Sistema cria logs de todas as turmas de segunda
   - Cria lista de presença com todos os alunos ativos

2. **GET /attendance/class-log/{id}** (professor abre às 19h)
   - Vê lista com 12 alunos
   - 2 estão marcados em vermelho (pagamento atrasado)

3. **POST /attendance/mark/{id}** (para cada aluno)
   - Marca 10 alunos como presentes
   - Marca 2 como ausentes (faltaram)

**Resultado**: Presença registrada, sistema calcula estatísticas, detecta 1 aluno com 3 faltas consecutivas (risco de evasão).

---

### 📌 Fluxo 3: Cancelamento por Chuva

**Cenário**: Choveu forte às 18h, turma das 19h será cancelada

1. **POST /attendance/cancel-class/{classLogId}**
   - Motivo: CANCELADA_CHUVA
   - Detalhes: "Chuva forte com raios"

2. Sistema automaticamente:
   - Marca aula como cancelada
   - Marca `needs_replacement = true`
   - Todos os 12 alunos da turma ganham 1 crédito de reposição

3. Gestor depois cria "Aula Extra Sábado 10h" e convida esses alunos

**Resultado**: Alunos não perdem aula paga, têm direito a reposição.

---

### 📌 Fluxo 4: Aula Experimental

**Cenário**: Maria quer experimentar antes de pagar

1. Gestor adiciona Maria manualmente na lista de presença da próxima aula
   - Marca `is_experimental = true`
   - Sistema **não valida** se tem pagamento

2. **GET /attendance/class-log/{id}**
   - Maria aparece na lista com tag "EXPERIMENTAL"

3. **POST /attendance/mark/{id}**
   - Marca Maria como presente

4. Após a aula:
   - Se Maria gostar → **POST /enrollments** (matrícula oficial)
   - Se não gostar → Nada acontece, registro fica como histórico

**Resultado**: Sistema permite aula sem pagamento, mas rastreia para funil de vendas.

---

## 📊 RELATÓRIOS E CONSULTAS ÚTEIS

### 🔍 Como saber se um aluno está inadimplente?
Ao buscar a lista de chamada (`GET /attendance/class-log/{id}`), o retorno já inclui o campo `has_overdue_payment` para cada aluno.

### 🔍 Como ver quantas aulas de reposição um aluno tem?
Na busca da matrícula (`GET /enrollments/{id}`), o sistema calcula e retorna o número de aulas canceladas que o aluno tem direito a repor.

### 🔍 Como saber se uma turma está lotada?
Na busca da turma (`GET /classes/{id}`), o retorno inclui `available_slots` (vagas disponíveis) e `is_full` (se está lotada).

### 🔍 Como identificar alunos com risco de evasão?
O sistema rastreia "ausências consecutivas". Alunos com 3+ faltas seguidas devem ser abordados pela equipe comercial.

---

## ⚠️ REGRAS DE NEGÓCIO IMPORTANTES

### 🔐 Regras de Validação

1. **Limite de Turmas**:
   - Aluno com plano "1x semana" só pode estar em 1 turma
   - Sistema bloqueia tentativa de adicionar em segunda turma

2. **Turma Lotada**:
   - Se turma tem `max_students = 10` e já tem 10 alunos
   - Sistema bloqueia nova matrícula com mensagem de erro

3. **Status da Matrícula**:
   - Alunos INATIVOS ou SUSPENSOS não aparecem na lista de chamada
   - Mesmo que estejam vinculados a turmas

4. **Integração Financeira**:
   - **TODA** matrícula cria contas a receber
   - Não é possível criar matrícula sem gerar cobrança
   - Exceção: Aulas experimentais não geram cobrança

---

## 🎨 INDICADORES VISUAIS RECOMENDADOS

### Para Lista de Chamada:
- 🔴 **Vermelho**: Aluno com pagamento atrasado
- 🔵 **Azul**: Aula experimental
- 🟡 **Amarelo**: Aluno com 2+ faltas consecutivas
- 🟢 **Verde**: Tudo OK

### Para Status de Matrícula:
- ✅ **ATIVO**: Verde
- ⏸️ **SUSPENSO**: Amarelo
- ❌ **INATIVO**: Vermelho

### Para Status de Aula:
- ✅ **REALIZADA**: Verde
- ☁️ **CANCELADA_CHUVA**: Azul (com ícone de reposição)
- 🔧 **CANCELADA_MANUTENCAO**: Laranja (com ícone de reposição)
- 📅 **CANCELADA_FERIADO**: Cinza
- ❌ **CANCELADA_OUTRO**: Vermelho

---

## 🔄 AUTOMAÇÕES RECOMENDADAS

### Tarefas Diárias (Cron/Schedule)

**6h da manhã**: Gerar logs de aula do dia
```
POST /attendance/generate-logs
{ "date": "hoje" }
```

**8h da manhã**: Verificar inadimplentes
- Sistema varre todas as matrículas ativas
- Identifica quem tem parcela atrasada
- Envia lista para equipe financeira

**22h da noite**: Relatório de presença do dia
- Quantas aulas foram realizadas
- Taxa de presença média
- Alunos que faltaram

---

## 📱 SUGESTÕES PARA FRONTEND

### Tela do Professor (App Mobile)
- Botão grande: "Aulas de Hoje"
- Lista de alunos com checkbox
- Destaque visual para inadimplentes
- Botão "Cancelar Aula" de fácil acesso

### Tela do Gestor (Web)
- Dashboard com ocupação das quadras
- Gráfico de presença por turma
- Alertas: turmas com baixa frequência
- Lista de inadimplentes
- Lista de alunos experimentais que não matricularam

### Tela do Aluno (App/Portal)
- Minhas turmas e horários
- Minhas presenças e faltas
- Aulas de reposição disponíveis
- Situação financeira

---

## 🆘 PERGUNTAS FREQUENTES

**P: O que acontece se eu deletar um plano que tem matrículas ativas?**
R: O sistema bloqueia a exclusão. É necessário primeiro inativar todas as matrículas vinculadas.

**P: Posso mudar o plano de um aluno depois de matriculado?**
R: O sistema atual não tem endpoint de "upgrade/downgrade". Recomenda-se criar uma nova matrícula e inativar a antiga.

**P: Como funciona a geração de parcelas?**
R: Automática na criação da matrícula. Plano MENSAL gera 12 parcelas, TRIMESTRAL gera 4, etc.

**P: Aluno experimental conta para lotação da turma?**
R: Sim, ocupa vaga física. Mas você pode gerenciar isso manualmente não adicionando-os em turmas fixas.

**P: Como sei quantos alunos vieram em uma aula específica?**
R: Na lista de chamada, conte quantos têm `is_present = true`.

---

## 📞 SUPORTE TÉCNICO

Para dúvidas sobre implementação, integração ou customizações, consulte:
- Documentação técnica completa: `PLANO_IMPLEMENTACAO_EFFISPOT.md`
- Código fonte: `app/Domains/Effispot/`

---

**Versão da API**: 1.0
**Última atualização**: 05/01/2026
**Documentação criada por**: Sistema Effispot

---

✨ **Dica Final**: Todas as rotas retornam JSON. Use Postman ou Insomnia para testar cada endpoint antes de integrar no frontend!
