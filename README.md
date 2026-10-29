# Hope Iyamu — Portfolio

A responsive portfolio for software engineering and applied AI, implemented from the approved Figma design. Includes selected projects, experience, contact links, and case studies for Ready To Help, C-360 PM, and ESA Messaging.

**Live website:** https://hope-iyamu-portfolio.livelytang257.chatgpt.site/ — public, no sign-in required.

**Source:** https://github.com/horpeazy/hope-iyamu-portfolio

The website is plain HTML, CSS, and JavaScript. No build step, package installation, database, API key, or backend is required.

## Motion and interaction

- Staggered typography and portrait entrances, with subtle scroll-linked movement.
- Section reveals, hover-responsive project previews, and a following project cursor on pointer devices.
- Magnetic round buttons and an animated floating navigation drawer.
- Native page transitions in supporting browsers; ordinary navigation elsewhere.
- Keyboard focus stays inside the open menu; Escape closes it. Touch keeps ordinary tap targets, and reduced-motion preferences disable decorative movement. Navigation and content remain available without JavaScript.

## Preview locally

From this folder, run:

```sh
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080. Stop the server with Ctrl+C.

## Edit the site

| File | What to edit |
| --- | --- |
| `dist/index.html` | Introduction, projects, experience, contact details |
| `dist/rth.html` | RTH case study |
| `dist/c360.html` | C-360 PM case study |
| `dist/esa-messaging.html` | ESA Messaging case study |
| `dist/assets/styles.css` | Colors, typography, spacing, responsive layouts |
| `dist/assets/site.js` | Navigation, scroll reveals, pointer interactions, and motion preferences |
| `dist/assets/hope-portrait.jpg` | Profile photograph |
| `dist/assets/loreloot.jpg` | LoreLoot screenshot |
| `dist/assets/expert-listing.jpg` | Expert Listing screenshot |
| `dist/assets/rth-system.svg` | Illustrative system diagram |
| `dist/assets/c360-workflow.svg` | Illustrative proposal workflow |
| `dist/assets/messaging-flow.svg` | Illustrative SMS delivery workflow |

The CSS variables at the top of `styles.css` control the main colors. The system font stack uses Arial/Helvetica as a close, dependency-free match for the design’s Arimo typography. All images are local. Contact links open the visitor’s email application; there is no contact form or email service. Case studies open in the same tab; external project links open in a new tab.

## Deploy

The current public website is hosted on Sites. Pushing to GitHub stores the source; it does not automatically update the Sites deployment.

Choose one hosting option. In every case, publish **the contents of `dist/`**, not the project root.

### Netlify: upload without Git

1. Sign in to Netlify and choose its manual deployment / drag-and-drop option.
2. Drag the `dist` folder into the upload area.
3. Choose a site name or attach a custom domain in the site settings.

For Git-connected deployment, import your repository. Leave the build command empty and set the publish directory to `dist`; the included `netlify.toml` already supplies that directory.

### GitHub Pages: deploy when you push

For this repository, the Pages workflow is currently disabled. A successful deployment revealed that the account-level Pages domain, `oauthv1.me`, does not resolve. Correct that domain's DNS or remove the custom-domain setting from `horpeazy/horpeazy.github.io`, then enable this repository's workflow before using GitHub Pages. The public Sites link above is already working independently of that domain.

1. Create an empty GitHub repository for this portfolio.
2. Push the contents of this project folder to its `main` branch, including `.github/workflows/deploy-pages.yml`.
3. In the repository’s **Settings → Pages**, choose **GitHub Actions** as the source.
4. Open **Actions → Deploy portfolio to GitHub Pages → Run workflow** for the first deployment. Later pushes to `main` deploy automatically.

The workflow publishes `dist/`. Relative URLs support both a root domain and a repository URL such as `https://USERNAME.github.io/REPOSITORY/`. If your default branch has another name, change the workflow’s `branches` value.

### Cloudflare Pages

Create a Pages project and upload `dist` using Direct Upload, or connect the repository. For a Git-connected project, choose no framework, leave the build command empty, and use `dist` as the output directory.

### Any static web host

Upload everything inside `dist/` to the host’s public directory. Keep all HTML pages and `assets/` together. No routing rewrites are required. Test the homepage, case studies, anchor links, and mobile menu after deployment.

## Content and privacy

- The RTH, C-360 PM, and ESA Messaging case studies describe professional team contributions. Their diagrams are illustrative; they contain no live operational or customer data. Private source repositories and internal application URLs are not published.
- The portfolio includes no tracking, cookies, external fonts, or third-party scripts.
- The `.openai/hosting.json` file connects this workspace to its Sites deployment. It contains a project identifier, not a credential, and is not required by other hosts.
- The portrait, project screenshots, personal information, and brand names belong to their respective owners. This project does not grant a license to reuse those assets or imply ownership of proprietary RTH source code.
