import axios from "axios";
import * as cheerio from "cheerio";

const LIBGEN_API_URL = "http://libgen.is/";

const libgenClient = axios.create({
    baseURL: LIBGEN_API_URL,
});

const BOOK_DOWNLOAD_URL = "https://books.ms/main/";

const bookDownloadClient = axios.create({
    baseURL: BOOK_DOWNLOAD_URL,
});

function convertToBookData(data: unknown): BookData {
    const bookData = data as Record<string, unknown>;
    return {
        title: bookData.title as string,
        author: bookData.author as string,
        year: bookData.year as string,
        pages: bookData.pages as string,
        language: bookData.language as string,
        size: bookData.filesize as string,
        extension: bookData.extension as string,
        description: bookData.descr as string,
        md5: bookData.md5 as string,
    }
}

export async function getBookInfo(ids: string[]): Promise<BookData[]> {
    const response = await libgenClient.get(`json.php?ids=${ids}&fields=*`);
    const data = (response.data as unknown[]).map(convertToBookData);
    if (data) {
        return data;       
    }
    return [];
}

/**
 * Search for books in Libgen
 * @param query Query to search for books
 * @returns Response from Libgen
 */
export async function searchLibgenBooks(query: string): Promise<BookData[]> {
    const response = await libgenClient.get(`search.php?req=${encodeURIComponent(query)}&column=title&sort=year&sortmode=DESC`);
    const data = response.data as string;
    // start process page here
    const page = cheerio.load(data);
    const rows = page('body > table.c > tbody > tr').slice(1,6);
    const ikbd: string[] = [];
    rows.toArray().forEach((rn) => {
        const node = cheerio.load(rn);
        const dataCells = node('td');
        const id = dataCells.eq(0).text();
        ikbd.push(id);
    });

    if (ikbd.length === 0) {
        return [];
    }

    const bookData = await getBookInfo(ikbd);
    return bookData;
}


export interface BookDownload {
    url: string;
    md5: string;
    title: string;
    author: string;
    publisher: string;
}

export async function downloadBook(md5: string): Promise<BookDownload | null> {
    const response = await bookDownloadClient.get(md5.toUpperCase());
    const page = cheerio.load(response.data);
    const downloadLink = page('#download > h2 > a').attr('href');
    const title = page('#info > h1').text();
    const author = page('#info > p:nth-child(4)').text();
    const publisher = page('#info > p:nth-child(5)').text();
    if (downloadLink) {
        return {
            url: downloadLink,
            md5: md5,
            title: title,
            author: author,
            publisher: publisher,
        };
    }
    return null;
}

export interface BookData {
    title: string;
    author: string;
    year: string;
    pages: string;
    language: string;
    size: string;
    extension: string;
    description: string;
    md5: string;
}
