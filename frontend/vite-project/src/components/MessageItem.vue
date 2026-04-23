<template>
  <div :class="['message', message.isUser ? 'user-message' : 'ai-message']">
    <div class="message-avatar">
      <i :class="message.isUser ? 'fas fa-user-circle' : 'fas fa-robot'"></i>
    </div>
    <div class="message-content">
      <div class="message-header">
        <span class="sender-name">{{ message.isUser ? 'You' : 'AI Music Therapist' }}</span>
        <span class="message-time">{{ message.time }}</span>
      </div>
      <div class="message-text">{{ filteredMessageText }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['message'],
  computed: {
    filteredMessageText() {
      // 如果是用户消息，直接返回原文
      if (this.message.isUser) {
        return this.message.text;
      }
      
      // 确保message.text存在且为字符串
      if (!this.message.text || typeof this.message.text !== 'string') {
        return '';
      }
      
      // 过滤AI消息中的JSON情绪状态信息
      let text = this.message.text;
      
      // 移除JSON格式的情绪状态信息
      // 匹配类似 {"emotional_state": "sad"} 或 {"emotion": "happy", "confidence": 0.85} 的模式
      const emotionJsonPattern = /\{\s*"(emotion|emotional_state)"\s*:\s*"[^"]+"\s*(,\s*"(confidence|emotional_state)"\s*:\s*("[^"]+"|[0-9.]+)\s*)?\s*\}/g;
      text = text.replace(emotionJsonPattern, '');
      
      // 移除可能出现的"Current emotion: "前缀
      text = text.replace(/Current emotion:\s*/gi, '');
      
      // 清理多余的空行和空格
      text = text.trim();
      
      // 如果过滤后为空，返回原始文本
      if (!text) {
        return this.message.text;
      }
      
      return text;
    }
  }
}
</script>

<style scoped>
.message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 75%;
  animation: fadeIn 0.3s ease-out;
}

.message-avatar {
  font-size: 1.8rem;
  color: #6a11cb;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.user-message .message-avatar {
  color: #4facfe;
}

.message-content {
  padding: 16px 20px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  font-size: 0.98rem;
  line-height: 1.7;
  transition: all 0.3s ease;
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
}

.user-message .message-content {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  border-radius: 20px 20px 6px 20px;
  box-shadow: 0 4px 12px rgba(106, 17, 203, 0.25);
}

.ai-message .message-content {
  background: white;
  color: #2d3436;
  border: 1px solid #e9ecef;
  border-radius: 20px 20px 20px 6px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
}

.sender-name {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.message-time {
  opacity: 0.65;
  font-size: 0.72rem;
  font-weight: 500;
}

/* AI消息的段落样式 */
.ai-message .message-text {
  white-space: pre-line;
  line-height: 1.85;
  letter-spacing: 0.2px;
}

/* 双倍行距分隔段落 */
.ai-message .message-text::after {
  content: "";
  display: block;
  margin: 0.8em 0;
}
</style>
