// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const classnames = require('classnames');
const { MainNavBars } = require('stremio/components');
const styles = require('./styles');

const LiveTv = () => {
    const [m3uUrl, setM3uUrl] = React.useState(localStorage.getItem('livetv_m3u') || '');
    const [channels, setChannels] = React.useState({ categories: {}, total: 0 });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        if (m3uUrl && m3uUrl.trim() !== '') {
            loadM3u(m3uUrl);
        }
    }, []);

    const parseM3u = (text) => {
        const lines = text.split('\n');
        const parsed = { categories: {}, total: 0 };
        let currentGroup = 'Uncategorized';
        let currentLogo = '';
        let currentId = '';
        let currentName = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('#EXTINF:')) {
                // Parse properties like tvg-logo="" group-title=""
                const groupMatch = line.match(/group-title="([^"]+)"/);
                const logoMatch = line.match(/tvg-logo="([^"]+)"/);
                const idMatch = line.match(/tvg-id="([^"]+)"/);
                
                currentGroup = groupMatch ? groupMatch[1] : 'Uncategorized';
                currentLogo = logoMatch ? logoMatch[1] : '';
                currentId = idMatch ? idMatch[1] : `channel-${parsed.total}`;
                
                // Get the channel name following the last comma
                const parts = line.split(',');
                currentName = parts.length > 1 ? parts[parts.length - 1].trim() : 'Unknown';
            } else if (line.length > 0 && !line.startsWith('#')) {
                // It's an URL
                if (!parsed.categories[currentGroup]) {
                    parsed.categories[currentGroup] = [];
                }
                parsed.categories[currentGroup].push({
                    id: currentId,
                    name: currentName,
                    logo: currentLogo,
                    url: line
                });
                parsed.total++;
            }
        }
        return parsed;
    };

    const loadM3u = async (url) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch M3U file');
            const text = await response.text();
            if (!text.includes('#EXTM3U')) throw new Error('Invalid M3U file');
            
            const parsedData = parseM3u(text);
            setChannels(parsedData);
            localStorage.setItem('livetv_m3u', url);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        loadM3u(m3uUrl);
    };

    const playChannel = (channel) => {
        const stream = {
            url: channel.url,
            title: channel.name,
            behaviorHints: { notWebReady: false }
        };
        const meta = {
            id: channel.id,
            name: channel.name,
            type: 'tv',
            poster: channel.logo || '',
            posterShape: 'landscape'
        };
        const b64Stream = encodeURIComponent(btoa(JSON.stringify(stream)));
        const b64Meta = encodeURIComponent(btoa(JSON.stringify(meta)));
        window.location.hash = `#/player/${b64Stream}/${b64Meta}`;
    };

    return (
        <div className={styles['livetv-container']}>
            <MainNavBars className={styles['board-content-container']} route={'livetv'}>
                <div className={styles['board-content']}>
                    <div className={styles['setup-container']}>
                        <form onSubmit={onSubmit} className={styles['m3u-form']}>
                            <input 
                                className={styles['m3u-input']}
                                type="url" 
                                placeholder="https://example.com/playlist.m3u" 
                                value={m3uUrl} 
                                onChange={(e) => setM3uUrl(e.target.value)}
                            />
                            <button type="submit" className={styles['m3u-button']} disabled={loading}>
                                {loading ? 'Loading...' : 'Load Playlist'}
                            </button>
                        </form>
                        {error && <div className={styles['error-message']}>{error}</div>}
                    </div>

                    {!loading && channels.total > 0 && (
                        <div className={styles['channels-container']}>
                            {Object.entries(channels.categories).map(([category, items]) => (
                                <div key={category} className={styles['category-row']}>
                                    <h2 className={styles['category-title']}>{category}</h2>
                                    <div className={styles['channels-grid']}>
                                        {items.map((channel, i) => (
                                            <div 
                                                key={`${channel.id}-${i}`} 
                                                className={styles['channel-card']}
                                                onClick={() => playChannel(channel)}
                                            >
                                                <div className={styles['channel-logo-container']}>
                                                    {channel.logo ? (
                                                        <img src={channel.logo} alt={channel.name} className={styles['channel-logo']} loading="lazy" />
                                                    ) : (
                                                        <div className={styles['channel-logo-placeholder']}>TV</div>
                                                    )}
                                                </div>
                                                <div className={styles['channel-name']}>{channel.name}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </MainNavBars>
        </div>
    );
};

module.exports = LiveTv;
