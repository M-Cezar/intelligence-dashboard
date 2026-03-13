# Design Concepts - Intelligence Dashboard

## Conceito Selecionado: **Modernismo Corporativo com Foco em Dados**

### Design Movement
**Data-Driven Minimalism** - Inspirado em dashboards financeiros premium (Bloomberg, Reuters) combinado com interfaces de tecnologia contemporânea (Figma, Linear).

### Core Principles
1. **Hierarquia Clara**: Informação crítica em primeiro plano, detalhes secundários discretos
2. **Densidade Informativa**: Máximo de dados sem poluição visual
3. **Ação Imediata**: Cada card é clicável, cada métrica é explorável
4. **Respiração Visual**: Espaçamento generoso entre seções para evitar fadiga

### Color Philosophy
- **Primário**: Azul profundo (`#1e40af`) - confiança, inteligência, profissionalismo
- **Secundário**: Verde esmeralda (`#059669`) - crescimento, oportunidade, sucesso
- **Destaque**: Âmbar (`#d97706`) - atenção, urgência, prazo
- **Neutro**: Cinza sofisticado (`#374151` a `#9ca3af`) - legibilidade, hierarquia
- **Fundo**: Branco puro com toques de cinza muito claro (`#f9fafb`) - clareza, profissionalismo

### Layout Paradigm
- **Estrutura Assimétrica**: Sidebar esquerdo para navegação + grid principal responsivo
- **Cards Modulares**: Cada categoria (Concursos, IA, Investimentos) em cards independentes
- **Scroll Vertical Primário**: Conteúdo flui naturalmente de cima para baixo
- **Zoom Progressivo**: Visão geral → clique → detalhes expandidos

### Signature Elements
1. **Badges de Status**: Pequenos indicadores visuais (aberto, previsto, urgente)
2. **Linhas Divisórias Sutis**: Separadores em cinza muito claro para organização
3. **Ícones Temáticos**: Lucide-react com cores semânticas (verde para oportunidade, âmbar para urgência)

### Interaction Philosophy
- **Feedback Imediato**: Hover states claros, transições suaves (200ms)
- **Exploração Incentivada**: Cards com sombra leve que aumenta ao hover
- **Navegação Breadcrumb**: Sempre saber onde está no dashboard
- **Busca & Filtro**: Componentes destacados no topo para descoberta rápida

### Animation
- **Entrada**: Fade-in suave (300ms) ao carregar seções
- **Hover**: Elevação sutil (shadow increase) + mudança de cor primária
- **Transição de Página**: Slide suave (250ms) entre categorias
- **Loading**: Skeleton screens com shimmer effect

### Typography System
- **Display (Títulos)**: Geist Sans Bold 28-32px - impactante, confiante
- **Heading (Seções)**: Geist Sans SemiBold 18-20px - hierarquia clara
- **Body (Conteúdo)**: Geist Sans Regular 14-16px - legível, profissional
- **Caption (Metadados)**: Geist Sans Regular 12px + cor muted - discreta
- **Monospace (Dados)**: IBM Plex Mono para números/códigos - precisão

---

## Implementação
Este design será implementado através de:
- Tailwind CSS com tokens customizados em `index.css`
- Shadcn/ui components para consistência
- Lucide-react para ícones temáticos
- Framer Motion para animações suaves
- Layout responsivo mobile-first
