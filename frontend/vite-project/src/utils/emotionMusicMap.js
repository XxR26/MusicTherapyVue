/**
 * 情绪与本地音乐文件的映射关系
 * 每个情绪对应一个歌曲列表
 */
export const EMOTION_MUSIC_MAP = {
  "happy": [
    { title: "Baby Blue", artist: "Surfaces", url: "/music/happy/Surfaces - Baby Blue (Official Lyric Video).mp3" },
    { title: "Don't Stop Me Now", artist: "Queen", url: "/music/happy/Queen - Don't Stop Me Now (Official Video).mp3" },
    { title: "Walking on Sunshine", artist: "Katrina and The Waves", url: "/music/happy/Katrina And The Waves - Walking On Sunshine (Lyrics).mp3" }
  ],
  "sad": [
    { title: "Someone Like You", artist: "Adele", url: "/music/sad/Adele - Someone Like You (Official Music Video).mp3" },
    { title: "Hurt", artist: "Johnny Cash", url: "/music/sad/Johnny Cash - Hurt.mp3" },
    { title: "The Night We Met", artist: "Lord Huron", url: "/music/sad/Lord Huron - The Night We Met (Official Audio).mp3" }
  ],
  "calm": [
    { title: "Emotion", artist: "Beautiful Sad Piano Song Instrumental", url: "/music/calm/Emotions - Beautiful Sad Piano Song Instrumental.mp3" },
    { title: "Lullaby of my soul", artist: "Enzalla", url: "/music/calm/Lullaby of my soul - Enzalla.mp3" },
    { title: "Move in our midst", artist: "Simon Wester", url: "/music/calm/Move in our Midst -- Piano Instrumental -- Songs of Light, Love, and Hope.mp3" }
  ],
  "anxious": [
    { title: "Breathe", artist: "Pink Floyd", url: "/music/anxious/Pink Floyd - Breathe.mp3" },
    { title: "Weightless", artist: "Marconi Union", url: "/music/anxious/Marconi Union - Weightless (Official Video).mp3" },
    { title: "Meditation Music", artist: "Theta Waves", url: "/music/anxious/meditation-music.mp3" }
  ],
  "angry": [
    { title: "Killing in the Name", artist: "Rage Against the Machine", url: "/music/angry/Rage Against The Machine  -  Killing In The Name  -  1993.mp3" },
    { title: "Enter Sandman", artist: "Metallica", url: "/music/angry/Metallica_ Enter Sandman (Official Music Video).mp3" },
    { title: "Break Stuff", artist: "Limp Bizkit", url: "/music/angry/Limp Bizkit - Break Stuff.mp3" }
  ]
};

/**
 * 根据情绪关键词获取对应的音乐列表
 * @param {string} emotion - 情绪关键词
 * @returns {Array} - 对应的音乐列表
 */
export function getMusicByEmotion(emotion) {
  // 将情绪关键词转为小写以匹配映射
  const emotionKey = emotion.toLowerCase().trim();

  // 如果找到匹配的情绪，返回对应的音乐列表
  if (EMOTION_MUSIC_MAP[emotionKey]) {
    return EMOTION_MUSIC_MAP[emotionKey];
  }

  // 如果没有找到匹配的情绪，返回默认音乐列表（可以是calm或happy）
  console.warn(`No music found for emotion: ${emotionKey}. Returning default music.`);
  return EMOTION_MUSIC_MAP.calm; // 默认返回平静的音乐
}

/**
 * 根据情绪添加音乐到全局播放列表
 * 这个函数需要与MusicPlayer组件配合使用
 * @param {string} emotion - 情绪关键词
 * @returns {Array} - 添加到播放列表的音乐
 */
export function addMusicByEmotion(emotion) {
  // 获取匹配的音乐
  const matchedSongs = getMusicByEmotion(emotion);

  console.log(`Attempting to add ${emotion} music to playlist. Found ${matchedSongs.length} songs.`);

  // 如果有MusicPlayer组件实例，调用其addSongs方法
  if (window.musicPlayerInstance) {
    try {
      window.musicPlayerInstance.addSongs(matchedSongs);

      // 如果有歌曲，尝试播放第一首
      if (matchedSongs.length > 0) {
        console.log(`Playing first song: ${matchedSongs[0].title}`);
        window.musicPlayerInstance.playSong(matchedSongs[0]);
      }
    } catch (error) {
      console.error('Error adding music to playlist:', error);
    }
  } else {
    console.warn('MusicPlayer instance not found. Make sure the MusicPlayer component is mounted.');
  }

  return matchedSongs;
}

/**
 * 获取所有可用的情绪关键词
 * @returns {Array} - 情绪关键词列表
 */
export function getAvailableEmotions() {
  return Object.keys(EMOTION_MUSIC_MAP);
}
