from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Recipe Service")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Recipe(BaseModel):
    id: Optional[int]
    title: str
    ingredients: List[str]
    instructions: List[str]
    nutritional_info: dict
    cancer_type: str
    stage: str
    created_by: int

@app.get("/")
async def root():
    return {"message": "Recipe Service is running"}

@app.get("/recipes")
async def get_recipes():
    # TODO: Implement recipe retrieval logic
    return {"recipes": []}

@app.post("/recipes")
async def create_recipe(recipe: Recipe):
    # TODO: Implement recipe creation logic
    return {"message": "Recipe created successfully", "recipe": recipe}

@app.get("/recipes/{recipe_id}")
async def get_recipe(recipe_id: int):
    # TODO: Implement single recipe retrieval logic
    return {"recipe": {}}

@app.get("/recipes/recommendations/{patient_id}")
async def get_recommendations(patient_id: int):
    # TODO: Implement AI-based recipe recommendations
    return {"recommendations": []}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 