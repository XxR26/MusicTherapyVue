<template>
  <div class="app-container">
    <!-- 顶部标题栏 -->
    <header class="header">
      <div class="logo">
        <i class="fas fa-music"></i>
        <h1>AI Music Therapy Assistant</h1>
      </div>
      <div class="subtitle">
        <p>Healing emotions through music, improving mental well-being 🎵</p>
      </div>
    </header>

    <!-- 主体布局 -->
    <div class="main-layout">
      <aside class="sidebar">
        <MusicPlayer />
      </aside>
      <main class="chat-section">
        <ChatContainer />
      </main>
    </div>
  </div>
</template>

<script>
import ChatContainer from './components/ChatContainer.vue'
import MusicPlayer from './components/MusicPlayer.vue'

export default {
  components: { ChatContainer, MusicPlayer }
}
</script>
