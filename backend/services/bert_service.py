# backend/services/bert_service.py
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util
import numpy as np
import torch

app = Flask(__name__)

# Load the model once when the server starts
print("Loading BERT model...")
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
print("Model loaded successfully!")

@app.route('/calculate_similarity', methods=['POST'])
def calculate_similarity():
    try:
        data = request.json
        text1 = data['text1']
        text2 = data['text2']

        # Calculate embeddings
        embedding1 = model.encode(text1, convert_to_tensor=True)
        embedding2 = model.encode(text2, convert_to_tensor=True)

        # Calculate cosine similarity
        similarity = util.pytorch_cos_sim(embedding1, embedding2).item()

        return jsonify({
            'similarity': float(similarity)
        })
    except Exception as e:
        print(f"Error in calculate_similarity: {str(e)}")
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/batch_similarity', methods=['POST'])
def batch_similarity():
    try:
        data = request.json
        job_description = data['job_description']
        student_profiles = data['student_profiles']

        # Calculate embeddings
        job_embedding = model.encode(job_description, convert_to_tensor=True)
        profile_embeddings = model.encode(student_profiles, convert_to_tensor=True)

        # Calculate cosine similarities
        similarities = util.pytorch_cos_sim(job_embedding, profile_embeddings)[0]
        
        # Convert to list and create response
        similarity_scores = [
            {
                'index': idx,
                'similarity': float(score)
            }
            for idx, score in enumerate(similarities)
        ]

        # Sort by similarity score
        similarity_scores.sort(key=lambda x: x['similarity'], reverse=True)

        return jsonify({
            'similarities': similarity_scores
        })
    except Exception as e:
        print(f"Error in batch_similarity: {str(e)}")
        return jsonify({
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)