"""
Legal AI Chatbot Backend API Server
Uses Ollama Mistral model + web scraping for IPC legal queries with custom decoder
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import json
import traceback
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ========== CONFIGURATION ==========
class Config:
    OLLAMA_MODEL = os.getenv('OLLAMA_MODEL', 'mistral')
    OLLAMA_HOST = os.getenv('OLLAMA_HOST', 'http://127.0.0.1:11434')
    OLLAMA_TIMEOUT = int(os.getenv('OLLAMA_TIMEOUT', '600'))  # 10 minutes
    API_PORT = int(os.getenv('API_PORT', '8000'))
    API_HOST = os.getenv('API_HOST', '0.0.0.0')
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

config = Config()

# ========== OLLAMA LLM CLASS ==========
class OllamaLLM:
    def __init__(self, model_name=config.OLLAMA_MODEL, base_url=config.OLLAMA_HOST):
        self.model_name = model_name
        self.base_url = base_url
    
    def generate(self, prompt: str) -> str:
        """Generate response using Ollama model with custom decoder"""
        try:
            response = requests.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model_name,
                    "prompt": prompt,
                    "stream": False,
                    "temperature": 0.7,
                    "top_k": 40,
                    "top_p": 0.9
                },
                timeout=config.OLLAMA_TIMEOUT
            )
            response.raise_for_status()
            return response.json().get("response", "")
        except requests.exceptions.Timeout:
            error_msg = f"Model timeout: {self.model_name} took longer than {config.OLLAMA_TIMEOUT}s"
            print(f"❌ {error_msg}")
            return f"Error: {error_msg}. Try a shorter query or increase timeout."
        except requests.exceptions.ConnectionError:
            error_msg = f"Cannot connect to Ollama at {self.base_url}"
            print(f"❌ {error_msg}")
            return f"Error: {error_msg}\nStart Ollama: ollama run {self.model_name}"
        except Exception as e:
            print(f"❌ Ollama error: {e}")
            return f"Error: {str(e)}"

# ========== WEB SCRAPING FUNCTIONS ==========
def get_judgment_from_kanoon(section):
    """Fetch judgment from Indian Kanoon website"""
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        url = f"https://indiankanoon.org/search/?formInput={section}&type=judgement"
        
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        results = soup.find_all("div", class_="result_title")
        
        if not results:
            print(f"⚠️ No judgments found for section {section}")
            return None
        
        link_tag = results[0].find('a')
        if not link_tag or 'href' not in link_tag.attrs:
            return None
        
        link = link_tag['href']
        full_link = "https://indiankanoon.org" + link
        judgment_page = requests.get(full_link, headers=headers, timeout=30)
        judgment_soup = BeautifulSoup(judgment_page.text, 'html.parser')
        judgment_div = judgment_soup.find("div", {"id": "judgment"})
        
        text = judgment_div.get_text(separator="\n", strip=True) if judgment_div else judgment_soup.get_text(separator="\n", strip=True)
        return text[:3000]  # Limit to 3000 chars
    except requests.exceptions.Timeout:
        print(f"⚠️ Web scraping timeout for section {section}")
        return None
    except Exception as e:
        print(f"⚠️ Web scraping error: {e}")
        return None

def find_ipc_section(user_query, llm):
    """Use LLM to find the IPC section number from user query"""
    prompt = f"""You are an expert legal advisor specializing in Indian Penal Code (IPC).
Based on the user's query, identify the exact IPC section number that applies.

User Query: {user_query}

Respond with ONLY the section number (e.g., "304A" or "279"), nothing else.
If you cannot determine a section, respond with "UNKNOWN"."""
    
    response = llm.generate(prompt).strip()
    # Extract just the section number (last word)
    section = response.split()[-1] if response else "UNKNOWN"
    return section

# ========== API ENDPOINTS ==========

@app.route('/api/chat', methods=['POST'])
def chat():
    """Main chat endpoint - uses Mistral LLM + web scraping for IPC sections"""
    try:
        data = request.json
        user_query = data.get('query', '').strip()
        
        if not user_query:
            return jsonify({'error': 'Query cannot be empty'}), 400
        
        # Initialize Ollama LLM
        llm = OllamaLLM(config.OLLAMA_MODEL, config.OLLAMA_HOST)
        
        # Step 1: Find IPC section number using LLM
        print(f"🔍 Finding IPC section for query: {user_query[:100]}...")
        section_number = find_ipc_section(user_query, llm)
        
        # Step 2: Fetch judgment from web scraping
        judgment_text = None
        if section_number != "UNKNOWN":
            print(f"📋 Scraping judgment for section: {section_number}")
            judgment_text = get_judgment_from_kanoon(section_number)
        
        # Step 3: Generate response using LLM with context
        print(f"💡 Generating response using {config.OLLAMA_MODEL} with custom decoder...")
        context = ""
        if judgment_text:
            context = f"\n\nRelevant Case Law (Section {section_number}):\n{judgment_text[:1500]}..."
        else:
            if section_number != "UNKNOWN":
                context = f"\n\n(Could not fetch case law for Section {section_number})"
        
        final_prompt = f"""You are an expert Indian Penal Code legal advisor. Provide clear, concise legal guidance.

User Query: {user_query}

IPC Section: {section_number}{context}

Provide a practical legal response based on the query and available information."""
        
        legal_response = llm.generate(final_prompt)
        
        return jsonify({
            'query': user_query,
            'section': section_number,
            'judgment_found': judgment_text is not None,
            'response': legal_response,
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'model': config.OLLAMA_MODEL
        })
    
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"❌ Error in chat endpoint:\n{error_trace}")
        return jsonify({
            'error': str(e),
            'success': False,
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/status', methods=['GET'])
def status():
    """Check API and Ollama status"""
    try:
        # Try to connect to Ollama
        test_response = requests.get(f"{config.OLLAMA_HOST}/api/tags", timeout=5)
        ollama_running = test_response.status_code == 200
        
        if ollama_running:
            try:
                models = test_response.json().get('models', [])
                model_names = [m.get('name', '') for m in models]
            except:
                model_names = []
        else:
            model_names = []
        
        return jsonify({
            'status': 'online',
            'ollama_connected': ollama_running,
            'model_active': config.OLLAMA_MODEL,
            'available_models': model_names,
            'backend': 'Flask API Server',
            'api_host': config.API_HOST,
            'api_port': config.API_PORT,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'status': 'online',
            'ollama_connected': False,
            'error': f'Ollama not running at {config.OLLAMA_HOST}',
            'model': config.OLLAMA_MODEL,
            'message': f'Start Ollama: ollama run {config.OLLAMA_MODEL}'
        }), 503

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

# ========== RUN SERVER ==========
if __name__ == '__main__':
    print("\n" + "=" * 80)
    print("⚖️  LEGAL AI CHATBOT BACKEND - STARTING SERVER")
    print("=" * 80)
    print(f"🤖 Model: {config.OLLAMA_MODEL}")
    print(f"🔗 Ollama Host: {config.OLLAMA_HOST}")
    print(f"🕐 Timeout: {config.OLLAMA_TIMEOUT}s")
    print(f"🌐 Server: http://{config.API_HOST}:{config.API_PORT}")
    print("\n📝 Make sure Ollama is running with the configured model:")
    print(f"   ollama run {config.OLLAMA_MODEL}")
    print("\n💡 API Endpoints:")
    print(f"   POST   http://localhost:{config.API_PORT}/api/chat")
    print(f"   GET    http://localhost:{config.API_PORT}/api/status")
    print(f"   GET    http://localhost:{config.API_PORT}/api/health")
    print("=" * 80 + "\n")
    
    app.run(host=config.API_HOST, port=config.API_PORT, debug=config.DEBUG)

