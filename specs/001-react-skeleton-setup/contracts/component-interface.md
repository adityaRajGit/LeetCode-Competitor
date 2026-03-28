# Component Interface Contract

**Version**: 1.0.0  
**Type**: Component Development Standards  
**Purpose**: Define the contract for React component development, structure, and interfaces

## Component File Structure Contract

### Standard Component Layout

Each component must follow this directory structure:

```
ComponentName/
├── ComponentName.tsx          # Component implementation (REQUIRED)
├── ComponentName.test.tsx     # Unit tests (REQUIRED)
├── ComponentName.module.css   # Scoped styles (OPTIONAL)
├── types.ts                   # Component-specific types (OPTIONAL)
├── index.ts                   # Barrel export (REQUIRED)
└── README.md                  # Component documentation (OPTIONAL)
```

### File Naming Convention

- **Component File**: PascalCase matching component name (`Button.tsx`, `UserCard.tsx`)
- **Test File**: Same as component with `.test.tsx` suffix
- **Style File**: Same as component with `.module.css` suffix (CSS Modules)
- **Type File**: `types.ts` (lowercase)
- **Index File**: `index.ts` (lowercase)

## Component Interface Contract

### Props Interface

All components must define a TypeScript interface for props:

```typescript
// Required pattern
interface ComponentNameProps {
  // Component-specific required props
  title: string;
  
  // Component-specific optional props
  subtitle?: string;
  
  // Common optional props (as needed)
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  
  // Event handlers
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onChange?: (value: string) => void;
}
```

**Rules**:
1. Interface name must be `{ComponentName}Props`
2. Export interface alongside component
3. No use of `any` type
4. Optional props use `?` suffix
5. Event handlers typed with appropriate event type
6. Avoid `object` type; define explicit shape

### Component Declaration

```typescript
// Preferred: Named function component
export const ComponentName: React.FC<ComponentNameProps> = (props) => {
  // Component implementation
};

// Alternative: Function declaration
export function ComponentName(props: ComponentNameProps) {
  // Component implementation
}
```

**Rules**:
1. Always export component as named export
2. Use `React.FC<Props>` or explicit props typing
3. Destructure props in parameter or first line
4. Use meaningful prop names

### Component Exports (index.ts)

```typescript
// Standard barrel export pattern
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';

// For components with multiple exports
export { ComponentName, useComponentName } from './ComponentName';
export type { ComponentNameProps, ComponentNameState } from './types';
```

## Component Categories

### Shared Components

**Location**: `src/shared/components/`

**Requirements**:
- Must be reusable across multiple features
- Should not contain feature-specific logic
- Must be fully tested (>80% coverage)
- Must include prop documentation
- Should be accessible (ARIA compliance)

**Examples**: Button, Input, Card, Modal, Layout

### Feature Components

**Location**: `src/features/{feature-name}/components/`

**Requirements**:
- May contain feature-specific business logic
- Can depend on feature-specific state/services
- Must be tested with feature context
- Should be composable

**Examples**: LoginForm, DashboardWidget, ProblemCard

## Component Testing Contract

### Required Test Coverage

Each component must have tests covering:

1. **Rendering**: Component renders without errors
2. **Props**: All props affect output correctly
3. **User Interaction**: Event handlers called appropriately
4. **Conditional Rendering**: All conditional branches tested
5. **Accessibility**: Basic a11y requirements met

### Test Structure

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders with required props', () => {
    render(<ComponentName title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    const handleClick = vi.fn();
    render(<ComponentName title="Test" onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(
      <ComponentName title="Test" className="custom" />
    );
    expect(container.firstChild).toHaveClass('custom');
  });
});
```

**Rules**:
1. Use `@testing-library/react` for component testing
2. Test user behavior, not implementation
3. Use semantic queries (`getByRole`, `getByLabelText`)
4. Mock external dependencies
5. Minimum 80% code coverage for shared components

## Styling Contract

### CSS Modules Pattern

```typescript
// ComponentName.tsx
import styles from './ComponentName.module.css';

export const ComponentName: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      {/* component content */}
    </div>
  );
};
```

```css
/* ComponentName.module.css */
.container {
  /* Component-scoped styles */
}

.title {
  /* Element-scoped styles */
}
```

**Rules**:
1. Use CSS Modules for component styles (`.module.css`)
2. Support `className` prop for style overrides
3. Avoid inline styles unless dynamic (use `style` prop)
4. Use semantic class names
5. Global styles go in `src/styles/`

### Responsive Design

Components should support responsive design:
- Use relative units (`rem`, `em`, `%`) over pixels where appropriate
- Support mobile-first breakpoints
- Test on multiple screen sizes

## Accessibility Contract

### Required Attributes

Components must include appropriate ARIA attributes:

```typescript
// Interactive components
<button
  aria-label="Close dialog"
  aria-pressed={isPressed}
  disabled={isDisabled}
>

// Form inputs
<input
  aria-label="Email address"
  aria-required={isRequired}
  aria-invalid={hasError}
  aria-describedby={hasError ? 'error-message' : undefined}
>

// Dynamic content
<div
  role="alert"
  aria-live="polite"
  aria-atomic="true"
>
```

**Required Checks**:
1. Interactive elements have accessible names
2. Form inputs have labels
3. Color is not the only means of conveying information
4. Focus indicators visible
5. Keyboard navigation supported

## Component Documentation

### Inline Documentation (JSDoc)

```typescript
/**
 * A button component that supports multiple variants and sizes.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = (props) => {
  // ...
};

/**
 * Props for the Button component.
 */
export interface ButtonProps {
  /** The visual style variant */
  variant?: 'primary' | 'secondary' | 'outline';
  
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  
  /** Whether the button is disabled */
  disabled?: boolean;
  
  /** Click event handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  
  /** Button content */
  children: React.ReactNode;
}
```

**Rules**:
1. Document all exported components with JSDoc
2. Include usage example
3. Document each prop in interface
4. Use `@example` for code examples

## Component State Management

### Local State (useState)

```typescript
// For component-specific UI state
const [isOpen, setIsOpen] = useState(false);
const [inputValue, setInputValue] = useState('');
```

**Use When**:
- State is only used within component
- State represents UI state (visibility, input values)
- No need to share with other components

### Context (useContext)

```typescript
// For feature-level shared state
const { user, loading } = useAuthContext();
```

**Use When**:
- State needs to be accessed by multiple components
- State represents feature domain data
- Avoiding prop drilling

### Props (Controlled Components)

```typescript
// For parent-controlled state
interface ControlledInputProps {
  value: string;
  onChange: (value: string) => void;
}
```

**Use When**:
- Parent needs to control component state
- Form inputs with validation
- Composition patterns

## Error Handling

Components should handle errors gracefully:

```typescript
export const ComponentName: React.FC<Props> = ({ data }) => {
  if (!data) {
    return <div>No data available</div>;
  }

  if (data.error) {
    return <ErrorMessage message={data.error} />;
  }

  return (
    <div>
      {/* Normal rendering */}
    </div>
  );
};
```

## Performance Considerations

- Use `React.memo()` for expensive components
- Memoize callbacks with `useCallback`
- Memoize computed values with `useMemo`
- Lazy load large components with `React.lazy()`
- Virtualize long lists with libraries like `react-virtual`

## Versioning

- **Breaking Changes**: Require major version
  - Removing props
  - Changing prop types incompatibly
  - Changing component behavior significantly

- **Non-Breaking Changes**: Minor version
  - Adding new optional props
  - Adding new features
  - Deprecating props (with backwards compatibility)

- **Patches**: Patch version
  - Bug fixes
  - Performance improvements
  - Documentation updates

## Compliance Checklist

Each component must:
- [ ] Follow file structure convention
- [ ] Define TypeScript interface for props
- [ ] Export component and types via index.ts
- [ ] Include unit tests with >80% coverage (shared components)
- [ ] Support className prop for style customization
- [ ] Include accessibility attributes
- [ ] Document with JSDoc comments
- [ ] Handle error states gracefully
- [ ] Be responsive (mobile-friendly)
- [ ] Follow naming conventions
