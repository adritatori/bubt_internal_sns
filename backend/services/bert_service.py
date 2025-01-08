from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util
import numpy as np
import torch
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

print("Loading BERT model...")
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
print("Model loaded successfully!")

def preprocess_text(text, options):
    """Preprocess text based on options"""
    processed = text.lower() if options.get('case_sensitive', False) else text
    
    # Optionally weight different sections
    if options.get('weight_sections', False):
        sections = text.split('\n')
        weighted_sections = []
        for section in sections:
            if 'skills:' in section.lower():
                weighted_sections.extend([section] * 3)  # Triple weight for skills
            elif 'experience:' in section.lower():
                weighted_sections.extend([section] * 2)  # Double weight for experience
            else:
                weighted_sections.append(section)
        processed = ' '.join(weighted_sections)
    
    return processed

@app.route('/batch_similarity', methods=['POST'])
def batch_similarity():
    try:
        data = request.json
        job_description = data['job_description']
        student_profiles = data['student_profiles']
        print("This is student profile", student_profiles)
        print("This is job description", job_description)
        # Similarity configuration
        config = data.get('config', {
            'threshold': 0.4,  # Lower default threshold
            'case_sensitive': False,
            'weight_sections': True,
            'scoring_method': 'cosine',  # or 'euclidean' or 'hybrid'
            'top_k': 20  # Return more matches
        })

        # Preprocess texts
        job_description = preprocess_text(job_description, config)
        student_profiles = [preprocess_text(profile, config) for profile in student_profiles]

        # Calculate embeddings
        job_embedding = model.encode(job_description, convert_to_tensor=True)
        profile_embeddings = model.encode(student_profiles, convert_to_tensor=True)

        # Calculate similarities based on chosen method
        if config['scoring_method'] == 'cosine':
            similarities = util.pytorch_cos_sim(job_embedding, profile_embeddings)[0]
        elif config['scoring_method'] == 'euclidean':
            similarities = 1 - util.pytorch_euclidean_distance(job_embedding, profile_embeddings)[0]
            # Normalize to 0-1 range
            similarities = (similarities - similarities.min()) / (similarities.max() - similarities.min())
        else:  # hybrid
            cos_sim = util.pytorch_cos_sim(job_embedding, profile_embeddings)[0]
            euc_sim = 1 - util.pytorch_euclidean_distance(job_embedding, profile_embeddings)[0]
            euc_sim = (euc_sim - euc_sim.min()) / (euc_sim.max() - euc_sim.min())
            similarities = (cos_sim + euc_sim) / 2

        # Create response with additional metadata
        similarity_scores = [
            {
                'index': idx,
                'similarity': float(score),
                'confidence': 'high' if score > 0.7 else 'medium' if score > 0.5 else 'low'
            }
            for idx, score in enumerate(similarities)
        ]

        return jsonify({
            'similarities': similarity_scores,
            'metadata': {
                'average_similarity': float(similarities.mean()),
                'max_similarity': float(similarities.max()),
                'min_similarity': float(similarities.min()),
                'config_used': config
            }
        })
    except Exception as e:
        print(f"Error in batch_similarity: {str(e)}")
        return jsonify({
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)