# TUI-Kit-AI Zod Validation System

Questo sistema fornisce validazione runtime completa e type safety per tutti i componenti TUI utilizzando [Zod](https://zod.dev/).

## 🎯 Caratteristiche Principali

- ✅ **Validazione Runtime**: Tutti i props dei componenti sono validati a runtime
- 🔒 **Type Safety**: TypeScript types sono automaticamente generati dagli schemi Zod
- 🚨 **Error Handling**: Messaggi di errore dettagliati e suggerimenti
- ⚡ **Performance**: Validazione ottimizzata con caching
- 🧪 **Testing**: Facile da testare e debuggare

## 📦 Installazione

```bash
npm install zod
```

## 🚀 Utilizzo Base

### 1. Validazione Semplice

```typescript
import { validateComponent } from "@tui-kit-ai/core";

const buttonProps = {
  text: "Click me",
  onClick: () => console.log("clicked"),
  top: 10,
  left: 20,
};

const result = validateComponent("button", buttonProps);

if (result.success) {
  console.log("✅ Props validi:", result.data);
} else {
  console.log("❌ Errori di validazione:", result.errors);
}
```

### 2. Validazione con Suggerimenti

```typescript
import { validateWithSuggestions } from "@tui-kit-ai/core";

const invalidProps = {
  text: 123, // Dovrebbe essere string
  variant: "invalid", // Variant non valido
};

const result = validateWithSuggestions("button", invalidProps);

if (!result.success) {
  console.log("Suggerimenti:", result.suggestions);
  // Output: ["Property 'text' should be of type string", "Property 'variant' must be one of: default, primary, secondary..."]
}
```

### 3. Validazione Strict

```typescript
import { validateComponentStrict } from "@tui-kit-ai/core";

const propsWithUnknown = {
  text: "Button",
  unknownProp: "this will trigger a warning",
};

const result = validateComponentStrict("button", propsWithUnknown);
console.log("Warnings:", result.warnings);
// Output: ["Unknown property 'unknownProp' for component 'button'"]
```

## 🏗️ Schemi Disponibili

### Componenti Layout

- `BoxSchema` - Container base
- `FlexSchema` - Layout flessibile
- `GridSchema` - Layout a griglia
- `StackSchema` - Stack verticale/orizzontale

### Componenti Display

- `TextSchema` - Testo semplice
- `HeadingSchema` - Titoli
- `ParagraphSchema` - Paragrafi

### Componenti Interattivi

- `ButtonSchema` - Pulsanti
- `TextInputSchema` - Input di testo
- `TextareaSchema` - Area di testo
- `SelectSchema` - Selezione
- `CheckboxSchema` - Checkbox
- `RadioGroupSchema` - Gruppo radio

### Componenti Feedback

- `ProgressBarSchema` - Barra di progresso
- `SpinnerSchema` - Indicatori di caricamento
- `BadgeSchema` - Badge
- `StatusIndicatorSchema` - Indicatori di stato

### Componenti Dati

- `TableSchema` - Tabelle
- `TreeSchema` - Alberi
- `ListSchema` - Liste

### Componenti Overlay

- `ModalSchema` - Modal
- `TooltipSchema` - Tooltip
- `ToastSchema` - Notifiche toast

### Componenti Navigazione

- `TabsSchema` - Tab
- `BreadcrumbSchema` - Breadcrumb
- `MenuSchema` - Menu

## 🔧 Utilizzo Avanzato

### 1. Creazione di Schemi Personalizzati

```typescript
import { ButtonSchema } from "@tui-kit-ai/core";
import { z } from "zod";

const CustomButtonSchema = ButtonSchema.extend({
  customIcon: z.string().optional(),
  customStyle: z
    .object({
      borderColor: z.string().optional(),
      bg: z.string().optional(),
    })
    .optional(),
});

// Validazione
const customProps = {
  text: "Custom Button",
  customIcon: "🚀",
  customStyle: { borderColor: "#ff0000" },
};

const result = CustomButtonSchema.parse(customProps);
```

### 2. Validazione Condizionale

```typescript
const ConditionalButtonSchema = ButtonSchema.extend({
  showIcon: z.boolean().optional(),
  icon: z.string().optional(),
}).refine(
  (data) => {
    if (data.showIcon && !data.icon) return false;
    return true;
  },
  {
    message: "Icon is required when showIcon is true",
    path: ["icon"],
  }
);
```

### 3. Validazione Multipla

```typescript
import { componentValidator } from "@tui-kit-ai/core";

const components = [
  { name: "button", props: { text: "Button", top: 0, left: 0 } },
  {
    name: "box",
    props: { content: "Box", top: 5, left: 0, width: 50, height: 10 },
  },
];

const results = componentValidator.validateComponents(components);
results.forEach((result, index) => {
  const componentName = components[index].name;
  console.log(`${componentName}: ${result.success ? "✅" : "❌"}`);
});
```

## 🎨 Integrazione con Componenti

### 1. Validazione nel Costruttore

```typescript
import { validateComponent } from "@tui-kit-ai/core";

export class Button {
  constructor(props: any) {
    // Validazione automatica
    const validation = validateComponent("button", props);

    if (!validation.success) {
      throw new Error(
        `Invalid button props: ${validation.errors?.issues
          .map((i) => i.message)
          .join(", ")}`
      );
    }

    // Props validati
    this.props = validation.data;
    this.createButton();
  }
}
```

### 2. Validazione Dinamica

```typescript
export class Button {
  updateProps(newProps: Partial<ButtonProps>) {
    const updatedProps = { ...this.props, ...newProps };

    const validation = validateComponent("button", updatedProps);
    if (!validation.success) {
      console.error("Invalid props update:", validation.errors);
      return false;
    }

    this.props = validation.data;
    this.render();
    return true;
  }
}
```

## 🧪 Testing

### 1. Test di Validazione

```typescript
import { ButtonSchema } from "@tui-kit-ai/core";

describe("Button Schema", () => {
  it("should validate correct props", () => {
    const validProps = {
      text: "Test Button",
      top: 0,
      left: 0,
    };

    const result = ButtonSchema.safeParse(validProps);
    expect(result.success).toBe(true);
  });

  it("should reject invalid props", () => {
    const invalidProps = {
      text: 123, // Dovrebbe essere string
      top: "invalid", // Dovrebbe essere number
    };

    const result = ButtonSchema.safeParse(invalidProps);
    expect(result.success).toBe(false);
  });
});
```

### 2. Test di Validazione Condizionale

```typescript
it("should require icon when showIcon is true", () => {
  const props = {
    text: "Button",
    showIcon: true,
    // icon mancante - dovrebbe fallire
  };

  const result = ConditionalButtonSchema.safeParse(props);
  expect(result.success).toBe(false);
});
```

## 📊 Performance

- **Validazione Lazy**: Gli schemi sono validati solo quando necessario
- **Caching**: I risultati di validazione sono cachati per props identici
- **Tree Shaking**: Solo gli schemi utilizzati sono inclusi nel bundle finale

## 🚨 Gestione Errori

### 1. Errori di Validazione

```typescript
try {
  const button = ButtonSchema.parse(invalidProps);
} catch (error) {
  if (error instanceof z.ZodError) {
    error.issues.forEach((issue) => {
      console.error(`Path: ${issue.path.join(".")}`);
      console.error(`Message: ${issue.message}`);
      console.error(`Code: ${issue.code}`);
    });
  }
}
```

### 2. Safe Parsing

```typescript
const result = ButtonSchema.safeParse(props);
if (result.success) {
  // Props validi
  const button = result.data;
} else {
  // Gestione errori senza eccezioni
  console.error("Validation failed:", result.error.issues);
}
```

## 🔍 Debugging

### 1. Logging Dettagliato

```typescript
import { validateWithSuggestions } from "@tui-kit-ai/core";

const result = validateWithSuggestions("button", props);
if (!result.success) {
  console.log("Validation failed");
  console.log("Errors:", result.errors?.issues);
  console.log("Suggestions:", result.suggestions);
  console.log("Warnings:", result.warnings);
}
```

### 2. Schema Inspection

```typescript
import { componentValidator } from "@tui-kit-ai/core";

// Ottieni schema per un componente
const buttonSchema = componentValidator.getSchema("button");
console.log("Button schema:", buttonSchema);

// Controlla proprietà disponibili
const hasText = componentValidator.hasProperty("button", "text");
console.log("Button has text property:", hasText);
```

## 📚 Riferimenti

- [Zod Documentation](https://zod.dev/)
- [TypeScript Integration](https://zod.dev/?id=typescript)
- [Runtime Validation](https://zod.dev/?id=runtime-validation)

## 🤝 Contributi

Per aggiungere nuovi schemi o migliorare quelli esistenti:

1. Crea lo schema Zod nel file appropriato
2. Aggiungi i tipi TypeScript derivati
3. Aggiorna la documentazione
4. Aggiungi test per la validazione

---

**Nota**: Questo sistema sostituisce la validazione manuale dei props e fornisce type safety garantito a runtime per tutti i componenti TUI.

