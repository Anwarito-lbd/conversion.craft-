from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from src.sourcing.finder import find_winning_products

app = FastAPI()

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    niche: str

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/analyze")
def analyze(request: AnalyzeRequest):
    """
    Analyzes a niche and finds winning products.
    """
    products = find_winning_products(request.niche)
    return {"niche": request.niche, "products": products}

from src.agents.copywriter import copywriter_agent

# ... existing imports ...

class GenerateCopyRequest(BaseModel):
    product_name: str
    description: str

@app.post("/api/generate-copy")
def generate_copy(request: GenerateCopyRequest):
    """
    Generates sales copy for a product using Gemini.
    """
    return copywriter_agent.generate_sales_copy(request.product_name, request.description)

from src.agents.model_generator import model_generator
from src.agents.director import director_agent
from src.agents.producer import producer_agent
from typing import List

# ... existing imports ...

class Generate3DRequest(BaseModel):
    image_url: str

class GenerateStoryboardRequest(BaseModel):
    product_name: str
    benefits: List[str]

class RenderSceneRequest(BaseModel):
    visual_prompt: str

@app.post("/api/generate-3d")
def generate_3d(request: Generate3DRequest):
    """
    Generates a 3D model from an image URL.
    """
    glb_url = model_generator.generate_3d_model(request.image_url)
    return {"model_url": glb_url}

@app.post("/api/generate-storyboard")
def generate_storyboard(request: GenerateStoryboardRequest):
    """
    Generates a video storyboard using Gemini.
    """
    return director_agent.generate_storyboard(request.product_name, request.benefits)

@app.post("/api/render-scene")
def render_scene(request: RenderSceneRequest):
    """
    Renders a video scene from a visual prompt using Replicate (SDXL -> SVD).
    """
    video_url = producer_agent.render_scene(request.visual_prompt)
    return {"video_url": video_url}

@app.post("/api/publish")
def publish_campaign(request: PublishRequest):
    """
    Publishes the campaign (product + assets) to Shopify.
    """
    return publisher_service.push_to_shopify(request.product_data, request.user_tokens)

# Legacy/Alternative endpoint
@app.post("/api/sourcing/find")
def sourcing_find(request: AnalyzeRequest):
    products = find_winning_products(request.niche)
    return products
