# Otimização de Re-renders em Formulários React

## 🔴 Problema Identificado

O formulário estava sofrendo de re-renders excessivos porque:

### 1. O `getFieldProps` tinha `errors` como dependência
```tsx
const getFieldProps = useCallback((field: string): FieldProps => {
    // ...
}, [handleFieldChange, handleFieldBlur, errors]); // ← PROBLEMA: errors muda a cada erro!
```

Quando qualquer erro muda, TODOS os `getFieldProps` são recriados.

### 2. O `FormField` acessava `form.errors` e `form.touched` diretamente
```tsx
export function FormField<T>({ form, name, ... }: FormFieldProps<T>) {
    const error = form?.errors[name];     // ← Causa re-render
    const touched = form?.touched[name];  // ← Causa re-render
    // ...
}
```

Quando o estado do form muda, TODOS os FormFields re-renderizam.

### 3. Componentes memoizados dentro do componente pai
```tsx
// ❌ ERRADO - Componente é recriado a cada render do pai
const SimuladorPropostaSecondStepper = () => {
    const GarantiaPessoalComponent = memo(() => (...));  // Recriado!
    
    return <GarantiaPessoalComponent />;
};
```

### 4. Render props criando novas funções
```tsx
// ❌ A função é recriada a cada render
{({ value, onChange, onBlur, name, error }) => (
    <InputNumber ... />
)}
```

---

## 🟢 Solução Implementada

### 1. Sistema de Subscriptions Granulares

Criamos um `FormStore` que permite que cada campo se inscreva APENAS nas suas próprias mudanças:

```tsx
class FormStore<T> {
    private listeners: Map<string, Set<Listener>> = new Map();
    
    // Cada campo se inscreve individualmente
    subscribe(field: string, listener: Listener): () => void {
        // ...
    }
    
    // Notifica APENAS os listeners do campo alterado
    private notifyField(field: string): void {
        const fieldListeners = this.listeners.get(field);
        if (fieldListeners) {
            fieldListeners.forEach(listener => listener());
        }
    }
}
```

### 2. FormField com useSyncExternalStore

O novo `FormField` usa `useSyncExternalStore` para se inscrever apenas no seu campo:

```tsx
export function FormField<T>({ form, name, ... }: FormFieldProps<T>) {
    // 🔑 Só re-renderiza quando ESTE campo muda
    const fieldState = useSyncExternalStore(
        (callback) => form.subscribe(name, callback),
        () => form.getFieldState(name),
        () => form.getFieldState(name)
    );
    // ...
}
```

### 3. Componentes FORA do componente pai

```tsx
// ✅ CERTO - Componente definido fora, nunca recriado
const GarantiaPessoalItem = memo(function GarantiaPessoalItem({ form, index }) {
    return (
        <FormField name={`garantiasPessoais.${index}.nome`} form={form}>
            {(props) => <InputText {...props} />}
        </FormField>
    );
});

// Componente principal
const SimuladorPropostaSecondStepper = ({ form }) => {
    return <GarantiaPessoalItem form={form} index={0} />;
};
```

### 4. Handlers estáveis com cache

```tsx
const handlersCache = useRef<Map<string, { onChange: any; onBlur: any }>>(new Map());

const getFieldProps = useCallback((field: string): FieldProps => {
    let handlers = handlersCache.current.get(field);
    
    if (!handlers) {
        // Cria apenas uma vez e guarda no cache
        handlers = {
            onChange: (e: any) => handleFieldChange(field, e),
            onBlur: () => handleFieldBlur(field),
        };
        handlersCache.current.set(field, handlers);
    }
    
    return {
        value: store.getFieldState(field).value,
        onChange: handlers.onChange,  // Sempre a mesma referência
        onBlur: handlers.onBlur,       // Sempre a mesma referência
        // ...
    };
}, [handleFieldChange, handleFieldBlur, store]); // Sem `errors`!
```

---

## 📁 Arquivos Criados

1. **`useFormOptimized.ts`** - Hook com sistema de subscriptions
2. **`FormFieldOptimized.tsx`** - FormField com subscription granular
3. **`secondStepperOptimized.tsx`** - Exemplo de uso otimizado

---

## 🚀 Como Migrar

### Passo 1: Substituir o useForm

```tsx
// Antes
import { useForm } from "@front-engine/utils-react";

// Depois
import { useForm } from "./useFormOptimized";
```

### Passo 2: Substituir o FormField

```tsx
// Antes
import { FormField } from "@front-engine/utils-react";

// Depois
import { FormField } from "./FormFieldOptimized";
```

### Passo 3: Mover componentes memoizados para fora

```tsx
// ❌ ANTES - Dentro do componente
const Parent = ({ form }) => {
    const Child = memo(() => <FormField form={form} ... />);
    return <Child />;
};

// ✅ DEPOIS - Fora do componente
const Child = memo(({ form }) => <FormField form={form} ... />);

const Parent = ({ form }) => {
    return <Child form={form} />;
};
```

### Passo 4: Não acessar form.values no componente pai

```tsx
// ❌ ANTES - Causa re-render de tudo
const Parent = ({ form }) => {
    const hasGarantias = form.values.garantias.length > 0;
    return hasGarantias ? <Garantias /> : null;
};

// ✅ DEPOIS - Usa componente com subscription própria
const GarantiasSection = ({ form }) => {
    const { value } = useFormField(form, 'garantias');
    const hasGarantias = value.length > 0;
    return hasGarantias ? <Garantias /> : null;
};

const Parent = ({ form }) => {
    return <GarantiasSection form={form} />;
};
```

### Passo 5: Para arrays, usar FormArray

```tsx
// ✅ FormArray otimizado
<FormArray form={form} name="garantiasPessoais">
    {(item, index, remove) => (
        <GarantiaPessoalItem 
            key={index}
            form={form} 
            index={index} 
            onRemove={remove} 
        />
    )}
</FormArray>
```

---

## 🧪 Como Testar

Use o React DevTools Profiler para verificar:

1. Abra o React DevTools
2. Vá para a aba "Profiler"
3. Clique em "Start profiling"
4. Digite em um campo do formulário
5. Pare o profiling

**Antes da otimização:** Todos os FormField re-renderizam
**Depois da otimização:** Apenas o FormField alterado re-renderiza

---

## 📊 Resultado Esperado

| Métrica | Antes | Depois |
|---------|-------|--------|
| Re-renders por keystroke | ~50+ | 1 |
| Tempo de render | ~100ms+ | ~5ms |
| Componentes afetados | Todos | Apenas 1 |

---

## ⚠️ Cuidados

1. **Não acesse `form.values` diretamente** - Isso força re-render de tudo
2. **Use `useFormField` para verificações condicionais** - Cria subscription isolada
3. **Mantenha componentes memoizados fora** - Evita recriação
4. **O `form` object é estável** - Pode ser passado como prop sem causar re-render
