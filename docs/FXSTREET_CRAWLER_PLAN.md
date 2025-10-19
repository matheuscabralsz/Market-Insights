# FXStreet News Crawler - Simple Implementation Plan

## Goal
Scrape articles from https://www.fxstreet.com/news and save them as markdown files in `/articles` folder.

## Target Structure
- **Main wrapper**: `ais-hits` (contains all articles)
- **Article items**: `ais-hits--item` (individual clickable articles)

---

## Implementation Steps

### Step 1: Setup Python Environment
```bash
# Create backend directory
mkdir -p backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install crawl4ai beautifulsoup4 html2text
```

### Step 2: Create Basic Crawler Script
**File**: `backend/fxstreet_crawler.py`

```python
import asyncio
from crawl4ai import AsyncWebCrawler
from bs4 import BeautifulSoup
import html2text
import os
from datetime import datetime

async def main():
    # 1. Crawl the news page
    # 2. Find all ais-hits--item elements
    # 3. Extract article links
    # 4. Visit each article
    # 5. Extract content
    # 6. Save as markdown
```

### Step 3: Implementation Logic

**Workflow**:
1. **Fetch listing page** → Get all article URLs from `ais-hits--item` divs
2. **Loop through articles** → Visit each article URL
3. **Extract article content** → Parse HTML and get article body
4. **Convert to Markdown** → Use html2text library
5. **Save to file** → Create `/articles/{timestamp}_{title}.md`

---

## Project Structure
```
tradingapp/
├── backend/
│   ├── venv/              # Python virtual environment
│   ├── fxstreet_crawler.py
│   └── requirements.txt
├── articles/              # Output folder for markdown files
│   ├── 2025-10-19_article-title-1.md
│   └── 2025-10-19_article-title-2.md
├── frontend/
└── docs/
```

---

## Simple Script Outline

```python
# backend/fxstreet_crawler.py

import asyncio
from crawl4ai import AsyncWebCrawler
from bs4 import BeautifulSoup
import html2text
import os
from datetime import datetime

async def crawl_fxstreet_news():
    """Crawl FXStreet news and save articles as markdown"""

    # Initialize crawler
    async with AsyncWebCrawler(headless=True) as crawler:

        # Step 1: Fetch the news listing page
        print("Fetching news page...")
        result = await crawler.arun(
            url="https://www.fxstreet.com/news",
            wait_for="css:.ais-hits"  # Wait for articles to load
        )

        # Step 2: Parse HTML and find all articles
        soup = BeautifulSoup(result.html, 'html.parser')
        article_items = soup.select('.ais-hits--item')
        print(f"Found {len(article_items)} articles")

        # Step 3: Extract article URLs
        article_urls = []
        for item in article_items:
            link = item.find('a', href=True)
            if link:
                article_urls.append(link['href'])

        # Step 4: Visit each article and extract content
        for url in article_urls:
            await scrape_article(crawler, url)

async def scrape_article(crawler, url):
    """Scrape individual article and save as markdown"""

    print(f"Scraping: {url}")

    # Fetch article page
    result = await crawler.arun(url=url)
    soup = BeautifulSoup(result.html, 'html.parser')

    # Extract article content (adjust selectors as needed)
    title = soup.find('h1')
    article_body = soup.find('article') or soup.find('div', class_='article-content')

    # Convert to markdown
    h = html2text.HTML2Text()
    h.ignore_links = False

    content = f"# {title.get_text() if title else 'Untitled'}\n\n"
    content += f"Source: {url}\n\n"
    content += h.handle(str(article_body)) if article_body else "No content found"

    # Save to file
    save_article(title.get_text() if title else "untitled", content)

def save_article(title, content):
    """Save article as markdown file"""

    # Create articles directory
    os.makedirs('../articles', exist_ok=True)

    # Generate filename
    timestamp = datetime.now().strftime('%Y-%m-%d_%H%M%S')
    safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).strip()
    safe_title = safe_title.replace(' ', '-')[:50]  # Limit length
    filename = f"../articles/{timestamp}_{safe_title}.md"

    # Write to file
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Saved: {filename}")

if __name__ == "__main__":
    asyncio.run(crawl_fxstreet_news())
```

---

## Running the Crawler

```bash
# Navigate to backend
cd backend

# Activate virtual environment
source venv/bin/activate  # Windows: venv\Scripts\activate

# Run the crawler
python fxstreet_crawler.py
```

---

## Expected Output

```
articles/
├── 2025-10-19_120530_EUR-USD-rises-ahead-of-ECB-decision.md
├── 2025-10-19_120545_Gold-reaches-new-highs-amid-uncertainty.md
└── 2025-10-19_120601_Bitcoin-breaks-50k-resistance.md
```

Each file contains:
- Article title as H1
- Source URL
- Full article content in markdown format

---

## Next Steps

1. Set up Python environment
2. Create the crawler script
3. Test with a few articles
4. Refine selectors based on actual HTML structure
5. Add error handling for robustness

---

## Notes

- Adjust CSS selectors after inspecting actual HTML
- Add delays between requests to be polite (1-2 seconds)
- Handle cases where articles might be missing content
- Consider limiting to first 5-10 articles for initial testing
