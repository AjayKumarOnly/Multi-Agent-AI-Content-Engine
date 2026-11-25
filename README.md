# Multi – Agent AI Content Engine (Frontend)

Enterprise-grade React + Vite frontend for an orchestrated multi-agent AI content generation platform (**Researcher → Writer → Editor → Fact-Checker**), designed for integration with a **Spring Boot** API gateway and a **Python FastAPI + LangGraph** AI engine.

## Tech Stack

- **React 19** + **Vite** (JavaScript)
- **Tailwind CSS** (Dark navy/charcoal & light theme support)
- **React Router DOM** for client-side routing
- **@xyflow/react** (React Flow) for interactive cyclic workflow visualization
- **Recharts** for observability and benchmarking analytics
- **Axios** for REST API communication with JWT interceptors
- **Server-Sent Events (SSE)** for real-time agent execution streaming
- **Lucide React** for iconography

## Project Structure

```text
src/
├── assets/
├── components/
│   ├── common/          # Button, Card, MetricCard, StatusBadge, Modal, EmptyState, DemoBanner
│   ├── logs/            # Real-time ExecutionLogsPanel with agent/status filters
│   ├── preview/         # ContentPreviewPanel (LinkedIn, X threads, Blog, Fact-Check, Citations)
│   └── workflow/        # React Flow AgentNode & AgentWorkflowGraph with feedback loops
├── constants/           # Platforms, tones, lengths, models, agent metadata, navigation
├── context/             # ThemeContext, AuthContext, ToastContext, AppDataContext
├── hooks/               # useWorkflowExecution (SSE stream + state machine tracking)
├── layouts/             # DashboardLayout (collapsible sidebar, mobile drawer, top bar)
├── mocks/               # Simulated telemetry, content history, analytics, benchmark datasets
├── pages/               # Overview, GenerateContent, Workflow, History, Analytics, Benchmarking, Settings, Auth
├── services/            # Axios client + modular API services (auth, content, workflow SSE, analytics, benchmark, settings)
└── utils/               # Formatters, word count, reading time, delta calculations, file export
```

## Getting Started

1. **Install dependencies**

```bash
npm install
```

2. **Run the development server**

```bash
npm run dev
```

3. **Build for production**

```bash
npm run build
```

## Backend Integration

By default, the app runs in **Demo Mode** (`VITE_USE_MOCK_API !== 'false'`), using realistic simulated SSE streams and demo telemetry clearly labeled in the UI.

To connect to your Spring Boot + FastAPI backend, create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_USE_MOCK_API=false
```

API credentials (e.g., Gemini, Tavily) are never stored or exposed in the frontend; they must be configured exclusively in the backend environment.
