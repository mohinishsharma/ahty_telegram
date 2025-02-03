
/**
 * Get base64 string from image blob  
 * @param blob Image blob
 * @returns Base64 string
 */
export async function getBase64FromBlob(blob: Blob): Promise<string> {
    const type = blob.type;
    const buffer = Buffer.from(await blob.arrayBuffer());
    return `data:${type};base64,${buffer.toString("base64")}`;
}