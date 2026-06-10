# Publishing to GitHub Pages

This site is ready to publish with GitHub Pages.

## Recommended GitHub setup

Create a public GitHub repository named:

`coytampa.com`

Upload everything in this folder to the repository root:

- `index.html`
- `styles.css`
- `script.js`
- `config.js`
- `CNAME`
- `.nojekyll`
- `assets/`
- `README.md`

Then in GitHub:

1. Open the repository.
2. Go to Settings.
3. Go to Pages.
4. Under "Build and deployment", choose "Deploy from a branch".
5. Select the `main` branch and `/root`.
6. Save.
7. Under "Custom domain", use `coytampa.com`.
8. Turn on "Enforce HTTPS" once GitHub allows it.

## Squarespace DNS

In Squarespace DNS settings for `coytampa.com`, add these records.

For the root domain:

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

For `www.coytampa.com`:

| Type | Host | Value |
| --- | --- | --- |
| CNAME | www | YOUR-GITHUB-USERNAME.github.io |

Replace `YOUR-GITHUB-USERNAME` with the GitHub account that owns the repository.

DNS changes can take up to 24 hours.

Publish trigger: 2026-06-10 permissions fix.
