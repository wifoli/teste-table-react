# 📊 Documentação Completa - Charts

Guia detalhado de todas as props disponíveis para cada tipo de gráfico.

---

## 📑 Índice

1. [Props Base (Comuns a Todos)](#props-base-comuns-a-todos)
2. [LineChart](#linechart)
3. [BarChart](#barchart)
4. [PieChart](#piechart)
5. [DoughnutChart](#doughnutchart)
6. [RadarChart](#radarchart)
7. [PolarAreaChart](#polarareachart)
8. [BubbleChart](#bubblechart)
9. [ScatterChart](#scatterchart)
10. [ComboChart](#combochart)
11. [GaugeChart](#gaugechart)
12. [FunnelChart](#funnelchart)
13. [TreemapChart](#treemapchart)
14. [Paletas de Cores](#paletas-de-cores)
15. [Hooks Disponíveis](#hooks-disponíveis)

---

## Props Base (Comuns a Todos)

Estas props estão disponíveis em **todos** os componentes de gráfico (exceto os especiais que têm comportamento próprio).

### Dimensões e Layout

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `width` | `string \| number` | `"100%"` | Largura do gráfico. Aceita pixels (`300`) ou CSS (`"100%"`, `"50vw"`) |
| `height` | `string \| number` | - | Altura do gráfico. Se não definida, usa `aspectRatio` |
| `className` | `string` | - | Classes CSS adicionais para o container |
| `style` | `CSSProperties` | - | Estilos inline para o container |
| `responsive` | `boolean` | `true` | Se `true`, o gráfico redimensiona automaticamente com o container |
| `maintainAspectRatio` | `boolean` | `true` | Se `true`, mantém proporção ao redimensionar |
| `aspectRatio` | `number` | `2` | Proporção largura/altura (ex: `2` = largura é 2x a altura) |

**Quando usar:**
- `width/height`: Quando precisa de dimensões fixas
- `responsive: false`: Em dashboards com layout fixo
- `aspectRatio`: Para manter proporção consistente entre gráficos

```tsx
// Gráfico com dimensões fixas
<LineChart width={600} height={400} responsive={false} {...} />

// Gráfico responsivo com proporção 16:9
<LineChart aspectRatio={16/9} {...} />

// Gráfico que preenche o container
<LineChart width="100%" height={300} maintainAspectRatio={false} {...} />
```

---

### Cores

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `colorPalette` | `ColorPalette` | `"default"` | Paleta de cores pré-definida |
| `colors` | `string[]` | - | Array de cores customizadas (sobrescreve paleta) |

**Paletas disponíveis:** `"default"`, `"pastel"`, `"vibrant"`, `"monochrome"`, `"warm"`, `"cool"`, `"corporate"`

**Quando usar:**
- `colorPalette`: Para manter consistência visual no projeto
- `colors`: Quando precisa de cores específicas da marca ou destaque

```tsx
// Usando paleta
<PieChart colorPalette="pastel" {...} />

// Cores customizadas
<PieChart colors={["#FF6384", "#36A2EB", "#FFCE56"]} {...} />

// Mix: paleta + override de uma cor específica
<BarChart 
    colorPalette="corporate"
    datasets={[
        { label: "Vendas", data: [...], backgroundColor: "#FF0000" }, // Override
        { label: "Meta", data: [...] }, // Usa paleta
    ]}
/>
```

---

### Legenda

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `showLegend` | `boolean` | `true` | Exibe ou oculta a legenda |
| `legendPosition` | `LegendPosition` | `"top"` | Posição da legenda |

**Posições:** `"top"`, `"bottom"`, `"left"`, `"right"`, `"none"`

**Quando usar:**
- `showLegend: false`: Gráficos pequenos ou quando há apenas 1 dataset
- `legendPosition: "right"`: Gráficos de pizza/rosca para melhor leitura
- `legendPosition: "bottom"`: Quando há muitos itens na legenda

```tsx
// Sem legenda (gráfico simples)
<LineChart showLegend={false} {...} />

// Legenda à direita (comum em pie/doughnut)
<PieChart legendPosition="right" {...} />

// Legenda embaixo (muitos datasets)
<BarChart legendPosition="bottom" {...} />
```

---

### Títulos

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `title` | `string` | - | Título principal do gráfico |
| `subtitle` | `string` | - | Subtítulo (menor, abaixo do título) |

**Quando usar:**
- `title`: Sempre que o gráfico estiver isolado ou precisar de contexto
- `subtitle`: Para informações complementares (período, unidade, fonte)

```tsx
<BarChart
    title="Vendas Trimestrais"
    subtitle="Valores em milhares de reais (R$)"
    {...}
/>
```

---

### Tooltip

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `tooltipFormat` | `TooltipFormat` | `"default"` | Formato pré-definido do tooltip |
| `tooltipFormatter` | `(value, label, datasetLabel?) => string` | - | Função customizada para formatar tooltip |

**Formatos:** `"default"`, `"currency"`, `"percent"`, `"number"`

**Quando usar:**
- `tooltipFormat: "currency"`: Valores monetários
- `tooltipFormat: "percent"`: Percentuais
- `tooltipFormatter`: Formatação complexa ou específica

```tsx
// Formato moeda brasileira
<BarChart tooltipFormat="currency" {...} />

// Formato percentual
<PieChart tooltipFormat="percent" {...} />

// Formatação customizada
<LineChart
    tooltipFormatter={(value, label, dataset) => 
        `${dataset}: ${value.toLocaleString('pt-BR')} unidades em ${label}`
    }
    {...}
/>
```

---

### Animação

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `animated` | `boolean` | `true` | Habilita/desabilita animações |
| `animationDuration` | `number` | `400` | Duração da animação em milissegundos |

**Quando usar:**
- `animated: false`: Dashboards com atualização frequente, impressão
- `animationDuration: 1000`: Apresentações, destaque visual

```tsx
// Sem animação (atualização em tempo real)
<LineChart animated={false} {...} />

// Animação lenta (apresentação)
<BarChart animationDuration={1500} {...} />
```

---

### Estados

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `loading` | `boolean` | `false` | Exibe estado de carregamento |
| `error` | `string` | - | Exibe mensagem de erro |

**Quando usar:**
- `loading`: Durante fetch de dados da API
- `error`: Quando a requisição falha

```tsx
const { data, isLoading, error } = useQuery(...);

<BarChart
    loading={isLoading}
    error={error?.message}
    labels={data?.labels ?? []}
    datasets={data?.datasets ?? []}
/>
```

---

### Interatividade

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `onClick` | `(element) => void` | - | Callback ao clicar em um elemento |
| `onHover` | `(element \| null) => void` | - | Callback ao passar mouse sobre elemento |

**Estrutura do `element`:**
```ts
{
    datasetIndex: number;  // Índice do dataset
    index: number;         // Índice do item no dataset
    value: number;         // Valor do ponto
}
```

**Quando usar:**
- `onClick`: Drill-down, navegação, ações
- `onHover`: Destacar informações, sincronizar com outros componentes

```tsx
<BarChart
    onClick={({ datasetIndex, index, value }) => {
        console.log(`Dataset ${datasetIndex}, Item ${index}: ${value}`);
        navigate(`/details/${labels[index]}`);
    }}
    onHover={(element) => {
        setHighlighted(element?.index ?? null);
    }}
    {...}
/>
```

---

### Avançado

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `chartOptions` | `Partial<ChartOptions>` | - | Opções extras do Chart.js (merge com padrões) |
| `plugins` | `Plugin[]` | - | Plugins customizados do Chart.js |
| `id` | `string` | - | ID único do gráfico (útil para referência) |

**Quando usar:**
- `chartOptions`: Configurações avançadas não expostas nas props
- `plugins`: Funcionalidades customizadas (anotações, zoom, etc.)

```tsx
<LineChart
    chartOptions={{
        scales: {
            y: {
                max: 100,
                min: 0,
            }
        },
        plugins: {
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        yMin: 50,
                        yMax: 50,
                        borderColor: 'red',
                    }
                }
            }
        }
    }}
    {...}
/>
```

---

## LineChart

Gráfico de linhas para visualizar tendências ao longo do tempo ou categorias.

### Props Específicas

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `labels` | `string[]` | **required** | Labels do eixo X |
| `datasets` | `ChartDataset[]` | **required** | Arrays de dados |
| `fill` | `boolean` | `false` | Preenche área abaixo da linha |
| `tension` | `number` | `0.4` | Curvatura da linha (0 = reta, 1 = muito curva) |
| `showPoints` | `boolean` | `true` | Exibe pontos nos dados |
| `pointRadius` | `number` | `4` | Tamanho dos pontos |
| `stepped` | `boolean \| "before" \| "after" \| "middle"` | `false` | Linha em degraus |
| `showGrid` | `boolean` | `true` | Exibe grade de fundo |
| `beginAtZero` | `boolean` | `true` | Eixo Y começa em zero |
| `yAxisLabel` | `string` | - | Label do eixo Y |
| `xAxisLabel` | `string` | - | Label do eixo X |
| `dualAxis` | `boolean` | `false` | Habilita segundo eixo Y |
| `y2AxisLabel` | `string` | - | Label do segundo eixo Y |

### Estrutura do Dataset

```ts
interface ChartDataset {
    label: string;           // Nome exibido na legenda
    data: number[];          // Valores
    backgroundColor?: string; // Cor de preenchimento
    borderColor?: string;     // Cor da linha
    borderWidth?: number;     // Espessura da linha
    fill?: boolean;           // Override do fill global
    tension?: number;         // Override da tensão global
    yAxisID?: string;         // "y" ou "y2" para dual axis
    hidden?: boolean;         // Inicia oculto
}
```

### Exemplos de Uso

```tsx
// Linha simples
<LineChart
    labels={["Jan", "Fev", "Mar", "Abr", "Mai"]}
    datasets={[
        { label: "Vendas", data: [65, 59, 80, 81, 56] }
    ]}
/>

// Área preenchida com curva suave
<LineChart
    labels={["Jan", "Fev", "Mar", "Abr", "Mai"]}
    datasets={[
        { label: "Usuários", data: [100, 150, 200, 180, 250] }
    ]}
    fill={true}
    tension={0.4}
    colorPalette="cool"
/>

// Linha reta (sem curva)
<LineChart
    labels={["Q1", "Q2", "Q3", "Q4"]}
    datasets={[
        { label: "Meta", data: [100, 100, 100, 100] }
    ]}
    tension={0}
    showPoints={false}
/>

// Linha em degraus (step)
<LineChart
    labels={["Jan", "Fev", "Mar", "Abr"]}
    datasets={[
        { label: "Preço", data: [10, 15, 15, 20] }
    ]}
    stepped="after"
/>

// Dois eixos Y (dual axis)
<LineChart
    labels={["Jan", "Fev", "Mar"]}
    datasets={[
        { label: "Receita (R$)", data: [10000, 15000, 20000], yAxisID: "y" },
        { label: "Clientes", data: [50, 80, 120], yAxisID: "y2" }
    ]}
    dualAxis
    yAxisLabel="Receita (R$)"
    y2AxisLabel="Nº Clientes"
/>

// Múltiplas linhas comparativas
<LineChart
    labels={["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"]}
    datasets={[
        { label: "2024", data: [65, 59, 80, 81, 56, 55] },
        { label: "2023", data: [28, 48, 40, 19, 86, 27] },
        { label: "2022", data: [35, 42, 55, 60, 48, 50] }
    ]}
    title="Comparativo Anual"
    colorPalette="vibrant"
/>
```

### Quando Usar

✅ **Use LineChart para:**
- Tendências ao longo do tempo
- Comparação de séries temporais
- Dados contínuos
- Projeções e metas

❌ **Evite para:**
- Categorias sem ordem (use BarChart)
- Proporções de um todo (use PieChart)
- Poucos pontos de dados (< 3)

---

## BarChart

Gráfico de barras para comparar valores entre categorias.

### Props Específicas

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `labels` | `string[]` | **required** | Labels das categorias |
| `datasets` | `ChartDataset[]` | **required** | Arrays de dados |
| `horizontal` | `boolean` | `false` | Barras horizontais |
| `stacked` | `boolean` | `false` | Barras empilhadas |
| `barThickness` | `number \| "flex"` | - | Espessura das barras |
| `borderRadius` | `number` | `4` | Arredondamento dos cantos |
| `showGrid` | `boolean` | `true` | Exibe grade de fundo |
| `beginAtZero` | `boolean` | `true` | Eixo de valor começa em zero |
| `yAxisLabel` | `string` | - | Label do eixo Y |
| `xAxisLabel` | `string` | - | Label do eixo X |

### Exemplos de Uso

```tsx
// Barras verticais simples
<BarChart
    labels={["Produto A", "Produto B", "Produto C"]}
    datasets={[
        { label: "Vendas", data: [300, 450, 200] }
    ]}
/>

// Barras horizontais (bom para labels longos)
<BarChart
    labels={["Departamento de Marketing", "Departamento de Vendas", "TI"]}
    datasets={[
        { label: "Orçamento", data: [50000, 80000, 120000] }
    ]}
    horizontal
    tooltipFormat="currency"
/>

// Barras agrupadas (comparação)
<BarChart
    labels={["Q1", "Q2", "Q3", "Q4"]}
    datasets={[
        { label: "Receita", data: [120, 150, 180, 200] },
        { label: "Despesas", data: [80, 90, 100, 110] }
    ]}
    title="Resultado Trimestral"
/>

// Barras empilhadas (composição)
<BarChart
    labels={["Jan", "Fev", "Mar"]}
    datasets={[
        { label: "Online", data: [50, 60, 70] },
        { label: "Loja Física", data: [30, 35, 40] },
        { label: "Parceiros", data: [20, 25, 30] }
    ]}
    stacked
    title="Vendas por Canal"
/>

// Barras com cantos muito arredondados
<BarChart
    labels={["A", "B", "C", "D"]}
    datasets={[{ label: "Valor", data: [10, 20, 15, 25] }]}
    borderRadius={20}
    barThickness={40}
/>
```

### Quando Usar

✅ **Use BarChart para:**
- Comparar valores entre categorias
- Rankings
- Dados discretos/categóricos
- Composição (stacked)

❌ **Evite para:**
- Tendências temporais longas (use LineChart)
- Muitas categorias (> 10, considere horizontal)
- Proporções de 100% (use PieChart)

---

## PieChart

Gráfico de pizza para mostrar proporções de um todo.

### Props Específicas

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `labels` | `string[]` | **required** | Labels das fatias |
| `data` | `number[]` | **required** | Valores das fatias |
| `showValues` | `boolean` | `false` | Mostra valores nas fatias |
| `valueFormat` | `"value" \| "percent" \| "both"` | `"value"` | Formato dos valores |
| `borderWidth` | `number` | `2` | Espessura da borda entre fatias |
| `borderColor` | `string` | `"#ffffff"` | Cor da borda |
| `hoverOffset` | `number` | `8` | Offset ao passar mouse |
| `rotation` | `number` | `0` | Rotação inicial (graus) |
| `circumference` | `number` | `360` | Arco total (graus) |

### Exemplos de Uso

```tsx
// Pizza simples
<PieChart
    labels={["Desktop", "Mobile", "Tablet"]}
    data={[55, 35, 10]}
    title="Tráfego por Dispositivo"
/>

// Com valores percentuais nas fatias
<PieChart
    labels={["Aprovado", "Reprovado", "Pendente"]}
    data={[120, 30, 15]}
    showValues
    valueFormat="percent"
/>

// Semi-círculo (180°)
<PieChart
    labels={["Concluído", "Restante"]}
    data={[75, 25]}
    rotation={-90}
    circumference={180}
/>

// Cores customizadas
<PieChart
    labels={["Sim", "Não", "Talvez"]}
    data={[60, 25, 15]}
    colors={["#22C55E", "#EF4444", "#F59E0B"]}
/>
```

### Quando Usar

✅ **Use PieChart para:**
- Proporções de um todo (100%)
- 2-6 categorias
- Destaque de uma fatia dominante

❌ **Evite para:**
- Muitas categorias (> 6)
- Valores similares (difícil comparar)
- Dados que não somam um todo
- Comparações precisas (use BarChart)

---

## DoughnutChart

Gráfico de rosca (pizza com furo no centro).

### Props Específicas

Herda todas as props do PieChart, mais:

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `cutout` | `number \| string` | `"60%"` | Tamanho do corte central |
| `centerText` | `string` | - | Texto exibido no centro |
| `centerSubtext` | `string` | - | Subtexto abaixo do texto central |

### Exemplos de Uso

```tsx
// Rosca com texto central
<DoughnutChart
    labels={["Concluído", "Em Progresso", "Pendente"]}
    data={[60, 25, 15]}
    cutout="70%"
    centerText="60%"
    centerSubtext="Concluído"
/>

// Rosca fina (alto cutout)
<DoughnutChart
    labels={["Usado", "Livre"]}
    data={[75, 25]}
    cutout="85%"
    centerText="75GB"
    centerSubtext="de 100GB"
/>

// Rosca grossa (baixo cutout)
<DoughnutChart
    labels={["A", "B", "C"]}
    data={[40, 35, 25]}
    cutout="30%"
/>

// Múltiplas métricas no centro
<DoughnutChart
    labels={["Online", "Offline"]}
    data={[847, 153]}
    cutout="75%"
    centerText="847"
    centerSubtext="Usuários Online"
    showValues
    valueFormat="percent"
/>
```

### Quando Usar

✅ **Use DoughnutChart para:**
- Mesmos casos do PieChart
- Quando precisa de texto/métrica central
- Visual mais moderno
- Dashboards com KPIs

---

## RadarChart

Gráfico de radar para comparar múltiplas variáveis.

### Props Específicas

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `labels` | `string[]` | **required** | Labels dos eixos (vértices) |
| `datasets` | `ChartDataset[]` | **required** | Arrays de dados |
| `fill` | `boolean` | `true` | Preenche área |
| `showScale` | `boolean` | `true` | Exibe escala numérica |
| `showGridLines` | `boolean` | `true` | Exibe linhas do radar |
| `suggestedMin` | `number` | - | Valor mínimo da escala |
| `suggestedMax` | `number` | - | Valor máximo da escala |
| `stepSize` | `number` | - | Intervalo entre níveis |

### Exemplos de Uso

```tsx
// Radar simples
<RadarChart
    labels={["Velocidade", "Força", "Resistência", "Técnica", "Agilidade"]}
    datasets={[
        { label: "Atleta", data: [85, 75, 90, 60, 80] }
    ]}
/>

// Comparação de dois perfis
<RadarChart
    labels={["Comunicação", "Técnico", "Liderança", "Criatividade", "Organização"]}
    datasets={[
        { label: "João", data: [80, 90, 70, 85, 75] },
        { label: "Maria", data: [90, 75, 85, 70, 95] }
    ]}
    fill
    suggestedMax={100}
/>

// Sem preenchimento (só linhas)
<RadarChart
    labels={["A", "B", "C", "D", "E", "F"]}
    datasets={[
        { label: "Atual", data: [65, 59, 90, 81, 56, 55] },
        { label: "Meta", data: [80, 80, 80, 80, 80, 80] }
    ]}
    fill={false}
/>

// Escala customizada
<RadarChart
    labels={["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"]}
    datasets={[{ label: "Vendas", data: [28, 48, 40, 19, 86, 27] }]}
    suggestedMin={0}
    suggestedMax={100}
    stepSize={20}
/>
```

### Quando Usar

✅ **Use RadarChart para:**
- Perfis multidimensionais (skills, atributos)
- Comparação de 2-3 entidades em múltiplas métricas
- Análise de gaps
- 5-8 variáveis

❌ **Evite para:**
- Poucas variáveis (< 4)
- Muitas variáveis (> 10)
- Comparar muitas entidades (> 3)
- Valores com escalas muito diferentes

---

## PolarAreaChart

Similar ao PieChart, mas fatias têm mesmo ângulo e variam em raio.

### Props Específicas

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `labels` | `string[]` | **required** | Labels das fatias |
| `data` | `number[]` | **required** | Valores das fatias |
| `startFromTop` | `boolean` | `true` | Primeira fatia no topo |
| `showScale` | `boolean` | `true` | Exibe escala circular |
| `borderWidth` | `number` | `2` | Espessura das bordas |

### Exemplos de Uso

```tsx
// Polar area simples
<PolarAreaChart
    labels={["Marketing", "Vendas", "TI", "RH", "Financeiro"]}
    data={[300, 250, 200, 150, 180]}
    title="Orçamento por Departamento"
/>

// Começando da direita
<PolarAreaChart
    labels={["Q1", "Q2", "Q3", "Q4"]}
    data={[120, 150, 180, 90]}
    startFromTop={false}
/>
```

### Quando Usar

✅ **Use PolarAreaChart para:**
- Comparar magnitudes mantendo categorias visíveis
- Alternativa visual ao PieChart
- Dados cíclicos

---

## BubbleChart

Gráfico de bolhas para três dimensões de dados (X, Y, tamanho).

### Props Específicas

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `datasets` | `BubbleDataset[]` | **required** | Arrays de pontos |
| `xAxisLabel` | `string` | - | Label do eixo X |
| `yAxisLabel` | `string` | - | Label do eixo Y |
| `showGrid` | `boolean` | `true` | Exibe grade |

### Estrutura do BubbleDataset

```ts
interface BubbleDataset {
    label: string;
    data: Array<{
        x: number;  // Posição X
        y: number;  // Posição Y
        r: number;  // Raio da bolha
    }>;
    backgroundColor?: string;
    borderColor?: string;
}
```

### Exemplos de Uso

```tsx
// Análise de mercado
<BubbleChart
    datasets={[
        {
            label: "Produto A",
            data: [
                { x: 20, y: 30, r: 15 },  // market share, growth, revenue
                { x: 40, y: 10, r: 10 }
            ]
        },
        {
            label: "Produto B",
            data: [
                { x: 30, y: 20, r: 25 }
            ]
        }
    ]}
    xAxisLabel="Participação de Mercado (%)"
    yAxisLabel="Crescimento (%)"
    title="Análise BCG"
/>
```

### Quando Usar

✅ **Use BubbleChart para:**
- Três dimensões de dados
- Análises tipo BCG/GE Matrix
- Correlações com magnitude

---

## ScatterChart

Gráfico de dispersão para correlações entre duas variáveis.

### Props Específicas

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `datasets` | `ScatterDataset[]` | **required** | Arrays de pontos |
| `xAxisLabel` | `string` | - | Label do eixo X |
| `yAxisLabel` | `string` | - | Label do eixo Y |
| `showGrid` | `boolean` | `true` | Exibe grade |
| `showTrendline` | `boolean` | `false` | Exibe linha de tendência |

### Estrutura do ScatterDataset

```ts
interface ScatterDataset {
    label: string;
    data: Array<{
        x: number;
        y: number;
    }>;
    backgroundColor?: string;
    pointRadius?: number;
}
```

### Exemplos de Uso

```tsx
// Correlação simples
<ScatterChart
    datasets={[
        {
            label: "Amostras",
            data: [
                { x: 10, y: 20 },
                { x: 15, y: 25 },
                { x: 20, y: 35 },
                { x: 25, y: 40 },
                { x: 30, y: 45 }
            ]
        }
    ]}
    xAxisLabel="Horas de Estudo"
    yAxisLabel="Nota"
/>

// Com linha de tendência
<ScatterChart
    datasets={[
        {
            label: "Dados",
            data: [
                { x: 5, y: 12 },
                { x: 10, y: 19 },
                { x: 15, y: 28 },
                { x: 20, y: 35 },
                { x: 25, y: 42 }
            ]
        }
    ]}
    showTrendline
    title="Regressão Linear"
/>

// Múltiplos grupos
<ScatterChart
    datasets={[
        {
            label: "Grupo A",
            data: [{ x: 10, y: 20 }, { x: 15, y: 25 }]
        },
        {
            label: "Grupo B",
            data: [{ x: 30, y: 40 }, { x: 35, y: 45 }]
        }
    ]}
/>
```

### Quando Usar

✅ **Use ScatterChart para:**
- Análise de correlação
- Identificar clusters
- Outliers
- Regressão

---

## ComboChart

Gráfico misto combinando linhas e barras.

### Props Específicas

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `labels` | `string[]` | **required** | Labels do eixo X |
| `datasets` | `ComboDataset[]` | **required** | Datasets com tipo especificado |
| `showGrid` | `boolean` | `true` | Exibe grade |
| `beginAtZero` | `boolean` | `true` | Eixo Y começa em zero |
| `yAxisLabel` | `string` | - | Label do eixo Y |
| `xAxisLabel` | `string` | - | Label do eixo X |
| `dualAxis` | `boolean` | `false` | Segundo eixo Y |
| `y2AxisLabel` | `string` | - | Label do segundo eixo |

### Estrutura do ComboDataset

```ts
interface ComboDataset extends ChartDataset {
    type: "line" | "bar";  // OBRIGATÓRIO
    yAxisID?: "y" | "y2";  // Para dual axis
}
```

### Exemplos de Uso

```tsx
// Vendas (barra) vs Meta (linha)
<ComboChart
    labels={["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"]}
    datasets={[
        { type: "bar", label: "Vendas", data: [65, 59, 80, 81, 56, 55] },
        { type: "line", label: "Meta", data: [60, 60, 70, 75, 70, 65], fill: false }
    ]}
    title="Vendas vs Meta"
/>

// Dois eixos (unidades diferentes)
<ComboChart
    labels={["Jan", "Fev", "Mar", "Abr"]}
    datasets={[
        { type: "bar", label: "Receita (R$)", data: [12000, 15000, 18000, 22000], yAxisID: "y" },
        { type: "line", label: "Clientes", data: [150, 180, 210, 250], yAxisID: "y2" }
    ]}
    dualAxis
    yAxisLabel="Receita (R$)"
    y2AxisLabel="Nº Clientes"
/>

// Múltiplas barras + linha
<ComboChart
    labels={["Q1", "Q2", "Q3", "Q4"]}
    datasets={[
        { type: "bar", label: "Online", data: [30, 40, 45, 50] },
        { type: "bar", label: "Loja", data: [50, 55, 60, 65] },
        { type: "line", label: "Total", data: [80, 95, 105, 115] }
    ]}
/>
```

### Quando Usar

✅ **Use ComboChart para:**
- Valores absolutos + metas/médias
- Métricas com unidades diferentes (dual axis)
- Destaque de tendência sobre categorias

---

## GaugeChart

Gráfico de medidor/velocímetro para indicadores únicos.

### Props Específicas

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `value` | `number` | **required** | Valor atual |
| `min` | `number` | `0` | Valor mínimo |
| `max` | `number` | `100` | Valor máximo |
| `label` | `string` | - | Label abaixo do valor |
| `suffix` | `string` | `""` | Sufixo do valor (%, km/h, etc) |
| `color` | `string \| ((value, min, max) => string)` | Auto | Cor ou função para cor dinâmica |
| `backgroundColor` | `string` | `"#E5E7EB"` | Cor da parte vazia |
| `arcThickness` | `number` | `20` | Espessura do arco (0-100) |
| `startAngle` | `number` | `-90` | Ângulo inicial (graus) |
| `sweepAngle` | `number` | `180` | Ângulo total (graus) |
| `showValue` | `boolean` | `true` | Mostra valor no centro |
| `showLabel` | `boolean` | `true` | Mostra label |
| `valueFormatter` | `(value) => string` | - | Formatador customizado |
| `segments` | `Array<{from, to, color}>` | - | Zonas coloridas |

### Exemplos de Uso

```tsx
// Gauge simples
<GaugeChart
    value={75}
    label="Performance"
    suffix="%"
/>

// Cor dinâmica baseada no valor
<GaugeChart
    value={85}
    min={0}
    max={100}
    label="CPU"
    suffix="%"
    color={(value) => {
        if (value < 50) return "#10B981";  // Verde
        if (value < 80) return "#F59E0B";  // Amarelo
        return "#EF4444";                   // Vermelho
    }}
/>

// Com segmentos/zonas
<GaugeChart
    value={68}
    min={0}
    max={100}
    label="Temperatura"
    suffix="°C"
    segments={[
        { from: 0, to: 30, color: "#3B82F6" },   // Frio
        { from: 30, to: 60, color: "#10B981" },  // Normal
        { from: 60, to: 80, color: "#F59E0B" },  // Alerta
        { from: 80, to: 100, color: "#EF4444" }  // Crítico
    ]}
/>

// Gauge completo (360°)
<GaugeChart
    value={72}
    startAngle={0}
    sweepAngle={360}
    arcThickness={15}
    label="Score"
/>

// Formatador customizado
<GaugeChart
    value={1500000}
    min={0}
    max={2000000}
    label="Receita"
    valueFormatter={(v) => `R$ ${(v/1000000).toFixed(1)}M`}
/>
```

### Quando Usar

✅ **Use GaugeChart para:**
- KPIs únicos
- Métricas com range definido
- Status/saúde do sistema
- Metas vs realizado

---

## FunnelChart

Gráfico de funil para processos sequenciais com conversão.

### Props Específicas

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `data` | `FunnelChartItem[]` | **required** | Etapas do funil |
| `showValues` | `boolean` | `true` | Mostra valores |
| `showPercentages` | `boolean` | `true` | Mostra % relativo ao topo |
| `showConversionRate` | `boolean` | `false` | Mostra taxa entre etapas |
| `valueFormat` | `"number" \| "currency" \| "compact"` | `"number"` | Formato dos valores |
| `direction` | `"vertical" \| "horizontal"` | `"vertical"` | Direção do funil |
| `variant` | `"funnel" \| "pyramid" \| "bars"` | `"funnel"` | Estilo visual |
| `gap` | `number` | `4` | Espaço entre etapas |
| `onItemClick` | `(item, index) => void` | - | Callback ao clicar |

### Estrutura do FunnelChartItem

```ts
interface FunnelChartItem {
    label: string;
    value: number;
    color?: string;  // Override da cor
}
```

### Exemplos de Uso

```tsx
// Funil de vendas
<FunnelChart
    data={[
        { label: "Visitantes", value: 10000 },
        { label: "Leads", value: 5000 },
        { label: "Oportunidades", value: 2000 },
        { label: "Propostas", value: 800 },
        { label: "Vendas", value: 300 }
    ]}
    title="Funil de Vendas"
    showConversionRate
/>

// Com valores monetários
<FunnelChart
    data={[
        { label: "Pipeline", value: 5000000 },
        { label: "Qualificado", value: 3000000 },
        { label: "Proposta", value: 1500000 },
        { label: "Negociação", value: 800000 },
        { label: "Fechado", value: 500000 }
    ]}
    valueFormat="currency"
    showPercentages
/>

// Estilo barras (não afunila)
<FunnelChart
    data={[
        { label: "Etapa 1", value: 100 },
        { label: "Etapa 2", value: 80 },
        { label: "Etapa 3", value: 60 },
        { label: "Etapa 4", value: 40 }
    ]}
    variant="bars"
/>

// Horizontal
<FunnelChart
    data={[
        { label: "Awareness", value: 1000 },
        { label: "Interest", value: 800 },
        { label: "Decision", value: 400 },
        { label: "Action", value: 200 }
    ]}
    direction="horizontal"
/>
```

### Quando Usar

✅ **Use FunnelChart para:**
- Processos de conversão
- Pipelines de vendas
- Jornada do cliente
- Processos com perda sequencial

---

## TreemapChart

Mapa de árvore para visualizar hierarquias e proporções.

### Props Específicas

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `data` | `TreemapItem[]` | **required** | Itens do treemap |
| `showLabels` | `boolean` | `true` | Mostra labels |
| `showValues` | `boolean` | `true` | Mostra valores |
| `valueFormat` | `"number" \| "currency" \| "percent" \| "compact"` | `"number"` | Formato |
| `padding` | `number` | `2` | Espaço entre blocos |
| `borderRadius` | `number` | `4` | Arredondamento |
| `minLabelSize` | `number` | `60` | Tamanho mínimo para mostrar label |
| `drillDown` | `boolean` | `false` | Permite navegação hierárquica |
| `onItemClick` | `(item) => void` | - | Callback ao clicar |
| `onItemHover` | `(item \| null) => void` | - | Callback ao hover |
| `renderTooltip` | `(item) => ReactNode` | - | Tooltip customizado |

### Estrutura do TreemapItem

```ts
interface TreemapItem {
    id: string | number;
    label: string;
    value: number;
    color?: string;
    children?: TreemapItem[];  // Para hierarquia
    data?: Record<string, unknown>;  // Dados extras
}
```

### Exemplos de Uso

```tsx
// Treemap simples
<TreemapChart
    data={[
        { id: 1, label: "Tecnologia", value: 450 },
        { id: 2, label: "Saúde", value: 320 },
        { id: 3, label: "Financeiro", value: 280 },
        { id: 4, label: "Consumo", value: 220 },
        { id: 5, label: "Industrial", value: 180 }
    ]}
    title="Alocação por Setor"
/>

// Com valores monetários
<TreemapChart
    data={[
        { id: "us", label: "EUA", value: 450000 },
        { id: "cn", label: "China", value: 380000 },
        { id: "jp", label: "Japão", value: 220000 },
        { id: "de", label: "Alemanha", value: 180000 },
        { id: "br", label: "Brasil", value: 150000 }
    ]}
    valueFormat="currency"
    colorPalette="corporate"
/>

// Com tooltip customizado
<TreemapChart
    data={items}
    onItemClick={(item) => navigate(`/details/${item.id}`)}
    renderTooltip={(item) => (
        <div className="bg-black text-white p-2 rounded">
            <strong>{item.label}</strong>
            <div>Valor: R$ {item.value.toLocaleString()}</div>
            <div>Share: {((item.value / total) * 100).toFixed(1)}%</div>
        </div>
    )}
/>

// Interativo com estado
const [selected, setSelected] = useState(null);

<TreemapChart
    data={data}
    onItemClick={setSelected}
    onItemHover={(item) => setHighlighted(item?.id)}
/>
```

### Quando Usar

✅ **Use TreemapChart para:**
- Visualizar proporções de muitas categorias
- Hierarquias (com drill-down)
- Comparar tamanhos relativos
- Dashboards com espaço limitado

---

## Paletas de Cores

### Cores de Cada Paleta

| Paleta | Cores | Uso Recomendado |
|--------|-------|-----------------|
| `default` | Azul, Verde, Âmbar, Vermelho, Violeta, Rosa, Ciano, Lima | Uso geral |
| `pastel` | Tons claros e suaves | Relatórios, apresentações leves |
| `vibrant` | Cores saturadas e intensas | Destaque, dashboards escuros |
| `monochrome` | Escala de cinza | Impressão P&B, minimalismo |
| `warm` | Vermelho, Laranja, Amarelo | Energia, urgência, calor |
| `cool` | Azul, Ciano, Verde-água | Calma, tecnologia, água |
| `corporate` | Tons escuros profissionais | Apresentações corporativas |

### Visualização

```
default:    ██ ██ ██ ██ ██ ██ ██ ██
            🔵 🟢 🟡 🔴 🟣 🩷 🩵 🟩

pastel:     ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░
            (tons claros)

vibrant:    ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓
            (tons intensos)

monochrome: ██ ▓▓ ▒▒ ░░
            (preto → branco)

warm:       🔴 🟠 🟡 🟨
            (quente)

cool:       🔵 🩵 🟦 🟢
            (frio)

corporate:  ▓▓ ▓▓ ▓▓ ▓▓
            (tons escuros)
```

---

## Hooks Disponíveis

### useChartData

Memoiza dados do gráfico evitando recálculos desnecessários.

```tsx
import { useChartData } from "./components/Charts";

const chartData = useChartData({
    type: "line",
    labels: ["Jan", "Fev", "Mar"],
    datasets: [{ label: "Vendas", data: [10, 20, 30] }],
    colorPalette: "vibrant",
    colors: undefined, // ou array de cores
});

// Retorna ChartData pronto para o Chart.js
```

### useChartOptions

Memoiza opções do gráfico com handlers estáveis.

```tsx
import { useChartOptions } from "./components/Charts";

const options = useChartOptions({
    type: "bar",
    legendPosition: "top",
    showLegend: true,
    title: "Meu Gráfico",
    tooltipFormat: "currency",
    animated: true,
    onClick: handleClick,
    onHover: handleHover,
});
```

### useLineChartOptions / useBarChartOptions

Hooks especializados com props específicas.

```tsx
import { useLineChartOptions, useBarChartOptions } from "./components/Charts";

// Para linha
const lineOptions = useLineChartOptions({
    showGrid: true,
    beginAtZero: true,
    yAxisLabel: "Valor",
    xAxisLabel: "Mês",
    // + todas as props base
});

// Para barra
const barOptions = useBarChartOptions({
    horizontal: false,
    stacked: true,
    showGrid: true,
    // + todas as props base
});
```

---

## Resumo Rápido

| Gráfico | Melhor Para | Evitar Quando |
|---------|-------------|---------------|
| **Line** | Tendências temporais | Categorias sem ordem |
| **Bar** | Comparar categorias | Muitas categorias (>10) |
| **Pie** | Proporções (2-6 itens) | Valores similares |
| **Doughnut** | Pie + métrica central | Mesmo que Pie |
| **Radar** | Perfis multidimensionais | Poucas variáveis (<4) |
| **PolarArea** | Alternativa ao Pie | Hierarquias |
| **Bubble** | 3 dimensões (x, y, tamanho) | Dados 2D simples |
| **Scatter** | Correlações | Dados categóricos |
| **Combo** | Valores + metas/tendências | Dados incompatíveis |
| **Gauge** | KPI único com range | Múltiplas métricas |
| **Funnel** | Processos de conversão | Dados não sequenciais |
| **Treemap** | Hierarquias e proporções | Poucos itens (<4) |
