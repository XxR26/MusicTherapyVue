<template>
  <div class="music-player-container">
    <div class="player-header">
      <i class="fas fa-music"></i>
      <h3>Recommended Playlist</h3>
      <div v-if="currentEmotion" class="emotion-indicator">
        <span class="emotion-label">Current Emotion:</span>
        <span class="emotion-value">{{ currentEmotion }}</span>
      </div>
    </div>

    <div class="player-main">
      <div class="player-controls">
        <audio ref="player" controls style="width:100%"></audio>
      </div>
      
      <div v-if="currentIndex >= 0 && songs[currentIndex]" class="now-playing">
        <div class="now-playing-label">Now Playing:</div>
        <div class="now-playing-title">{{ songs[currentIndex].title }}</div>
        <div class="now-playing-artist">{{ songs[currentIndex].artist }}</div>
      </div>

      <div v-if="isLoading" class="loading-indicator">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Finding music for {{ currentEmotion }}...</p>
      </div>

      <div class="playlist-section">
        <div class="playlist-header">
          <h4>Playlist</h4>
          <button v-if="songs.length > 0" class="clear-btn" @click="clearPlaylist">
            <i class="fas fa-trash"></i> Clear
          </button>
        </div>
        <div v-if="songs.length === 0" class="empty-playlist">
          <i class="fas fa-music"></i>
          <p>No songs yet</p>
        </div>
        <div v-else class="playlist">
          <div
            v-for="song in songs"
            :key="song.title"
            class="playlist-item"
            @click="playSong(song)"
          >
            <div class="playlist-item-info">
              <div class="playlist-item-title">{{ song.title }}</div>
              <div class="playlist-item-artist">{{ song.artist }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { getMusicByEmotion } from '../utils/emotionMusicMap'

export default {
  setup() {
    const songs = ref([])
    const player = ref(null)
    const currentEmotion = ref('')
    const isLoading = ref(false)

    function playSong(song) {
      if (!player.value) {
        console.error('Audio player not initialized')
        return
      }

      // 更新当前播放歌曲的索引
      currentIndex.value = songs.value.findIndex(s => s.title === song.title && s.artist === song.artist)

      // 检查文件是否存在
      const audio = new Audio(song.url)
      audio.addEventListener('error', (e) => {
        console.error(`Failed to load audio file: ${song.url}`, e)
      })

      // 设置预加载
      player.value.preload = 'auto'

      // 设置音量
      player.value.volume = 0.7

      player.value.src = song.url

      // 尝试播放，但处理自动播放限制
      const playPromise = player.value.play()

      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Playing audio:', song.title)
        }).catch(error => {
          console.error('Failed to play audio:', error)

          // 如果自动播放失败，显示提示
          console.log('Autoplay prevented. Please click the play button.')

          // 添加一个提示元素
          const notification = document.createElement('div')
          notification.className = 'audio-notification'
          notification.innerHTML = `
            <div class="notification-content">
              <i class="fas fa-music"></i>
              <span>Click the play button to start music</span>
            </div>
          `
          document.body.appendChild(notification)

          // 3秒后移除提示
          setTimeout(() => {
            notification.remove()
          }, 3000)
        })
      }
    }

    // 添加歌曲到播放列表
    function addSongs(newSongs) {
      // 避免重复添加相同歌曲
      newSongs.forEach(song => {
        if (!songs.value.some(s => s.title === song.title && s.artist === song.artist)) {
          songs.value.push(song)
        }
      })
    }

    // 根据情绪添加歌曲
    function addSongsByEmotion(emotion) {
      currentEmotion.value = emotion
      isLoading.value = true

      // 获取匹配的音乐
      const matchedSongs = getMusicByEmotion(emotion)

      // 添加到播放列表
      addSongs(matchedSongs)

      // 自动播放第一首
      if (matchedSongs.length > 0) {
        playSong(matchedSongs[0])
      }

      isLoading.value = false
    }

    // 清空播放列表
    function clearPlaylist() {
      // 停止当前播放的歌曲
      if (player.value) {
        player.value.pause()
        player.value.src = ''
      }
      // 清空播放列表
      songs.value = []
      currentEmotion.value = ''
      console.log('Playlist cleared and playback stopped')
    }

    // 添加当前播放歌曲索引的引用
    const currentIndex = ref(-1)

    // // 切换到上一首歌曲
    // function playPrevious() {
    //   if (songs.value.length === 0) return
    //
    //   // 如果没有当前歌曲或已经是第一首，则播放最后一首
    //   if (currentIndex.value === -1 || currentIndex.value === 0) {
    //     currentIndex.value = songs.value.length - 1
    //   } else {
    //     // 播放上一首
    //     currentIndex.value = currentIndex.value - 1
    //   }
    //
    //   playSong(songs.value[currentIndex.value])
    // }
    //
    // // 切换到下一首歌曲
    // function playNext() {
    //   if (songs.value.length === 0) return
    //
    //   // 如果没有当前歌曲或已经是最后一首，则播放第一首
    //   if (currentIndex.value === -1 || currentIndex.value === songs.value.length - 1) {
    //     currentIndex.value = 0
    //   } else {
    //     // 播放下一首
    //     currentIndex.value = currentIndex.value + 1
    //   }
    //
    //   playSong(songs.value[currentIndex.value])
    // }

    // 组件挂载时，将实例添加到全局
    onMounted(() => {
      window.musicPlayerInstance = {
        addSongs,
        addSongsByEmotion,
        clearPlaylist,
        // playPrevious,
        // playNext,
        songs,
        playSong
      }
    })

    // 组件卸载时，移除全局实例
    onUnmounted(() => {
      delete window.musicPlayerInstance
    })

    return { 
      songs, 
      player, 
      playSong, 
      addSongs, 
      addSongsByEmotion, 
      clearPlaylist,
      // playPrevious,
      // playNext,
      currentEmotion,
      isLoading,
      currentIndex
    }
  }
}
</script>

<style scoped>
/* 音频通知样式 */
.audio-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 播放器控制按钮样式 */
.player-controls {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

/* 正在播放的歌曲信息样式 */
.now-playing {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 12px 15px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.now-playing-label {
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.now-playing-title {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
}

.now-playing-artist {
  font-size: 14px;
  color: #6c757d;
}
</style>
