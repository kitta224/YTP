import React, { useState, useEffect } from 'react';

const YOUTUBE_EMBED_URL = 'https://www.youtube.com/embed/';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [videoId, setVideoId] = useState('');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const cachedKey = localStorage.getItem('yt_api_key');
    if (cachedKey) {
      setApiKey(cachedKey);
      setInputKey(cachedKey);
    }
  }, []);

  const handleKeySave = () => {
    localStorage.setItem('yt_api_key', inputKey);
    setApiKey(inputKey);
    setError('');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setResults([]);
    if (!apiKey) {
      setError('APIキーを入力してください');
      return;
    }
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${encodeURIComponent(
          search
        )}&key=${apiKey}`
      );
      const data = await res.json();
      if (data.error) {
        setError('APIエラー: ' + data.error.message);
        return;
      }
      setResults(data.items || []);
    } catch (err) {
      setError('検索に失敗しました');
    }
  };

  return (
    <div className="ytp-app">
      <h1>YouTube プレイヤー</h1>
      <div className="api-key-box">
        <input
          type="password"
          placeholder="YouTube APIキーを入力"
          value={inputKey}
          onChange={e => setInputKey(e.target.value)}
        />
        <button onClick={handleKeySave}>保存</button>
      </div>
      {error && <div className="error">{error}</div>}
      <form className="search-box" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="動画を検索..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit">検索</button>
      </form>
      <div className="results">
        {results.map(item => (
          <div
            key={item.id.videoId}
            className="result-item"
            onClick={() => setVideoId(item.id.videoId)}
          >
            <img src={item.snippet.thumbnails.medium.url} alt={item.snippet.title} />
            <div className="title">{item.snippet.title}</div>
          </div>
        ))}
      </div>
      {videoId && (
        <div className="player">
          <iframe
            title="YouTube Player"
            width="560"
            height="315"
            src={`${YOUTUBE_EMBED_URL}${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
      <footer>
        <small>APIキーはローカルストレージにのみ保存されます。</small>
      </footer>
    </div>
  );
}

export default App;
