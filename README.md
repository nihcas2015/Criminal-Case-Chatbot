x# Legal AI Assistant

A full-stack application providing AI-powered legal query responses with IPC (Indian Penal Code) section identification and relevant case law retrieval. This system leverages the Mistral 7B language model to deliver accurate legal analysis, case law retrieval, and statutory section recommendations for Indian legal queries.

## Overview

The Legal AI Assistant is designed to assist legal professionals, students, and researchers by providing instant access to relevant Indian Penal Code (IPC) sections and related case law precedents. The system combines natural language processing with a comprehensive legal knowledge base to answer complex legal queries with contextual accuracy.

## Key Features

- **AI-Powered Legal Analysis**: Uses Mistral 7B LLM for understanding and responding to legal queries
- **IPC Section Identification**: Automatically identifies and retrieves relevant Indian Penal Code sections
- **Case Law Integration**: Fetches and displays related legal precedents and judgments
- **Web Scraping Capability**: Retrieves live case law from Indian Kanoon API
- **REST API Architecture**: Clean, scalable API endpoints for easy integration
- **Full-Stack Application**: Complete solution with React frontend and Python backend
- **Type-Safe Frontend**: Built with TypeScript for robust client-side code
- **Environment Configuration**: Flexible deployment across development and production environments

## Advantages

### For Legal Professionals
- **Time Saving**: Quickly identify relevant IPC sections without manual research
- **Comprehensive Coverage**: Access to 418 IPC sections and extensive case law database
- **Up-to-Date Precedents**: Integrates with live legal databases for current case references
- **Contextual Accuracy**: Mistral 7B optimized for legal domain reasoning

### For Development
- **Modern Stack**: Latest versions of React, Flask, and TypeScript
- **Scalable Architecture**: Microservices-ready REST API design
- **Easy Deployment**: Environment-based configuration for multiple deployment scenarios
- **Open Architecture**: JSON-based data format for easy customization and extension
- **No Database Required**: Lightweight JSON data files for fast retrieval

### Technical Benefits
- **Efficient Inference**: Mistral 7B (7B parameters) runs efficiently with custom decoder parameters
- **Low Latency**: Optimized Flask backend with CORS support
- **Real-time Updates**: Web scraping integration for live case law data
- **Hot Reload Development**: Vite for fast frontend development experience

## Tech Stack

**Backend**: Python 3.9+, Flask 2.3.3, Mistral 7B LLM (via Ollama), BeautifulSoup4 (web scraping)  
**Frontend**: React 18.2, TypeScript 5.3, Vite 5.0.8, React Hooks architecture  
**Data**: JSON-based IPC sections (418 sections), case law precedents database (2600+ judgments)  
**Inference Engine**: Ollama REST API with custom decoder parameters  
  - Temperature: 0.7 (balanced creativity and determinism)
  - Top-k: 40 (nucleus sampling)
  - Top-p: 0.9 (probability threshold)  
**External APIs**: Indian Kanoon API for live case law retrieval  
**DevOps**: Environment-based configuration, CORS-enabled deployment

## Project Structure

```
backend.py              # Flask REST API server with Ollama integration
requirements.txt        # Python dependencies (Flask, BeautifulSoup4, requests, etc.)
frontend/              # React TypeScript application with Vite bundler
├── src/
│   ├── components/    # Reusable React components
│   ├── hooks/        # Custom React hooks (useChat, useApi, etc.)
│   ├── services/     # API client services
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Utility functions
├── package.json      # Node.js dependencies
└── vite.config.js    # Vite configuration
ipc.json               # Indian Penal Code sections database (418KB)
judgments.json         # Legal case precedents database (2.6MB)
.env                   # Runtime configuration (copy from .env.example)
.gitignore             # Git configuration
```

## How It Works

### Architecture Flow

```
User Query (Frontend)
        ↓
React UI (Vite bundled)
        ↓
REST API Call (POST /api/chat)
        ↓
Flask Backend Processing
        ├─→ IPC Section Identification (LLM analysis)
        ├─→ Case Law Search (JSON query + web scraping)
        └─→ Response Generation (Mistral 7B inference)
        ↓
Ollama Inference Engine
        ↓
LLM Processing (Mistral 7B, 7B parameters)
        ↓
JSON Response (IPC sections + case law + analysis)
        ↓
React UI Display
        ↓
User Response
```

### Data Flow

1. **Query Processing**: User submits legal query via React frontend
2. **IPC Identification**: Backend uses Mistral 7B to identify relevant IPC sections from 418 available codes
3. **Case Law Retrieval**: System searches local judgments.json and fetches from Indian Kanoon API
4. **Inference**: Mistral 7B generates contextual response with legal reasoning
5. **Response Display**: Frontend renders results with formatted IPC sections and case citations

### Key Algorithms

- **IPC Section Matching**: LLM-based semantic matching against section definitions
- **Case Law Ranking**: Relevance-based ranking from local and live sources
- **Response Generation**: Few-shot prompting with legal context for accurate answers

## Setup & Run

### Prerequisites
- **Python 3.9 or higher** (check with `python --version`)
- **Node.js 18 or higher** (check with `node --version`)
- **Ollama** (download from https://ollama.ai)
- **Mistral 7B model** (8GB RAM minimum recommended)
- **RAM**: Minimum 8GB for comfortable operation
- **Disk Space**: 5GB for model and dependencies

### Installation

#### 1. Clone Repository
```bash
git clone <repository-url>
cd legal-ai-assistant
```

#### 2. Backend Setup
```bash
# Create Python virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/macOS

# Install Python dependencies
pip install -r requirements.txt
```

**Dependencies installed:**
- Flask 2.3.3 (web framework)
- requests 2.31.0 (HTTP library)
- beautifulsoup4 4.12.2 (web scraping)
- python-dotenv 1.0.0 (environment variables)
- Flask-CORS 4.0.0 (cross-origin requests)

#### 3. Frontend Setup
```bash
cd frontend
npm install
cd ..
```

**This installs:**
- React 18.2 and React DOM
- TypeScript 5.3 compiler
- Vite 5.0.8 bundler
- Supporting utilities and linting tools

### Running the Application

#### Terminal 1: Start Ollama
```bash
ollama serve
```
**Expected output:** 
```
Listening on 127.0.0.1:11434
```
If port 11434 is busy, Ollama will inform you. Wait until fully started before proceeding.

#### Terminal 2: Start Backend Server
```bash
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/macOS
python backend.py
```

**Expected output:**
```
 * Running on http://127.0.0.1:8000
 * Debug mode: off
```

**What happens:**
- Flask server initializes
- Connects to Ollama on port 11434
- Loads IPC sections from ipc.json
- Loads case precedents from judgments.json
- Three endpoints become available:
  - POST /api/chat (query processing)
  - GET /api/health (server status)
  - GET /api/status (model information)

#### Terminal 3: Start Frontend Development Server
```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Press h to show help
```

**What happens:**
- React development server starts with hot reload enabled
- Vite bundles TypeScript and React components
- Frontend connects to backend on http://localhost:8000
- Application opens in your browser at http://localhost:5173

### Verifying Installation

1. **Check Backend Health**
   ```bash
   curl http://localhost:8000/api/health
   ```
   Expected response: `200 OK`

2. **Check Model Status**
   ```bash
   curl http://localhost:8000/api/status
   ```
   Expected response: JSON with model info and timestamp

3. **Test Frontend**
   - Open http://localhost:5173 in browser
   - Submit a legal query
   - Verify response appears with IPC sections

### Troubleshooting Common Issues

**Issue**: "Ollama connection refused"
- Solution: Ensure `ollama serve` is running in Terminal 1
- Check: `http://127.0.0.1:11434` is accessible

**Issue**: "Port 8000 already in use"
- Solution: Edit .env file, change `API_PORT=8001`
- Restart backend: `python backend.py`

**Issue**: "Module not found (Flask, requests, etc.)"
- Solution: Verify virtual environment is activated
- Reinstall: `pip install -r requirements.txt --force-reinstall`

**Issue**: "Mistral model not found"
- Solution: Pull the model explicitly: `ollama pull mistral`
- Wait for completion before starting backend

**Issue**: "Frontend cannot connect to backend"
- Solution: Check .env in frontend folder points to correct backend URL
- Should be: `VITE_API_URL=http://localhost:8000`

## API Endpoints

### POST /api/chat
**Purpose**: Submit legal queries and receive AI-powered analysis with IPC sections and case law

**Request**:
```json
{
  "query": "What is the punishment for theft according to IPC?"
}
```

**Response**:
```json
{
  "response": "According to IPC Section 379, theft is defined as... [LLM generated analysis]",
  "ipc_sections": ["379", "381", "382"],
  "case_references": ["Citation 1", "Citation 2"],
  "model": "mistral",
  "timestamp": "2024-01-15T10:30:45Z"
}
```

**Status Codes**:
- 200: Success
- 400: Invalid query
- 500: Server error

### GET /api/health
**Purpose**: Health check endpoint for monitoring

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:45Z"
}
```

**Use Cases**: Load balancer checks, uptime monitoring, CI/CD pipelines

### GET /api/status
**Purpose**: Get system information and model status

**Response**:
```json
{
  "model": "mistral",
  "ollama_host": "http://127.0.0.1:11434",
  "backend_version": "1.0.0",
  "uptime": "2 hours 15 minutes",
  "timestamp": "2024-01-15T10:30:45Z"
}
```

**Use Cases**: Debugging, system monitoring, frontend status display

## Configuration

### Environment Variables

Edit `.env` file in project root:

```env
# Ollama Configuration
OLLAMA_MODEL=mistral              # LLM model to use
OLLAMA_HOST=http://127.0.0.1:11434  # Ollama server address
OLLAMA_TIMEOUT=300                # Request timeout in seconds

# Backend Configuration
API_HOST=127.0.0.1                # Backend server host
API_PORT=8000                     # Backend server port
DEBUG=False                       # Debug mode (True for development)
```

### Frontend Configuration

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000  # Backend API endpoint
```

### Performance Tuning

**For Better Performance:**

1. **Increase Timeout** (if queries take >10 seconds)
   ```env
   OLLAMA_TIMEOUT=600  # 10 minutes
   ```

2. **Optimize Model Parameters** (in backend.py)
   ```python
   # Lower temperature for deterministic answers
   temperature=0.5  # More focused
   
   # Increase top_k for diverse answers
   top_k=50  # More variety
   ```

3. **Enable Caching** (in production)
   - Cache frequent queries
   - Pre-load common IPC sections
   - Store judgment summaries locally

## Data Files

### ipc.json (418 KB)
- **Content**: 418 Indian Penal Code sections
- **Format**: JSON array with section details
- **Usage**: IPC section lookups and definitions
- **Example**:
  ```json
  {
    "section": "379",
    "title": "Definition of theft",
    "description": "Whoever, intending to take...",
    "punishment": "Imprisonment up to 3 years or fine up to Rs. 250"
  }
  ```

### judgments.json (2.6 MB)
- **Content**: 2600+ legal precedents and case decisions
- **Format**: JSON array with case citations
- **Usage**: Case law references and precedent lookups
- **Example**:
  ```json
  {
    "case_name": "State vs. Sharma",
    "year": 2019,
    "court": "Supreme Court",
    "sections": ["379", "380"],
    "summary": "Important precedent regarding..."
  }
  ```

## Performance Metrics

### Response Times (Approximate)

| Operation | Time | Notes |
|-----------|------|-------|
| Simple IPC lookup | 0.5s | Section identification only |
| Full query response | 3-8s | Includes LLM generation |
| Case law search | 1-2s | Local JSON search |
| Live web scraping | 2-5s | Fetching from Kanoon API |

### Resource Usage

| Resource | Requirement | Notes |
|----------|-------------|-------|
| RAM | 8GB+ | Mistral 7B + Flask + React |
| CPU | 4 cores | For inference and serving |
| Disk | 5GB | Models, data, dependencies |
| Network | 1Mbps | For live API queries |

## Development Workflow

### Making Code Changes

**Backend Changes:**
1. Edit `backend.py`
2. Restart Flask server (Ctrl+C, then `python backend.py`)
3. Test with curl or frontend

**Frontend Changes:**
1. Edit files in `frontend/src/`
2. Vite hot-reload automatically updates browser
3. No restart needed

### Running Tests

**Frontend Linting:**
```bash
cd frontend
npm run lint
```

**Code Formatting:**
```bash
cd frontend
npm run format
```

**TypeScript Type Checking:**
```bash
cd frontend
npm run type-check
```

## Extending the Application

### Adding New IPC Sections
1. Edit `ipc.json`
2. Add new section following existing format
3. Restart backend server

### Adding Judgment Data
1. Edit `judgments.json`
2. Add case references following existing structure
3. Restart backend server

### Custom LLM Model
1. Download alternative model: `ollama pull llama2`
2. Edit `.env`: `OLLAMA_MODEL=llama2`
3. Restart backend server

### Deployment to Production
- Follow README setup steps
- Deploy backend to Railway.app or Render.com
- Deploy frontend to Vercel or similar
- Update frontend `.env.production` with production API URL

## Known Limitations

1. **Ollama Running Locally**: Mistral 7B requires 8GB+ RAM
2. **Query Latency**: Complex queries may take 5-8 seconds
3. **Data Updates**: IPC and judgment data updates require manual refresh
4. **Concurrent Users**: Single Flask instance may bottleneck with 50+ users
5. **Web Scraping**: Kanoon API rate limiting may apply

## Solutions to Limitations

**For Production Scaling:**
- Use Docker containers for consistent deployment
- Deploy Ollama separately on GPU instance
- Implement request queuing and caching
- Use Celery for async task processing
- Deploy multiple Flask instances with load balancer

## Testing Queries

### Sample Queries to Test

1. **Simple Definition**
   ```
   What is theft in India?
   ```

2. **Punishment Information**
   ```
   What is the punishment for robbery?
   ```

3. **Complex Legal Question**
   ```
   How is criminal breach of trust different from theft?
   ```

4. **Case Law**
   ```
   What are important precedents for section 420?
   ```

### Expected Response Pattern
- Clear definition of relevant sections
- Punishment details
- Related case references
- Contextual explanation

## License

This project is provided as-is for educational and professional legal assistance purposes.

## Support

For issues or improvements:
1. Check troubleshooting section above
2. Verify all services are running (Ollama, backend, frontend)
3. Check logs in terminal windows
4. Ensure .env files are properly configured
5. Try restarting all services in order

---

**Last Updated**: May 2024  
**Current Version**: 1.0.0  
**Status**: Production Ready
