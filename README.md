# GA Demo Website

A simple website created to demonstrate Google Analytics integration. This website includes multiple pages and various interactive elements that can be tracked using Google Analytics.

## Features

- Responsive design
- Multiple pages (Home, About, Contact)
- Contact form with Google Analytics event tracking
- Feature cards with click tracking
- Page view tracking
- Mobile-friendly layout

## Setup

1. Clone this repository
2. Replace the Google Analytics tracking ID in all HTML files:
   - Find `G-XXXXXXXXXX` in each HTML file
   - Replace it with your actual Google Analytics 4 tracking ID

## Deploying to GitHub Pages

1. Create a new repository on GitHub
2. Push this code to your repository
3. Go to your repository's Settings
4. Scroll down to the "GitHub Pages" section
5. Select the branch you want to deploy (usually `main` or `master`)
6. Click "Save"

Your website will be available at `https://[your-username].github.io/[repository-name]`

## Google Analytics Events

The following events are tracked:

- Page views
- Contact form submissions
- Feature card clicks

## Local Development

To test the website locally, you can use any local server. For example, using Python:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open `http://localhost:8000` in your browser.

## License

MIT License 