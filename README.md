# Update an existing live site

Extract this ZIP and upload the **contents** of `PLUSSY-GitHub-Ready` into the root of your existing GitHub repository, replacing matching files. Commit the changes and wait for your connected deployment to complete. Include the entire new `dist/assets/gallery/` folder (14 MP4s and 14 preview images). No setting changes are needed.

This release adds the Telegram sticker pack and a 14-clip gallery with 6/6/2 pages, individual previews, and varied ordering. The gallery uses the uploaded originals, so their audio is preserved. `PLUSSY.mp4` is silent in the uploaded source.

# PLUSSY — PulseChain Circus

Ready to upload to GitHub and deploy on Vercel.

## Get it live

1. Extract **PLUSSY-GitHub-Ready.zip** on your computer.
2. Create a GitHub repository (for example `plussy-circus`). Select **Add file → Upload files** and upload the **contents** of the extracted `PLUSSY-GitHub-Ready` folder. Commit the upload.
3. In Vercel, select **Add New → Project**, import that GitHub repository, then click **Deploy**.

**Upload the extracted files and folders, not the ZIP itself.** At the top of your repository you should see `README.md`, `package.json`, `vercel.json`, `scripts/`, and `dist/`. Do not upload the outer `PLUSSY-GitHub-Ready` folder as an extra level.

The included `vercel.json` configures the deployment. If Vercel asks for settings, use:

| Setting | Value |
| --- | --- |
| Framework preset | Other |
| Root directory | Repository root (`./`) |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | Empty; there are no dependencies |
| Environment variables | None |

Vercel will give you a live URL when deployment succeeds. For a custom domain, open the Vercel project's **Settings → Domains**, add the domain you own, and apply the exact DNS records Vercel displays at your registrar. Future commits to the connected production branch will update the site.

Official configuration reference: https://vercel.com/docs/project-configuration/vercel-json

## What is included

- The current PLUSSY landing page and circus styling.
- Fixed navigation and the resized linked PLUSSY logo.
- Hero video with its original audio and a separate sound toggle.
- Reactive Tickle PLUSSY game with free play, timed challenge, four facial expressions, keyboard/touch controls, and locally saved best score.
- Fourteen-clip video gallery with six cards per page, Back/Next controls, individual previews, and all-clip player navigation.
- Telegram sticker-pack section linked directly to PLUSSY369.
- Backstage portraits and downloads, fortune wheel, Telegram link, pump.tires link, and contract-copy button.
- All currently deployed images, videos and local fonts, including font licenses.
- Asset-version script so CSS/JavaScript edits receive fresh URLs during deployment.

This is a static website. It needs no backend, wallet connection, database, API keys, or ChatGPT account. Game best scores stay on the visitor's device; there is no shared leaderboard. Media and game features are included as currently deployed, including the head-and-shoulders game artwork. All 14 gallery MP4s retain the exact uploaded source bytes and original audio. The source PLUSSY.mp4 has no audio track and is labelled as a silent original.

Telegram: https://t.me/PLUSSY369

Token: https://pump.tires/token/0xd4214e846d34442ed1dd3213612336d284164d92

Contract: `0xd4214e846d34442ed1dd3213612336d284164d92`

## Editing

- `dist/index.html`: page sections, copy and links.
- `dist/style.css`, `circus.css`, `typography.css`, `afterdark.css`: styles and navigation.
- `dist/giggle.css`: game styling.
- `dist/app.js`: game, media player and interactions.
- `dist/assets/`: images, MP4s, and fonts.

After editing, run `npm run check` and `npm run build` if Node.js is installed locally. Vercel runs the build automatically. No `npm install` is needed for local checks because the scripts use only Node.js built-ins.

For a local preview with Python installed:

```sh
python -m http.server 8080 --directory dist
```

Then open http://localhost:8080 in your browser.

## Troubleshooting

**404 after deployment:** check that the repository root contains `vercel.json`, that `dist/index.html` exists, and that Output Directory is `dist`.

**Old styling:** redeploy after your commit, then refresh the page. The build updates stylesheet and script version URLs.

**Video audio:** the hero autoplays muted; tap its Sound on button. Gallery videos use their own player controls. The top sound switch controls game effects. All 13 originals that contain audio retain it. The original PLUSSY.mp4 has no audio and is labelled in its card and player. Tap the video controls to play if your browser blocks playback.

**Fonts or media missing:** upload the complete `dist/assets/` folder and preserve filename capitalization.

The export contains no hosting credentials, ChatGPT-specific deployment metadata, or Git history. Upload these files to update your external GitHub/Vercel site.
