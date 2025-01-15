from flask import Flask, request, jsonify
from flask_cors import CORS
import snowflake.connector
from transformers import AutoTokenizer, AutoModel
import torch
import numpy as np
import base64
import json
import requests
import os
from pdfminer.high_level import extract_text
from snowflake.snowpark import Session

# Flask App
app = Flask(__name__)
# Allow CORS for all routes and origins
CORS(app, resources={r"/*": {"origins": "*"}})

# Snowflake Configuration
SNOWFLAKE_CONFIG = {
    "user": "ssalvi",
    "password": "Suyash!1998",
    "account": "jzsqwus-ywb74626",
    # "warehouse": "YOUR_WAREHOUSE",
    "database": "LEARNING_ASSISTANT",
    "schema": "PUBLIC",
}

# Mistral API Configuration
MISTRAL_API_URL = "https://api.mistral.ai/v1/generate"  # Example endpoint
MISTRAL_API_KEY = ""

# Initialize Embedding Model
tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
model = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")

# Generate Embeddings
def generate_embedding(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
    with torch.no_grad():
        embedding = model(**inputs).last_hidden_state.mean(dim=1)
    return embedding[0].numpy()

# Decode Base64 Embedding to Numpy Array
def bytes_to_array(byte_string):
    bytes_data = base64.b64decode(byte_string)
    return np.frombuffer(bytes_data, dtype=np.float32)

# Extract Text from PDF
def extract_text_from_pdf(pdf_path):
    try:
        return extract_text(pdf_path)
    except Exception as e:
        print(f"Error extracting text from {pdf_path}: {e}")
        return None

# Process PDFs and Store in Snowflake
def process_pdfs():
    PDF_FOLDER = "../content/pdfs/"
    conn = snowflake.connector.connect(**SNOWFLAKE_CONFIG)
    cursor = conn.cursor()

    try:
        files = os.listdir(PDF_FOLDER)
        for file in files:
            if file.endswith(".pdf"):
                file_path = os.path.join(PDF_FOLDER, file)
                content = extract_text_from_pdf(file_path)
                
                # Skip if content extraction failed
                if content is None:
                    print(f"Skipping {file} due to extraction error")
                    continue

                try:
                    # Generate embedding and convert to compressed binary
                    embedding = generate_embedding(content)
                    embedding_bytes = base64.b64encode(embedding.tobytes()).decode('utf-8')

                    # Insert into Snowflake
                    cursor.execute("""
                        INSERT INTO educational_content (id, title, content, embedding)
                        VALUES (%s, %s, %s, %s)
                    """, (file, file.replace(".pdf", ""), content, embedding_bytes))
                    print(f"Processed: {file}")
                except Exception as e:
                    print(f"Error processing {file}: {e}")
                    continue
    finally:
        cursor.close()
        conn.close()

# Query Snowflake for Relevant Content
def get_relevant_content(query_embedding, top_k=5):
    conn = snowflake.connector.connect(**SNOWFLAKE_CONFIG)
    cursor = conn.cursor()

    try:
        # Fetch embeddings and content from Snowflake
        cursor.execute("SELECT id, title, content, embedding FROM educational_content")
        rows = cursor.fetchall()

        # Decode embeddings and calculate similarity
        results = []
        for row in rows:
            stored_embedding = bytes_to_array(row[3])
            similarity = np.dot(query_embedding, stored_embedding) / (
                np.linalg.norm(query_embedding) * np.linalg.norm(stored_embedding)
            )
            results.append((row[1], row[2], similarity))

        # Sort results by similarity in descending order
        results = sorted(results, key=lambda x: x[2], reverse=True)
        return results[:top_k]  # Return top_k results

    finally:
        cursor.close()
        conn.close()

# Generate Output Using Mistral LLM
# def generate_output_with_mistral(prompt):
#     headers = {"Authorization": f"Bearer {MISTRAL_API_KEY}"}
#     payload = {"prompt": prompt, "model": "mistral-large2", "max_tokens": 512}

#     response = requests.post(MISTRAL_API_URL, headers=headers, json=payload)
#     if response.status_code == 200:
#         return response.json()["generated_text"]
#     else:
#         raise Exception(f"Mistral API Error: {response.status_code}, {response.text}")

def get_snowflake_session():
    return Session.builder.configs(SNOWFLAKE_CONFIG).create()

def generate_output_with_mistral(prompt):
    session = get_snowflake_session()

    try:
        # Prepare JSON payload
        payload = {"prompt": prompt, "max_tokens": 512}

        # Convert payload to JSON string
        payload_json = json.dumps(payload)

        # Use Snowpark to call MISTRAL_GENERATE with parameterized input
        result = session.sql("""
            SELECT MISTRAL_GENERATE(
                PARSE_JSON(?),
                'mistral-large2'
            ) AS generated_text
        """, [payload_json]).collect()

        return result[0]["GENERATED_TEXT"]
    except Exception as e:
        print(f"Error during Mistral generation via Snowflake Cortex: {e}")
        raise Exception(f"Snowflake Cortex Error: {e}")
    finally:
        session.close()



# Prepare Prompt for Mistral
def prepare_prompt(goal, content, proficiency):
    if goal == "summary":
        return f"Summarize the following content for a {proficiency} learner:\n\n{content}"
    elif goal == "step-by-step":
        return f"Create a detailed step-by-step guide for a {proficiency} learner from the following content:\n\n{content}"
    elif goal == "faq":
        return f"Generate FAQs based on the following content for a {proficiency} learner:\n\n{content}"
    elif goal == "quiz":
        return f"Generate 5 multiple-choice quiz questions with answers from the following content for a {proficiency} learner:\n\n{content}"
    else:
        return f"Provide relevant information for the following query:\n\n{content}"

# Flask Route for Generating Content
@app.route('/generate', methods=['POST'])
def generate():
    try:
        # Parse user input
        data = request.json
        topic = data.get("topic")
        goal = data.get("goal")
        proficiency = data.get("proficiency")

        if not topic or not goal or not proficiency:
            return jsonify({"error": "Missing required fields"}), 400

        # Step 1: Generate embedding for the query
        query_embedding = generate_embedding(topic)
        print("query_embedding successful, ",query_embedding)

        # Step 2: Retrieve relevant content from Snowflake
        relevant_content = get_relevant_content(query_embedding)
        if not relevant_content:
            return jsonify({"error": "No relevant content found"}), 404
        print("relevant_content found, ",relevant_content)

        # Combine relevant content
        combined_content = "\n".join([item[1] for item in relevant_content])

        # Step 3: Prepare the prompt
        prompt = prepare_prompt(goal, combined_content, proficiency)
        print("prompt prepared, ", prompt)

        # Step 4: Generate output using Mistral
        output = generate_output_with_mistral(prompt)
        print("output generated, ",output)

        # Return the result
        return jsonify({"output": output})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run Flask App
if __name__ == "__main__":
    # Uncomment to process PDFs (only needed for the first run)
    # process_pdfs()
    # app.run(port=5000, debug=True)
    app.run(host="0.0.0.0", port=5001, debug=True)
