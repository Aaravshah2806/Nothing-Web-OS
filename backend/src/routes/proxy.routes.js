import express from 'express';

// Avoid certificate errors with corporate proxies/custom root certificates on Windows
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const router = express.Router();

router.get('/', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('Missing "url" query parameter.');
  }

  try {
    let resolvedUrl = targetUrl;
    if (!/^https?:\/\//i.test(resolvedUrl)) {
      resolvedUrl = 'https://' + resolvedUrl;
    }

    const urlObj = new URL(resolvedUrl);

    const upstreamResponse = await fetch(urlObj.href, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Upgrade-Insecure-Requests': '1',
      },
      redirect: 'follow',
    });

    const contentType = upstreamResponse.headers.get('content-type') || 'text/html';

    // Clear frame-busting security headers so modern browsers allow in-page iframe windows
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');
    res.removeHeader('X-Content-Type-Options');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', contentType);

    if (contentType.includes('text/html')) {
      let html = await upstreamResponse.text();

      // Base tag ensures all relative scripts, fonts, and assets load from the real origin
      const baseTag = `<base href="${urlObj.origin}${urlObj.pathname}">`;

      // Helper script intercepts internal navigations and keeps them inside the Nothing Web OS window
      const injectScript = `
        <script>
          (function() {
            // Prevent frame-busting scripts like top.location = self.location
            try {
              window.onbeforeunload = null;
              if (window.top !== window.self) {
                // Neutralize top navigation attempts
                window.top.location = new Proxy(window.top.location, {
                  set(target, prop, val) {
                    if (prop === 'href') {
                      window.location.href = '/api/proxy?url=' + encodeURIComponent(val);
                      return true;
                    }
                    return Reflect.set(target, prop, val);
                  }
                });
              }
            } catch (e) {}

            document.addEventListener('click', function(e) {
              const anchor = e.target.closest('a');
              if (anchor && anchor.href && !anchor.href.startsWith('javascript:') && !anchor.href.startsWith('#')) {
                // If it's a full navigation, route it through proxy
                if (anchor.target !== '_blank') {
                  e.preventDefault();
                  window.location.href = '/api/proxy?url=' + encodeURIComponent(anchor.href);
                }
              }
            }, true);
          })();
        </script>
      `;

      if (html.includes('<head>')) {
        html = html.replace('<head>', `<head>${baseTag}${injectScript}`);
      } else if (html.includes('<HEAD>')) {
        html = html.replace('<HEAD>', `<HEAD>${baseTag}${injectScript}`);
      } else {
        html = `${baseTag}${injectScript}${html}`;
      }

      return res.send(html);
    } else {
      const buffer = await upstreamResponse.arrayBuffer();
      return res.send(Buffer.from(buffer));
    }
  } catch (error) {
    console.error('[PROXY ERROR]:', error.message);
    res.status(500).send(`
      <div style="font-family: monospace; background: #111; color: #fff; padding: 24px; text-align: center;">
        <h2 style="color: #e2201f;">NOTHING WEB OS PROXY NOTICE</h2>
        <p>Failed to establish connection to: <code>${targetUrl}</code></p>
        <p style="color: #888;">Details: ${error.message}</p>
        <button onclick="window.location.reload()" style="background: #e2201f; color: #fff; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
          RETRY CONNECTION
        </button>
      </div>
    `);
  }
});

export default router;
