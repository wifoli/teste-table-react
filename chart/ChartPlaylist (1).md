# ChartPlaylist

Motor de playlist para dashboards. Você monta os layouts externamente e passa para o componente — ele cuida de tudo: fullscreen, transições, progresso e controles.

---

## Conceito

```
Você monta os slides  →  ChartPlaylist exibe e gerencia
```

Cada **slide** é um layout React completo (seus gráficos, tabelas, qualquer coisa). O ChartPlaylist não sabe nem liga para o que está dentro — ele só avança, anima e controla o tempo.

---

## Instalação
ljy2C3C9NH4omIdMiFDdOH4ZK8lYT0FlNEVHk5Q2oe2Vc68w#-Z2Hc2dZeZdBPNzxCywQHm7nEsjSUMF5MrcimA0MEMI
Copie `ChartPlaylist.jsx` para o projeto. Sem dependências externas além do React.

```
packages/ui/src/components/ChartPlaylist/ChartPlaylist.jsx
```

---

## Uso básico

```tsx
import ChartPlaylist, {
  createSlide,
  PlaylistLayout,
  Row,
  Col,
  Cell,
  ScrollTable,
} from './ChartPlaylist';

// 1. Monte seus layouts
const slide1 = (
  <PlaylistLayout>
    <Row>
      <Cell title="Receita por Mês">
        <MeuBarChart />
      </Cell>
      <Cell title="Share de Mercado" weight={0.6}>
        <MeuPieChart />
      </Cell>
    </Row>
  </PlaylistLayout>
);

// 2. Crie os slides com metadados
const playlist = [
  createSlide(slide1, {
    title: "Resultado Mensal",
    subtitle: "Valores em R$ mil",
    duration: 10,
    transition: "slide",
  }),
  createSlide(slide2, {
    title: "Crescimento",
    duration: 8,
    transition: "zoom",
  }),
];

// 3. Passe para o componente
export default function Dashboard() {
  return <ChartPlaylist playlist={playlist} />;
}
```

---

## Layout Helpers

### `<PlaylistLayout>`

Wrapper raiz de cada slide. Sempre use como elemento externo.

```tsx
<PlaylistLayout
  background="#0a0f1e"   // cor de fundo (padrão: #05080f)
  padding="32px"         // padding interno (padrão: 24px)
>
  {/* seu layout aqui */}
</PlaylistLayout>
```

---

### `<Row>`

Divide o espaço horizontalmente entre `<Cell>`s.

```tsx
<Row gap={16} flex={1}>
  <Cell>...</Cell>
  <Cell>...</Cell>
</Row>
```

| Prop  | Tipo     | Padrão | Descrição |
|-------|----------|--------|-----------|
| `gap` | `number` | `16`   | Espaçamento entre células |
| `flex`| `number` | `1`    | Peso flex desta linha |

---

### `<Col>`

Divide o espaço verticalmente entre `<Cell>`s.

```tsx
<Col gap={16} flex={1}>
  <Cell>...</Cell>
  <Cell>...</Cell>
</Col>
```

Mesmos props que `<Row>`.

---

### `<Cell>`

Célula individual. Envolve automaticamente o conteúdo com fundo, borda e padding.

```tsx
<Cell
  title="Vendas Q1"    // título exibido no topo da célula (opcional)
  weight={2}           // tamanho relativo: 2 = ocupa o dobro do espaço
  noPad                // remove padding (quando o componente já tem padding próprio)
  background="#111"    // fundo customizado
>
  <MeuGrafico />
</Cell>
```

| Prop         | Tipo      | Padrão | Descrição |
|--------------|-----------|--------|-----------|
| `weight`     | `number`  | `1`    | Peso flex. Use `2` para dobrar o tamanho em relação às outras células |
| `title`      | `string`  | —      | Título exibido acima do conteúdo |
| `noPad`      | `boolean` | `false`| Remove o padding interno |
| `background` | `string`  | escuro | Cor de fundo da célula |

---

### `<ScrollTable>`

Wrapper que faz qualquer conteúdo rolar suavemente para baixo em loop. Use dentro de um `<Cell noPad>` para tabelas longas.

```tsx
<Cell title="Relatório de Clientes" noPad>
  <ScrollTable speed={0.4}>
    <MinhaTabela data={clientes} />
  </ScrollTable>
</Cell>
```

| Prop     | Tipo      | Padrão | Descrição |
|----------|-----------|--------|-----------|
| `speed`  | `number`  | `0.55` | Pixels por frame. Referência abaixo. |
| `active` | `boolean` | `true` | Liga/desliga o scroll. O player passa isso automaticamente. |

**Referência de velocidade:**

| Valor | Sensação |
|-------|----------|
| `0.3` | Lento — leitura confortável |
| `0.55`| Padrão |
| `1.0` | Rápido |
| `2.0+`| Muito rápido |

> O scroll recomeça do início ao chegar no final (loop infinito).

---

### `createSlide(layout, options)`

Monta o objeto de item da playlist.

```tsx
createSlide(
  <PlaylistLayout>...</PlaylistLayout>,
  {
    id?:         number | string,  // gerado automaticamente se omitido
    title:       string,           // obrigatório
    subtitle?:   string,
    duration?:   number,           // segundos (padrão: 8)
    transition?: string,           // id da transição (padrão: "fade")
  }
)
```

---

## Transições disponíveis

Use o `id` no campo `transition` do `createSlide`.

| ID         | Nome       | Efeito |
|------------|------------|--------|
| `fade`     | Fade       | Dissolve suavemente |
| `slide`    | Slide      | Entra pela direita, sai pela esquerda |
| `slideup`  | Deslizar   | Sobe de baixo para cima |
| `zoom`     | Zoom       | Cresce ao entrar, expande ao sair |
| `blur`     | Blur       | Desfoca na saída, foca na entrada |
| `flip`     | Flip 3D    | Rotação 3D no eixo Y |
| `scan`     | Scanner    | Revela da esquerda para a direita |

Também disponível como array exportado:

```tsx
import { TRANSITIONS } from './ChartPlaylist';
// [{ id, label, in, out }, ...]
```

---

## Layouts de exemplo

### 2 gráficos lado a lado

```tsx
const slide = (
  <PlaylistLayout>
    <Row>
      <Cell title="Receita">
        <MeuBarChart />
      </Cell>
      <Cell title="Tendência">
        <MeuLineChart />
      </Cell>
    </Row>
  </PlaylistLayout>
);
```

### 1 gráfico grande + 2 menores

```tsx
const slide = (
  <PlaylistLayout>
    <Row>
      <Cell title="Visão Geral" weight={2}>
        <MeuGraficoPrincipal />
      </Cell>
      <Col>
        <Cell title="Receita">
          <MeuGaugeChart value={82} />
        </Cell>
        <Cell title="Meta">
          <MeuGaugeChart value={67} />
        </Cell>
      </Col>
    </Row>
  </PlaylistLayout>
);
```

### Tabela com scroll automático em tela cheia

```tsx
const slide = (
  <PlaylistLayout>
    <Cell title="Relatório de Transações" noPad>
      <ScrollTable speed={0.45}>
        <MinhaDataTable data={transacoes} />
      </ScrollTable>
    </Cell>
  </PlaylistLayout>
);
```

### Grid 2x2

```tsx
const slide = (
  <PlaylistLayout>
    <Row>
      <Cell title="Vendas">   <MeuChart1 /> </Cell>
      <Cell title="Usuários"> <MeuChart2 /> </Cell>
    </Row>
    <Row>
      <Cell title="Ticket">   <MeuChart3 /> </Cell>
      <Cell title="Retenção"> <MeuChart4 /> </Cell>
    </Row>
  </PlaylistLayout>
);
```

### Com espaçamento entre linhas customizado

```tsx
<PlaylistLayout padding="32px">
  <Row gap={24} flex={2}>
    <Cell weight={3}><GraficoGrande /></Cell>
    <Cell weight={1}><GraficoPequeno /></Cell>
  </Row>
  <Row gap={24} flex={1}>
    <Cell><Metrica1 /></Cell>
    <Cell><Metrica2 /></Cell>
    <Cell><Metrica3 /></Cell>
  </Row>
</PlaylistLayout>
```

---

## Dados dinâmicos (API)

Os layouts são React nodes normais — busque os dados antes e componha:

```tsx
function useDashboardPlaylist() {
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    async function load() {
      const [vendas, usuarios, clientes] = await Promise.all([
        api.get('/charts/vendas'),
        api.get('/charts/usuarios'),
        api.get('/reports/clientes'),
      ]);

      setPlaylist([
        createSlide(
          <PlaylistLayout>
            <Row>
              <Cell title="Vendas por Mês">
                <BarChart labels={vendas.labels} datasets={vendas.datasets} />
              </Cell>
              <Cell title="Crescimento">
                <LineChart labels={usuarios.labels} datasets={usuarios.datasets} />
              </Cell>
            </Row>
          </PlaylistLayout>,
          { title: "Resultado Mensal", duration: 10, transition: "slide" }
        ),

        createSlide(
          <PlaylistLayout>
            <Cell title="Base de Clientes" noPad>
              <ScrollTable speed={0.4}>
                <DataTable data={clientes.rows} />
              </ScrollTable>
            </Cell>
          </PlaylistLayout>,
          { title: "Relatório de Clientes", duration: 30, transition: "fade" }
        ),
      ]);
    }

    load();
  }, []);

  return playlist;
}

// Uso:
export default function Dashboard() {
  const playlist = useDashboardPlaylist();
  return <ChartPlaylist playlist={playlist} />;
}
```

---

## Interface do gerenciador

A interface lateral do componente permite:

| Ação | Como |
|------|------|
| Reordenar slides | Botões ↑ ↓ em cada item |
| Editar metadados | Botão ✎ abre modal (título, subtítulo, duração, transição) |
| Remover slide | Botão ✕ |
| Iniciar de um slide específico | Botão ▶ pequeno no item ou "Play daqui" no preview |
| Pré-visualizar | Clique no item |

> O modal de edição **não altera o layout** — só título, subtítulo, duração e transição. Para alterar o conteúdo visual, atualize o array `playlist` externamente.

---

## Controles do player (tela cheia)

O HUD some automaticamente após ~4s e volta ao mover o mouse.

| Controle | Ação |
|----------|------|
| ⏮ | Slide anterior |
| ⏸ / ▶ | Pausar / Retomar |
| ⏭ | Próximo slide |
| Pontos | Ir direto para qualquer slide |
| Anel de progresso | Tempo restante do slide atual |
| ✕ ou ESC | Sair do player |

---

## TypeScript

```ts
import type { ReactNode } from 'react';

interface PlaylistItem {
  id:          number | string;
  title:       string;
  subtitle?:   string;
  duration:    number;        // segundos
  transition:  string;        // id de TRANSITIONS
  layout:      ReactNode;     // seu layout completo
}

interface ChartPlaylistProps {
  playlist?: PlaylistItem[];
}
```
