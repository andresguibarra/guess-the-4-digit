# Copilot Instructions for Guess the 4-Digit Number

## Project Overview

This is a Vue 3 + TypeScript web application where players guess a secret 4-digit number with unique digits from 1 to 9. The game provides feedback through "Goods" (correct digits in wrong positions) and "Corrects" (correct digits in correct positions).

## Technology Stack

- **Frontend Framework**: Vue 3 (Composition API with `<script setup>`)
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Framework**: Bootstrap 5
- **Additional Libraries**: 
  - vue3-popper for tooltips
  - Firebase for hosting

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production (runs type-check + build-only)
npm run build-only   # Build without type checking
npm run type-check   # Run TypeScript type checking
npm run lint         # Run ESLint with auto-fix
npm run format       # Format code with Prettier
npm run preview      # Preview production build
```

## Project Structure

```
src/
├── App.vue                          # Main game component
├── main.ts                          # Application entry point
├── assets/                          # Static assets and global styles
├── components/
│   ├── LanguageSelector.vue         # Language selection component
│   └── icons/                       # SVG icon components
└── composables/
    └── useTranslation.ts            # Translation composable
```

## Code Style and Conventions

### General Guidelines

- Use **Composition API** with `<script setup>` syntax for all Vue components
- Use **TypeScript** for type safety
- Follow the existing code style in the repository
- Write clean, readable code with minimal comments (code should be self-documenting)

### Formatting Rules (Prettier)

- **No semicolons** (`semi: false`)
- **Single quotes** for strings
- **2-space indentation**
- **100-character line width**
- **No trailing commas**

### ESLint Configuration

- Uses Vue 3 essential rules
- TypeScript support with `@vue/eslint-config-typescript`
- Prettier integration for formatting
- Targets modern ECMAScript

### Vue Component Structure

1. Template section first
2. Script setup section with TypeScript
3. Style section (scoped if component-specific, global for App.vue)

### TypeScript Conventions

- Define interfaces for complex data structures
- Use `type Ref<T>` for reactive references
- Prefer explicit typing over type inference for function parameters
- Use path alias `@/` for imports from `src/` directory

### Naming Conventions

- **Components**: PascalCase (e.g., `LanguageSelector.vue`)
- **Composables**: camelCase with `use` prefix (e.g., `useTranslation`)
- **Variables/Functions**: camelCase
- **Constants**: camelCase (not SCREAMING_SNAKE_CASE)
- **Interfaces**: PascalCase

## Testing

Currently, this project does not have automated tests. When adding features:
- Manually test the game flow
- Verify responsive design on mobile and desktop
- Test all interactive elements (numpad, input, reset button)

## UI/UX Considerations

- **Responsive Design**: The application adapts between desktop and mobile layouts
- **Mobile-First**: On mobile (≤768px), a numpad appears for easier input
- **Dark Theme**: The app uses a dark color scheme with glassmorphism effects
- **Accessibility**: Include proper ARIA labels and semantic HTML

## Common Tasks

### Adding New Components

1. Create `.vue` file in `src/components/`
2. Use `<script setup lang="ts">` syntax
3. Import and use in parent components
4. Follow existing component patterns for consistency

### Modifying Game Logic

The main game logic is in `App.vue`:
- `generateSecretNumber()`: Creates random 4-digit number
- `calculateBullsAndCows()`: Calculates game feedback
- `submitGuess()`: Handles guess submission
- `resetGame()`: Resets game state

### Styling Guidelines

- Use Bootstrap utility classes where appropriate
- Custom styles go in component `<style>` blocks
- Global styles and CSS variables in `App.vue`
- Maintain the existing dark theme aesthetic
- Use CSS animations sparingly and consistently

## Important Notes

- **No Zero Digit**: The game uses only digits 1-9 (no 0)
- **Unique Digits**: Each digit in the secret number must be unique
- **Input Validation**: The application validates input for duplicates and invalid digits
- **Mobile Optimization**: Includes special viewport handling for mobile devices
- **Internationalization**: Uses a translation composable (though currently appears to be single-language)

## Best Practices

1. **Keep components focused**: Each component should have a single responsibility
2. **Use composables**: Extract reusable logic into composables
3. **Type everything**: Leverage TypeScript for better developer experience
4. **Test manually**: Always test changes in both desktop and mobile views
5. **Preserve existing patterns**: Follow the established code patterns in the project
6. **Minimal changes**: When fixing issues, make the smallest possible change
7. **Format before commit**: Run `npm run format` and `npm run lint` before committing

## Debugging Tips

- Use Vue DevTools browser extension for component inspection
- Check browser console for TypeScript/JavaScript errors
- Verify responsive behavior in browser DevTools mobile view
- Test with different screen sizes and devices
