import { WebApp } from 'meteor/webapp';
import { Sounds } from '/imports/api/sounds';
import { Meteor } from 'meteor/meteor';

export const setupOgPreview = () => {
  WebApp.connectHandlers.use('/sound/', async (req, res, next) => {
    const userAgent = req.headers['user-agent'];
    const isCrawler = userAgent && (/facebookexternalhit|twitterbot|pinterest(bot)?|slackbot|discordbot|linkedinbot|googlebot|bingbot|yandexbot|duckduckbot|baiduspider|sogouspider|whatsapp|viber|curl/i.test(userAgent));

    const soundId = req.url.split('/')[1];

    // console.log(`OG Preview Request: soundId=${soundId}, isCrawler=${isCrawler} (${userAgent})`);

    if (soundId && isCrawler) {
      const sound = await Sounds.findOneAsync(soundId);

      if (sound) {
        const title = sound.title || 'Sounds Social';
        const description = sound.description || 'Listen to this sound on Sounds Social';
        const imageUrl = sound.coverImage || '';
        const pageUrl = Meteor.absoluteUrl(`sound/${soundId}`).replace('soundssocial.eu.meteorapp.com', 'soundssocial.io');

        const html = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <meta property="og:title" content="${title}" />
            <meta property="og:description" content="${description}" />
            <meta property="og:image" content="${imageUrl}" />
            <meta property="og:url" content="${pageUrl}" />
            <meta property="og:type" content="music.song" />
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:title" content="${title}">
            <meta name="twitter:description" content="${description}">
            <meta name="twitter:image" content="${imageUrl}">
            <script>
              // Redirect to the client-side application for regular users
              window.location.replace('${pageUrl}');
            </script>
          </head>
          <body>
            <h1>${title}</h1>
            <p>${description}</p>
            ${imageUrl ? `<img src="${imageUrl}" alt="${title}" />` : ''}
          </body>
          </html>
        `;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
      }
    }
    next(); // Continue to next handler (Meteor's default client-side rendering)
  });
};
