import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

export interface ScrapedData {
  url: string;
  html: string;
  text: string;
  title: string;
  metaDescription: string;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  images: {
    total: number;
    withoutAlt: number;
    images: Array<{
      src: string;
      alt: string;
    }>;
  };
  links: {
    internal: string[];
    external: string[];
    total: number;
  };
  structuredData: any[];
  performance: {
    loadTime: number;
    pageSize: number;
  };
  statusCode: number;
  error?: string;
}

export class WebsiteScraper {
  private browser: puppeteer.Browser | null = null;

  async initialize() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async scrape(url: string): Promise<ScrapedData> {
    await this.initialize();
    
    const page = await this.browser!.newPage();
    const startTime = Date.now();
    
    try {
      // Set realistic viewport
      await page.setViewport({ width: 1366, height: 768 });
      
      // Track response status
      let statusCode = 200;
      page.on('response', response => {
        if (response.url() === url) {
          statusCode = response.status();
        }
      });

      // Navigate to the page
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Get page content
      const html = await page.content();
      const $ = cheerio.load(html);
      
      // Extract text content
      const text = await page.evaluate(() => {
        // Remove script and style elements
        const scripts = document.querySelectorAll('script, style');
        scripts.forEach(el => el.remove());
        return document.body?.innerText || '';
      });

      // Extract title
      const title = await page.title();
      
      // Extract meta description
      const metaDescription = $('meta[name="description"]').attr('content') || '';
      
      // Extract headings
      const headings = {
        h1: $('h1').map((_, el) => $(el).text().trim()).get(),
        h2: $('h2').map((_, el) => $(el).text().trim()).get(),
        h3: $('h3').map((_, el) => $(el).text().trim()).get(),
      };
      
      // Extract images
      const images = $('img').map((_, el) => ({
        src: $(el).attr('src') || '',
        alt: $(el).attr('alt') || ''
      })).get();
      
      const imagesWithoutAlt = images.filter(img => !img.alt).length;
      
      // Extract links
      const links = await this.extractLinks(page, url);
      
      // Extract structured data
      const structuredData = await this.extractStructuredData(page);
      
      // Calculate page size (approximate)
      const pageSize = new TextEncoder().encode(html).length;
      
      // Calculate load time
      const loadTime = Date.now() - startTime;
      
      await page.close();
      
      return {
        url,
        html,
        text,
        title,
        metaDescription,
        headings,
        images: {
          total: images.length,
          withoutAlt: imagesWithoutAlt,
          images
        },
        links,
        structuredData,
        performance: {
          loadTime,
          pageSize
        },
        statusCode
      };
      
    } catch (error) {
      await page.close();
      throw error;
    }
  }

  private async extractLinks(page: puppeteer.Page, baseUrl: string) {
    const links = await page.evaluate((base) => {
      const allLinks = Array.from(document.querySelectorAll('a[href]'));
      const baseURL = new URL(base);
      
      const internal: string[] = [];
      const external: string[] = [];
      
      allLinks.forEach(link => {
        const href = (link as HTMLAnchorElement).href;
        try {
          const linkURL = new URL(href);
          if (linkURL.hostname === baseURL.hostname) {
            internal.push(href);
          } else {
            external.push(href);
          }
        } catch (e) {
          // Relative links
          internal.push(href);
        }
      });
      
      return { internal, external };
    }, baseUrl);
    
    return {
      internal: [...new Set(links.internal)],
      external: [...new Set(links.external)],
      total: links.internal.length + links.external.length
    };
  }

  private async extractStructuredData(page: puppeteer.Page) {
    return await page.evaluate(() => {
      const scripts = Array.from(
        document.querySelectorAll('script[type="application/ld+json"]')
      );
      
      return scripts.map(script => {
        try {
          return JSON.parse(script.textContent || '{}');
        } catch (e) {
          return null;
        }
      }).filter(Boolean);
    });
  }
}