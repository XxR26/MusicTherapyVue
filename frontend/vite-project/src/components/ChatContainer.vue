<template>
  <div class="chat-container">
    <!-- 聊天消息区 -->
    <div class="chat-area">
      <MessageItem
        v-for="msg in messages"
        :key="msg.id"
        :message="msg"
      />
      <!-- 打字指示器 -->
      <div v-if="isTyping" class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <span style="margin-left: 8px; font-style: italic;">Analyzing your emotions...</span>
      </div>
    </div>

    <!-- 输入区 -->
    <div class="input-container">
      <div class="input-wrapper">
        <input
          v-model="userInput"
          @keydown.enter="sendMessage"
          placeholder="Describe your mood or feelings..."
        />
        <button class="send-btn" @click="sendMessage">Send</button>
      </div>
      <div class="input-hint">
        <i class="fas fa-keyboard"></i>
        <span>Press Enter to send</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import MessageItem from './MessageItem.vue'
import { sendChat } from '../api'
import { addMusicByEmotion } from '../utils/emotionMusicMap'

export default {
  components: { MessageItem },
  setup() {
    const messages = ref([])
    const userInput = ref('')
    const isTyping = ref(false)
    const detectedEmotion = ref('')

    // 从AI响应中提取情绪JSON
    function extractEmotionFromJSON(text) {
      try {
        // 尝试解析JSON响应
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const json = JSON.parse(jsonMatch[0])
          if (json.emotional_state) {
            return json.emotional_state
          }
        }
        return null
      } catch (e) {
        console.error('Error parsing emotion JSON:', e)
        return null
      }
    }

    // 从AI响应中提取情绪（备用方法）
    function extractEmotionFallback(text) {
      // 定义情绪关键词列表
      const emotions = ['happy', 'sad', 'calm', 'anxious', 'angry', 'excited', 'depressed', 'stressed']

      // 将文本转为小写以便匹配
      const lowerText = text.toLowerCase()

      // 查找文本中包含的情绪关键词
      for (const emotion of emotions) {
        if (lowerText.includes(emotion)) {
          return emotion
        }
      }

      // 如果没有匹配到任何情绪，返回null
      return null
    }

    async function sendMessage() {
      if (!userInput.value.trim()) return

      // 添加用户消息
      messages.value.push({
        id: Date.now(),
        text: userInput.value,
        isUser: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })

      const input = userInput.value
      userInput.value = ''
      isTyping.value = true

      try {
        const result = await sendChat(input)
        isTyping.value = false

        // 添加AI响应到消息列表
        messages.value.push({
          id: Date.now(),
          text: result.success ? result.message : `Error: ${result.error}`,
          isUser: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })

        // 如果成功获取到AI响应，尝试提取情绪并添加音乐
        if (result.success) {
          // 只尝试从JSON中提取情绪，不再使用备用方法
          const emotion = extractEmotionFromJSON(result.message)

          // 过滤掉JSON内容，只显示AI的回复文本
          let aiResponse = result.message
          if (emotion) {
            // 提取JSON之外的内容
            const jsonMatch = result.message.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              aiResponse = result.message.replace(jsonMatch[0], '').trim()
            }
            detectedEmotion.value = emotion
            console.log(`Detected emotion from JSON: ${emotion}. Adding music to playlist.`)

            try {
              // 调用音乐播放器添加对应情绪的音乐
              const addedSongs = addMusicByEmotion(emotion)

              // 添加一条系统消息，告知用户已添加音乐
              messages.value.push({
                id: Date.now(),
                text: `🎵 Added ${emotion} music to your playlist based on your emotional state. (${addedSongs.length} songs)`,
                isUser: false,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              })
            } catch (error) {
              console.error('Error adding music:', error)
              messages.value.push({
                id: Date.now(),
                text: `🎵 Sorry, there was an issue adding music to your playlist. Please try again.`,
                isUser: false,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              })
            }
          } else {
            console.log('No emotional state detected in JSON response, not adding music.')
          }

          // AI回复已经在前面添加，这里不需要重复添加
          // messages.value.push({
          //   id: Date.now(),
          //   text: aiResponse,
          //   isUser: false,
          //   time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          // })
        }
      } catch (err) {
        isTyping.value = false
        messages.value.push({
          id: Date.now(),
          text: `Network error: ${err.message}`,
          isUser: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })
      }
    }

    // 组件挂载时添加AI的初始介绍
    onMounted(() => {
      // 添加AI的初始介绍
      messages.value.push({
        id: Date.now(),
        text: "Welcome to your AI Music Therapy session! I'm here to support your emotional journey through the power of music. As we talk, I'll help you identify your current emotional state and recommend music that can help regulate your feelings. Please share what's on your mind - whether it's a specific feeling, a story, or just how you're feeling today. Together, we'll create a personalized musical experience to support your well-being.",
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
    })

    return { messages, userInput, isTyping, sendMessage, detectedEmotion }
  }
}
</script>
