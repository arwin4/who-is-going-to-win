import * as cheerio from 'cheerio';

/**
 * @param {string} url - url of the website to be scraped
 * @returns {Promise<cheerio.CheerioAPI> } Loaded document
 */
export default async function loadHtmlForScraping(
  url: string,
): Promise<cheerio.CheerioAPI> {
  const fetchResponse = await fetch(url);
  const parsedResponse = await fetchResponse.text();
  return cheerio.load(parsedResponse);
}
