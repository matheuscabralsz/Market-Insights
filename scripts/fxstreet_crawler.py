"""
FXStreet News Crawler
Fetches articles from FXStreet RSS feed and outputs them as JSON
"""

import asyncio
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path

import feedparser
from crawl4ai import AsyncWebCrawler
from bs4 import BeautifulSoup
import html2text


async def crawl_fxstreet_news(max_articles=10):
    """Crawl FXStreet news from RSS feed and return articles as list"""

    print("=" * 60, file=sys.stderr)
    print("FXStreet News Crawler (via RSS)", file=sys.stderr)
    print("=" * 60, file=sys.stderr)

    articles = []  # Store scraped articles

    # Step 1: Fetch and parse RSS feed
    print("\n[1/3] Fetching RSS feed...", file=sys.stderr)
    rss_url = "https://www.fxstreet.com/rss/news"

    try:
        feed = feedparser.parse(rss_url)
        print(f"✓ RSS feed loaded successfully", file=sys.stderr)
        print(f"  Feed title: {feed.feed.get('title', 'Unknown')}", file=sys.stderr)
    except Exception as e:
        print(f"✗ Error loading RSS feed: {e}", file=sys.stderr)
        return articles

    # Step 2: Extract article URLs from feed
    print(f"\n[2/3] Extracting articles from feed...", file=sys.stderr)

    if not feed.entries:
        print("✗ No articles found in RSS feed", file=sys.stderr)
        return articles

    print(f"✓ Found {len(feed.entries)} articles in feed", file=sys.stderr)

    # Limit to max_articles
    articles_to_scrape = feed.entries[:max_articles]
    print(f"  Will scrape {len(articles_to_scrape)} articles", file=sys.stderr)

    # Step 3: Scrape each article
    print(f"\n[3/3] Scraping articles...", file=sys.stderr)

    # Initialize crawler (verbose=False to prevent stdout pollution)
    async with AsyncWebCrawler(headless=True, verbose=False) as crawler:
        for i, entry in enumerate(articles_to_scrape, 1):
            url = entry.get('link', '')
            title = entry.get('title', 'Untitled')

            if not url:
                print(f"  [{i}/{len(articles_to_scrape)}] ✗ No URL for: {title}", file=sys.stderr)
                continue

            print(f"  [{i}/{len(articles_to_scrape)}] {title[:50]}...", file=sys.stderr)

            try:
                article_data = await scrape_article(crawler, url, title, entry)
                if article_data:
                    articles.append(article_data)
                    print(f"    ✓ Scraped", file=sys.stderr)
                # Polite delay between requests to avoid rate limits
                if i < len(articles_to_scrape):  # Don't wait after last article
                    print(f"    ⏱ Waiting 10 seconds before next article...", file=sys.stderr)
                    await asyncio.sleep(10)
            except Exception as e:
                print(f"    ✗ Error: {e}", file=sys.stderr)
                # Still wait on error to avoid hammering the server
                if i < len(articles_to_scrape):
                    await asyncio.sleep(10)

    print("\n" + "=" * 60, file=sys.stderr)
    print(f"✓ Crawling complete! Scraped {len(articles)} articles", file=sys.stderr)
    print("=" * 60, file=sys.stderr)

    return articles


async def scrape_article(crawler, url, rss_title=None, rss_entry=None):
    """Scrape individual article and return as dictionary"""

    # Extract GUID from RSS entry (unique identifier)
    guid = None
    if rss_entry:
        # Try both 'id' and 'guid' fields from feedparser
        guid = rss_entry.get('id') or rss_entry.get('guid')

    # Fetch article page
    result = await crawler.arun(
        url=url,
        delay_before_return_html=2000,  # Wait for content to load
    )

    soup = BeautifulSoup(result.html, 'html.parser')

    # Extract article content - adjust selectors based on FXStreet structure
    # Try multiple selectors for title
    title = rss_title  # Use RSS title as fallback
    for selector in ['h1', 'h1.fxs_headline', '.article-title', 'h1[class*="title"]']:
        title_elem = soup.select_one(selector)
        if title_elem:
            title = title_elem.get_text().strip()
            break

    if not title:
        title = "Untitled Article"

    # Try multiple selectors for article body
    article_body = None
    for selector in [
        'article',
        '.article-content',
        '.fxs_article_content',
        'div[class*="article"]',
        'main'
    ]:
        article_body = soup.select_one(selector)
        if article_body:
            break

    # Extract metadata from page or RSS
    author = None
    author_elem = soup.select_one('.fxs_article_author, .author, [class*="author"]')
    if author_elem:
        author = author_elem.get_text().strip()
    elif rss_entry and 'author' in rss_entry:
        author = rss_entry.get('author', '')

    publish_date = None
    date_elem = soup.select_one('time, .date, [class*="date"], [datetime]')
    if date_elem:
        publish_date = date_elem.get('datetime') or date_elem.get_text().strip()
    elif rss_entry and 'published' in rss_entry:
        publish_date = rss_entry.get('published', '')

    # Get summary from RSS if available
    summary = None
    if rss_entry and 'summary' in rss_entry:
        summary_html = rss_entry.get('summary', '')
        # Clean HTML from summary
        summary = BeautifulSoup(summary_html, 'html.parser').get_text().strip()

    # Convert to markdown
    h = html2text.HTML2Text()
    h.ignore_links = False
    h.body_width = 0  # No line wrapping

    # Build markdown content
    content = f"# {title}\n\n"

    if author:
        content += f"**Author:** {author}\n\n"

    if publish_date:
        content += f"**Published:** {publish_date}\n\n"

    content += f"**Source:** {url}\n\n"

    if summary:
        content += f"**Summary:** {summary}\n\n"

    content += "---\n\n"

    if article_body:
        # Convert article body to markdown
        content += h.handle(str(article_body))
    else:
        content += "*Article content could not be extracted*\n\n"
        # As fallback, try to get main text
        paragraphs = soup.find_all('p')
        if paragraphs:
            content += "\n\n".join([p.get_text().strip() for p in paragraphs[:10]])

    # Return article data as dictionary
    return {
        "guid": guid,  # RSS feed GUID - unique identifier
        "title": title,
        "summary": summary,
        "content": content,
        "url": url,
        "author": author,
        "publishedAt": publish_date,  # Will be parsed on backend
    }


async def main():
    """Main entry point - outputs JSON to stdout"""

    # Check if user provided a limit argument
    max_articles = 10  # Default
    if len(sys.argv) > 1:
        try:
            max_articles = int(sys.argv[1])
        except ValueError:
            print(f"Invalid argument: {sys.argv[1]}. Using default: 10", file=sys.stderr)

    articles = await crawl_fxstreet_news(max_articles=max_articles)

    # Output JSON to stdout (Node.js will capture this)
    print(json.dumps(articles, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
