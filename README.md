# LeetCode Competitor

A modern React skeleton project built with Vite, TypeScript, and best practices for scalable application development.

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and **npm 9+**
- Git

**Note**: This project uses Vite 5.x and Vitest 2.x for compatibility with Node.js 18. For the latest Vite 7 and other packages, upgrade to Node.js 20.19+ or 22.12+.

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd LeetCode-Competitor

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to see the application.

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Check code quality with ESLint |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Check TypeScript types |

## 🏗️ Project Structure

```
LeetCode-Competitor/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, icons
│   ├── core/           # Core functionality (API, config, router)
│   ├── features/       # Feature modules (domain-driven)
│   ├── shared/         # Reusable components, hooks, utilities
│   ├── styles/         # Global styles
│   ├── tests/          # Test configuration
│   ├── App.tsx         # Root application component
│   ├── main.tsx        # Application entry point
│   └── vite-env.d.ts   # Vite TypeScript declarations
├── specs/              # Feature specifications and documentation
└── index.html          # HTML entry point
```

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript 5** - Type safety
- **Vite 5** - Build tool and dev server (Node 18 compatible)
- **React Router 7** - Client-side routing
- **Vitest 2** - Unit testing framework
- **React Testing Library 16** - Component testing
- **ESLint 9** - Code quality
- **Prettier 3** - Code formatting

## 📚 Documentation

For detailed development guides, see [docs/README.md](docs/README.md).

## 📋 Features

- ✅ Modern React 19 with TypeScript
- ✅ Fast development with Vite HMR
- ✅ Feature-based architecture
- ✅ Comprehensive testing setup
- ✅ Code quality tools (ESLint + Prettier)
- ✅ Path aliases (@/ for src/)
- ✅ CSS Modules support

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please read the development guide in [docs/README.md](docs/README.md) before submitting pull requests.
