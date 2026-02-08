import os
import json
import logging
from datetime import datetime
from fastapi import FastAPI, HTTPException, Request, UploadFile, File, BackgroundTasks, Form
import shutil
import subprocess
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from google_auth_oauthlib.flow import Flow
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="KYC Agentic Workflow API",
    description="AI-powered Know Your Customer (KYC) processing using Google's Agent Development Kit",
    version="1.0.0"
)

# Configuration for Google OAuth
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/auth/callback")

# These variables are needed for the OAuth flow
client_config = {
    "web": {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "redirect_uris": [GOOGLE_REDIRECT_URI],
    }
}

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Simple Persistence Layer ---
CASE_STORE_FILE = "kyc_cases.json"
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def load_cases() -> Dict[str, Any]:
    if os.path.exists(CASE_STORE_FILE):
        try:
            with open(CASE_STORE_FILE, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading cases: {e}")
            return {}
    return {}

def save_case(case_id: str, data: Dict[str, Any]):
    try:
        cases = load_cases()
        cases[case_id] = data
        with open(CASE_STORE_FILE, 'w') as f:
            json.dump(cases, f, indent=2)
    except Exception as e:
        logger.error(f"Error saving case {case_id}: {e}")

# --------------------------------

class CustomerData(BaseModel):
    full_name: str
    date_of_birth: Optional[str] = None
    nationality: Optional[str] = None
    citizenship: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    occupation: Optional[str] = None
    employer: Optional[str] = None
    net_worth: Optional[float] = None
    source_of_wealth: Optional[str] = None
    is_pep: Optional[bool] = False
    additional_info: Optional[Dict[str, Any]] = {}

class KYCRequest(BaseModel):
    customer_data: CustomerData
    document_types: Optional[List[str]] = []
    priority: Optional[str] = "standard"  # standard, high, urgent

class KYCResponse(BaseModel):
    case_id: str
    status: str
    customer_data: CustomerData
    analysis_results: Dict[str, Any]
    risk_assessment: Dict[str, Any]
    recommendations: List[str]
    timestamp: str
    documents_processed: int

class LoginRequest(BaseModel):
    email: str
    role: str

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/")
def read_root():
    return {
        "message": "KYC Agentic Workflow API",
        "version": "1.0.0",
        "description": "AI-powered KYC processing using Google's Agent Development Kit",
        "status": "running",
        "endpoints": {
            "POST /auth/login": "Mock login for testing",
            "GET /auth/google": "Initiate Google OAuth login",
            "GET /auth/callback": "Google OAuth callback handler",
            "GET /kyc/cases": "List all KYC cases",
            "POST /kyc/process": "Submit a new KYC request",
            "POST /kyc/upload-documents": "Mock document upload endpoint",
            "GET /kyc/status/{case_id}": "Check status of a specific case",
            "GET /healthz": "Health check"
        }
    }

@app.get("/auth/google")
async def google_login():
    """
    Initiate Google login flow.
    """
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=500, 
            detail="Google OAuth credentials not configured in backend .env"
        )
    
    flow = Flow.from_client_config(
        client_config,
        scopes=["openid", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"]
    )
    flow.redirect_uri = GOOGLE_REDIRECT_URI
    
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true'
    )
    
    return {"login_url": authorization_url}

@app.get("/auth/callback")
async def google_callback(code: str, request: Request):
    """
    Handle Google OAuth callback.
    """
    try:
        flow = Flow.from_client_config(
            client_config,
            scopes=["openid", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"]
        )
        flow.redirect_uri = GOOGLE_REDIRECT_URI
        
        # Exchange code for tokens
        flow.fetch_token(code=code)
        credentials = flow.credentials
        
        # Verify the ID token and get user info
        user_info = id_token.verify_oauth2_token(
            credentials.id_token, 
            google_requests.Request(), 
            GOOGLE_CLIENT_ID
        )
        
        # Redirect to the frontend with user info
        # In a real app, you might use a secure JWT or session cookie
        frontend_callback_url = os.getenv("FRONTEND_URL", "http://localhost:5173") + "/auth-callback"
        
        # Passing user info in URL for simulation (Not secure for production, but okay for this demo)
        params = f"?id={user_info['sub']}&name={user_info.get('name', '')}&email={user_info['email']}&role=customer"
        return RedirectResponse(frontend_callback_url + params)

    except Exception as e:
        logger.error(f"Error in Google callback: {e}")
        # Redirect to login with error
        return RedirectResponse(os.getenv("FRONTEND_URL", "http://localhost:5173") + "/login?error=auth_failed")

@app.post("/auth/login")
async def login(request: LoginRequest):
    logger.info(f"Logging in user: {request.email} with role: {request.role}")
    return {
        "id": "user_" + str(hash(request.email) % 10000),
        "name": request.email.split('@')[0].capitalize(),
        "email": request.email,
        "role": request.role,
        "token": "mock-jwt-token"
    }

@app.get("/kyc/cases")
async def list_cases():
    """List all KYC cases for the dashboard."""
    cases = load_cases()
    return list(cases.values())

@app.get("/kyc/status/{case_id}")
async def get_case_status(case_id: str):
    cases = load_cases()
    if case_id not in cases:
        raise HTTPException(status_code=404, detail="Case not found")
    return cases[case_id]

@app.post("/kyc/upload-docs")
async def upload_kyc_docs(
    full_name: str = Form(...),
    files: List[UploadFile] = File(...),
):
    """
    Actual document upload endpoint that starts the process.
    """
    case_id = f"KYC-{datetime.utcnow().strftime('%Y%m%d')}-{abs(hash(full_name)) % 10000:04d}"
    
    saved_files = []
    case_dir = os.path.join(UPLOAD_DIR, case_id)
    os.makedirs(case_dir, exist_ok=True)
    
    for file in files:
        file_path = os.path.join(case_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        saved_files.append(os.path.abspath(file_path))
    
    # Initial case status
    case_data = {
        "case_id": case_id,
        "status": "uploading",
        "customer_data": {"full_name": full_name},
        "files": saved_files,
        "timestamp": datetime.utcnow().isoformat(),
        "analysis_results": {},
        "risk_assessment": {}
    }
    save_case(case_id, case_data)
    
    return {"status": "success", "case_id": case_id, "files": saved_files}

@app.post("/kyc/start-analysis/{case_id}")
async def start_kyc_analysis(case_id: str, background_tasks: BackgroundTasks):
    """Trigger the CrewAI agent in the background."""
    cases = load_cases()
    if case_id not in cases:
        raise HTTPException(status_code=404, detail="Case not found")
    
    cases[case_id]["status"] = "analyzing"
    save_case(case_id, cases[case_id])
    
    background_tasks.add_task(run_agent_workflow, case_id)
    return {"status": "started", "case_id": case_id}

async def run_agent_workflow(case_id: str):
    """Background task to run CrewAI agents."""
    try:
        cases = load_cases()
        case = cases.get(case_id)
        if not case or not case.get("files"):
            return

        file_path = case["files"][0] # Just use the first one for now
        
        # We'll use subprocess to run the crew command safely in its own env
        # Navigate to kycagents dir and run uv run run_crew
        kyc_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "kycagents"))
        
        # Force UTF-8 encoding for Windows specifically to handle emojis in CrewAI output
        env = os.environ.copy()
        env["PYTHONUTF8"] = "1"
        
        process = subprocess.Popen(
            ["uv", "run", "run_crew", file_path],
            cwd=kyc_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8',
            env=env
        )
        
        stdout, stderr = process.communicate()
        
        if process.returncode == 0:
            # Try to find a report.md or extract from stdout
            # For this demo, we'll assume the agent adds results to the case store
            # Since the agent runs in a separate process, we'll mock the extraction
            # In a real app, the agent would use a Tool to update a DB or File.
            
            case["status"] = "completed"
            case["analysis_results"] = {
                "raw_output": stdout,
                "agent_notes": "Extraction completed via GLM-OCR."
            }
            # Mocking some structured data extraction for the UI
            if "John Doe" in stdout:
               case["customer_data"]["extracted"] = {"name": "John Doe", "id": "123456789"}
        else:
            case["status"] = "failed"
            case["analysis_results"] = {"error": stderr}
            
        save_case(case_id, case)
        
    except Exception as e:
        logger.error(f"Background task failed: {e}")
        cases = load_cases()
        if case_id in cases:
            cases[case_id]["status"] = "failed"
            save_case(case_id, cases[case_id])


@app.post("/kyc/process", response_model=KYCResponse)
async def process_kyc_request(request: KYCRequest):
    """
    Process a complete KYC request with customer data.
    """
    try:
        logger.info(f"Processing KYC request for customer: {request.customer_data.full_name}")
        
        case_id = f"KYC-{datetime.utcnow().strftime('%Y%m%d')}-{abs(hash(request.customer_data.full_name)) % 10000:04d}"
        
        # Risk Logic (Simulated)
        analysis_results = {
            "agent_response": f"AI analysis completed for {request.customer_data.full_name}",
            "internal_database_check": "completed",
            "document_analysis": "completed" if request.document_types else "skipped",
            "external_searches": "completed",
            "wealth_assessment": "completed"
        }
        
        risk_score = 0
        risk_factors = []
        
        high_risk_countries = ['AF', 'IR', 'KP', 'SY', 'MM', 'BY', 'RU', 'CN']
        nationality = (request.customer_data.nationality or "").upper()
        if nationality in high_risk_countries:
            risk_score += 35
            risk_factors.append("High-risk jurisdiction")
            
        if request.customer_data.is_pep:
            risk_score += 40
            risk_factors.append("Politically Exposed Person (PEP)")
            
        risk_score = min(risk_score, 100)
        risk_level = "HIGH" if risk_score >= 70 else "MEDIUM" if risk_score >= 40 else "LOW"
        
        risk_assessment = {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "risk_factors": risk_factors,
            "recommendation": "Manual review required" if risk_level != "LOW" else "Approved for onboarding"
        }
        
        response_data = {
            "case_id": case_id,
            "status": "completed",
            "customer_data": request.customer_data.dict(),
            "analysis_results": analysis_results,
            "risk_assessment": risk_assessment,
            "recommendations": [risk_assessment["recommendation"], "Verify document authenticity"],
            "timestamp": datetime.utcnow().isoformat(),
            "documents_processed": len(request.document_types or [])
        }
        
        save_case(case_id, response_data)
        
        return KYCResponse(**response_data)
        
    except Exception as e:
        logger.error(f"Error processing KYC request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
