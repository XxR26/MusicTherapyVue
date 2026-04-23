import json
from flask import Flask, render_template, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 允许跨域请求


class MusicTherapyAPI:
    """处理AI API调用的类"""

    def __init__(self):
        self.api_key = "6851172c-a5e7-4c27-8c13-fdbfce4bf2ab"
        self.base_url = "https://genai.hkbu.edu.hk/api/v0/rest"
        self.model_name = "gpt-4.1"
        self.api_version = "2024-12-01-preview"

    def build_system_prompt(self):
        """构建系统提示词 - 音乐情绪助手"""
        return """You are a professional music therapist and emotional support assistant. Your task is to analyze the user's emotional state and recommend appropriate music types.

Please respond in the following format:
1. If the user hasn't provided an emotional state, act like a professional music therapist and continue the conversation empathetically.
2. If the user shares their story or feelings, analyze their emotional state based on the conversation and return it in JSON format: {"emotional_state": "emotion"}.
   Available emotional states are: happy, sad, calm, anxious, angry.
   If not, continue the conversation and ask them to share more about their feelings.
3. Finally, recommend music types that would be beneficial for their emotional state.

Music recommendations for each emotional state:
- happy: Upbeat and energetic music to enhance positive mood
- sad: Gentle and comforting music to provide emotional support
- calm: Relaxing and peaceful music for tranquility
- anxious: Soothing and calming music to reduce anxiety
- angry: Intense and cathartic music for emotional release

Important guidelines:
- Please respond in English, ensuring the content is empathetic and supportive
- Do not use sequence numbers in your response
- Format your response with clear paragraph breaks to improve readability
- Do not use HTML tags in your response
- Only recommend music types, not specific songs or artists
- Keep your responses concise and focused on the user's emotional needs
- Always include the JSON emotional state at the end of your response when applicable"""

    def call_genai_api(self, user_message):
        """调用HKBU GenAI API"""

        system_message = self.build_system_prompt()

        messages = [
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message},
        ]

        url = f"{self.base_url}/deployments/{self.model_name}/chat/completions?api-version={self.api_version}"
        headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
            "api-key": self.api_key,
        }
        payload = {
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 500,
            "top_p": 1,
            "stream": False
        }

        try:
            response = requests.post(url, json=payload, headers=headers, timeout=30)

            if response.status_code == 200:
                result = response.json()
                if "choices" in result and len(result["choices"]) > 0:
                    assistant_message = result["choices"][0]["message"]["content"]
                    return {
                        "success": True,
                        "response": assistant_message
                    }
                else:
                    return {
                        "success": False,
                        "error": "AI did not return a valid response"
                    }
            else:
                return {
                    "success": False,
                    "error": f"API call failed (status code: {response.status_code})"
                }

        except Exception as e:
            return {
                "success": False,
                "error": f"Request exception: {str(e)}"
            }


# 创建API处理器实例
api_processor = MusicTherapyAPI()


@app.route('/')
def index():
    """渲染主页面"""
    return render_template('index.html')


@app.route('/api/chat', methods=['POST'])
def chat():
    """处理聊天请求"""
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()

        if not user_message:
            return jsonify({
                "success": False,
                "error": "Message cannot be empty"
            })

        print(f"Received message: {user_message}")

        # 调用AI API
        result = api_processor.call_genai_api(user_message)
        print(f"API result: {result}")

        if result['success']:
            return jsonify({
                "success": True,
                "message": result['response']
            })
        else:
            return jsonify({
                "success": False,
                "error": result['error']
            })
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Server error: {str(e)}"
        })


@app.route('/api/health')
def health_check():
    """健康检查端点"""
    return jsonify({
        "status": "ok",
        "service": "Music Therapy AI Chat"
    })


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)