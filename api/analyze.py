import os
import json
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# Configure Gemini
api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY") or os.environ.get("API_KEY")

# If the key is the placeholder from .env.example, ignore it
if api_key == "MY_GEMINI_API_KEY":
    api_key = None

if not api_key:
    print("Warning: Gemini API key is not configured.")
else:
    print(f"Using API key (length: {len(api_key)})")
    genai.configure(api_key=api_key)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        if not api_key:
            is_vercel = os.environ.get("VERCEL") == "1"
            error_message = "Gemini API key is not configured. Please add GEMINI_API_KEY to your Vercel project's Environment Variables." if is_vercel else "Gemini API key is not configured. Please go to the 'Settings' menu (gear icon) in AI Studio, click 'Secrets', and add a secret named GEMINI_API_KEY with your API key."
            return jsonify({"error": error_message}), 500

        data = request.json
        patient_info = data.get('patientInfo', {})
        risk_habits = data.get('riskHabits', {})
        images = data.get('images', [])

        model = genai.GenerativeModel("gemini-3-flash-preview")

        prompt = f"""
        You are a specialized oral pathology AI assistant. 
        Analyze the following patient data and oral cavity images to assess for Oral Potentially Malignant Disorders (OPMD).

        Patient Information:
        - Name: {patient_info.get('name')}
        - Age: {patient_info.get('age')}
        - Phone: {patient_info.get('phoneNumber')}
        - Region: {patient_info.get('region')}
        - Nation: {patient_info.get('nation')}

        Risk Habits:
        - Chewing Tobacco: {"Yes" if risk_habits.get('chewingTobacco') else "No"}
        - Smoking: {"Yes" if risk_habits.get('smoking') else "No"}
        - Areca Nut Use: {"Yes" if risk_habits.get('arecaNut') else "No"}
        - Sharp Teeth: {"Yes" if risk_habits.get('sharpTeeth') else "No"}
        - Ill-fitting Dentures: {"Yes" if risk_habits.get('illFittingDentures') else "No"}
        - Poor Oral Hygiene: {"Yes" if risk_habits.get('poorHygiene') else "No"}
        - Family History of Cancer: {"Yes" if risk_habits.get('familyHistory') else "No"}

        Task:
        1. Provide a provisional diagnosis based on the visual evidence in the images and the risk factors.
        2. Assign a risk score from 0 to 10 (0-5: Lower risk of OPMD, 6-10: Higher likelihood of oral cancer).
        3. Summarize the findings clearly and concisely.
        4. Identify specific lesion types (e.g., Leukoplakia, Erythroplakia, Oral Lichen Planus).
        5. Provide actionable recommendations.
        6. Include references to reliable medical literature or online articles for the identified conditions.

        IMPORTANT: This is a provisional assessment for educational purposes. Always include a strong medical disclaimer.
        
        Return the result strictly as a JSON object with the following structure:
        {{
            "provisionalDiagnosis": "string",
            "riskScore": number,
            "summary": "string",
            "identifiedLesions": ["string"],
            "recommendations": ["string"],
            "literatureReferences": [{{ "title": "string", "url": "string" }}]
        }}
        """

        content = [prompt]
        for img_data in images:
            # Handle data URL if present
            if "," in img_data:
                img_data = img_data.split(",")[1]
            
            content.append({
                "mime_type": "image/jpeg",
                "data": base64.b64decode(img_data)
            })

        response = model.generate_content(
            content,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
            )
        )

        return jsonify(json.loads(response.text))

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# For Vercel
def handler(request):
    return app(request)
