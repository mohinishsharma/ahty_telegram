import { getConfigValue } from "@/utils/config";
import axios from "axios";

const GOOGLE_BOOKS_API_KEY = getConfigValue("googleBooksApiKey");
const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/";

const googleBooksClient = axios.create({
    baseURL: GOOGLE_BOOKS_API_URL,
    params: {
        key: GOOGLE_BOOKS_API_KEY,
    },
});

/**
 * Get the book details from Google Books
 * @param query Query to search for books
 * @returns Response from Google Books
 */
export async function searchGoogleBooks(query: string): Promise<Volume[]> {
    const response = await googleBooksClient.get("volumes", {
        params: {
            q: query,
            maxResults: 5,
            projection: "full",
        },
    });
    const data = response.data as GoogleBooksResponse;
    if (data.items) {
        return data.items;
    }
    return [];
}

/**
 * Root response structure for the Google Books API volumes endpoint
 */
export interface GoogleBooksResponse {
    kind: string; // Example: "books#volumes"
    totalItems: number; // Total number of matching books
    items?: Volume[]; // Array of book items
  }
  
  /**
   * Individual volume (book) in the response
   */
  export interface Volume {
    kind: string; // Example: "books#volume"
    id: string; // Unique identifier for the book
    etag: string; // ETag for the resource
    selfLink: string; // Link to this volume resource
    volumeInfo: VolumeInfo; // Core details about the volume
    saleInfo?: SaleInfo; // Information about purchasing the book
    accessInfo?: AccessInfo; // Information about access restrictions
    searchInfo?: SearchInfo; // Additional information about search matches
  }
  
  /**
   * Core details about the book
   */
  export interface VolumeInfo {
    title: string; // Book title
    subtitle?: string; // Subtitle of the book
    authors?: string[]; // List of authors
    publisher?: string; // Publisher name
    publishedDate?: string; // Date of publication (YYYY-MM-DD format)
    description?: string; // Book description or synopsis
    industryIdentifiers?: IndustryIdentifier[]; // ISBN and other identifiers
    readingModes?: ReadingModes; // Available reading modes
    pageCount?: number; // Total number of pages
    printType?: string; // Type of print (e.g., "BOOK" or "MAGAZINE")
    categories?: string[]; // Categories or genres
    maturityRating?: string; // Maturity rating (e.g., "NOT_MATURE")
    language?: string; // Language code (e.g., "en")
    previewLink?: string; // URL to preview the book
    infoLink?: string; // URL to more details about the book
    canonicalVolumeLink?: string; // Canonical URL for this volume
    imageLinks?: ImageLinks; // Links to cover images
  }
  
  /**
   * Identifier for a volume, such as ISBN
   */
  export interface IndustryIdentifier {
    type: string; // Identifier type (e.g., "ISBN_10", "ISBN_13")
    identifier: string; // Identifier value
  }
  
  /**
   * Available reading modes
   */
  export interface ReadingModes {
    text: boolean; // Whether text mode is available
    image: boolean; // Whether image mode is available
  }
  
  /**
   * Links to cover images
   */
  export interface ImageLinks {
    smallThumbnail?: string; // URL for a small thumbnail image
    thumbnail?: string; // URL for a larger thumbnail image
  }
  
  /**
   * Sale information about a volume
   */
  export interface SaleInfo {
    country: string; // Country code
    saleability: string; // Sale status (e.g., "FOR_SALE", "NOT_FOR_SALE")
    isEbook: boolean; // Whether the book is an eBook
    listPrice?: Price; // List price information
    retailPrice?: Price; // Retail price information
    buyLink?: string; // URL to purchase the book
    offers?: Offer[]; // List of offers
  }
  
  /**
   * Pricing details
   */
  export interface Price {
    amount: number; // Price amount
    currencyCode: string; // Currency code (e.g., "USD")
  }
  
  /**
   * Special offers for the book
   */
  export interface Offer {
    finskyOfferType: number; // Offer type
    listPrice: Price; // List price
    retailPrice: Price; // Retail price
  }
  
  /**
   * Access information for the volume
   */
  export interface AccessInfo {
    country: string; // Country code
    viewability: string; // Level of access (e.g., "PARTIAL", "ALL_PAGES")
    embeddable: boolean; // Whether the book can be embedded
    publicDomain: boolean; // Whether the book is in the public domain
    textToSpeechPermission: string; // Text-to-speech permission (e.g., "ALLOWED")
    epub?: FormatInfo; // EPUB format availability
    pdf?: FormatInfo; // PDF format availability
    webReaderLink?: string; // URL to web reader
    accessViewStatus: string; // Access status
    quoteSharingAllowed: boolean; // Whether quotes can be shared
  }
  
  /**
   * Format availability details
   */
  export interface FormatInfo {
    isAvailable: boolean; // Whether the format is available
    downloadLink?: string; // URL to download the format
    acsTokenLink?: string; // URL to the ACS token
  }
  
  /**
   * Search information for the volume
   */
  export interface SearchInfo {
    textSnippet?: string; // Snippet of text from the book
  }
  
