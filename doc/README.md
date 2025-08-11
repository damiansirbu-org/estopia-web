# Estopia Web Frontend

Property management web interface built with React 18 + TypeScript + Vite.

## Quick Start
```bash
./estopia-web.sh start      # Development server
./estopia-web.sh build      # Production build
./estopia-web.sh test       # Run tests
./estopia-web.sh dockerize  # Build Docker image
./estopia-web.sh publish    # Push to Docker Hub
```

## Tech Stack
- **Framework**: React 18.3.1 + TypeScript
- **Build**: Vite 7.0.4 (fast dev server)
- **UI**: Ant Design 5.26.6 (enterprise components)
- **HTTP**: Axios 1.10.0
- **Testing**: Vitest + Testing Library + MSW
- **Deployment**: Nginx + Docker (81MB image)

## Architecture
Modern React application with CRUD operations for property management entities.

## Documentation
- **[Architecture](doc/architecture.md)** - Component structure and data flow
- **[Standards](doc/standards.md)** - Code quality and React best practices
- **[Requirements](doc/requirements.md)** - UI/UX specifications
- **[Implementation](doc/implementation.md)** - Technical implementation details
- **[TODO](doc/todo.md)** - Current development tasks

## Development
- **URL**: http://localhost:5173
- **Backend**: Connects to estopia-quarkus at :8080
- **Hot Reload**: Instant updates during development