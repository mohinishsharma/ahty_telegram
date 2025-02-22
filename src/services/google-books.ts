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
    /**
     * Example: "books#volumes"
     */
    kind: string;
    /**
     * Total number of matching books
     */
    totalItems: number;
    /**
     * Array of book items
     */
    items?: Volume[];
}

/**
 * Individual volume (book) in the response
 */
export interface Volume {
    /**
     * Example: "books#volume"
     */
    kind: string;
    /**
     * Unique identifier for the book
     */
    id: string;
    /**
     * ETag for the resource
     */
    etag: string;
    /**
     * Link to this volume resource
     */
    selfLink: string;
    /**
     * Core details about the volume
     */
    volumeInfo: VolumeInfo;
    /**
     * Information about purchasing the book
     */
    saleInfo?: SaleInfo;
    /**
     * Information about access restrictions
     */
    accessInfo?: AccessInfo;
    /**
     * Additional information about search matches
     */
    searchInfo?: SearchInfo;
}

/**
 * Core details about the book
 */
export interface VolumeInfo {
    /**
     * Book title
     */
    title: string;
    /**
     * Subtitle of the book
     */
    subtitle?: string;
    /**
     * List of authors
     */
    authors?: string[];
    /**
     * Publisher name
     */
    publisher?: string;
    /**
     * Date of publication (YYYY-MM-DD format)
     */
    publishedDate?: string;
    /**
     * Book description or synopsis
     */
    description?: string;
    /**
     * ISBN and other identifiers
     */
    industryIdentifiers?: IndustryIdentifier[];
    /**
     * Available reading modes
     */
    readingModes?: ReadingModes;
    /**
     * Total number of pages
     */
    pageCount?: number;
    /**
     * Type of print (e.g., "BOOK" or "MAGAZINE")
     */
    printType?: string;
    /**
     * Categories or genres
     */
    categories?: string[];
    /**
     * Maturity rating (e.g., "NOT_MATURE")
     */
    maturityRating?: string;
    /**
     * Language code (e.g., "en")
     */
    language?: string;
    /**
     * URL to preview the book
     */
    previewLink?: string;
    /**
     * URL to more details about the book
     */
    infoLink?: string;
    /**
     * Canonical URL for this volume
     */
    canonicalVolumeLink?: string;
    /**
     * Links to cover images
     */
    imageLinks?: ImageLinks;
}

/**
 * Identifier for a volume, such as ISBN
 */
export interface IndustryIdentifier {
    /**
     * Identifier type (e.g., "ISBN_10", "ISBN_13")
     */
    type: string;
    /**
     * Identifier value
     */
    identifier: string;
}

/**
 * Available reading modes
 */
export interface ReadingModes {
    /**
     * Whether text mode is available
     */
    text: boolean;
    /**
     * Whether image mode is available
     */
    image: boolean;
}

/**
 * Links to cover images
 */
export interface ImageLinks {
    /**
     * URL for a small thumbnail image
     */
    smallThumbnail?: string;
    /**
     * URL for a larger thumbnail image
     */
    thumbnail?: string;
}

/**
 * Sale information about a volume
 */
export interface SaleInfo {
    /**
     * Country code
     */
    country: string;
    /**
     * Sale status (e.g., "FOR_SALE", "NOT_FOR_SALE")
     */
    saleability: string;
    /**
     * Whether the book is an eBook
     */
    isEbook: boolean;
    /**
     * List price information
     */
    listPrice?: Price;
    /**
     * Retail price information
     */
    retailPrice?: Price;
    /**
     * URL to purchase the book
     */
    buyLink?: string;
    /**
     * List of offers
     */
    offers?: Offer[];
}

/**
 * Pricing details
 */
export interface Price {
    /**
     * Price amount
     */
    amount: number;
    /**
     * Currency code (e.g., "USD")
     */
    currencyCode: string;
}

/**
 * Special offers for the book
 */
export interface Offer {
    /**
     * Offer type
     */
    finskyOfferType: number;
    /**
     * List price
     */
    listPrice: Price;
    /**
     * Retail price
     */
    retailPrice: Price;
}

/**
 * Access information for the volume
 */
export interface AccessInfo {
    /**
     * Country code
     */
    country: string;
    /**
     * Level of access (e.g., "PARTIAL", "ALL_PAGES")
     */
    viewability: string;
    /**
     * Whether the book can be embedded
     */
    embeddable: boolean;
    /**
     * Whether the book is in the public domain
     */
    publicDomain: boolean;
    /**
     * Text-to-speech permission (e.g., "ALLOWED")
     */
    textToSpeechPermission: string;
    /**
     * EPUB format availability
     */
    epub?: FormatInfo;
    /**
     * PDF format availability
     */
    pdf?: FormatInfo;
    /**
     * URL to web reader
     */
    webReaderLink?: string;
    /**
     * Access status
     */
    accessViewStatus: string;
    /**
     * Whether quotes can be shared
     */
    quoteSharingAllowed: boolean;
}

/**
 * Format availability details
 */
export interface FormatInfo {
    /**
     * Whether the format is available
     */
    isAvailable: boolean;
    /**
     * URL to download the format
     */
    downloadLink?: string;
    /**
     * URL to the ACS token
     */
    acsTokenLink?: string;
}

/**
 * Search information for the volume
 */
export interface SearchInfo {
    /**
     * Snippet of text from the book
     */
    textSnippet?: string;
}

