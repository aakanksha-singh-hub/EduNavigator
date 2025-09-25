import mammoth from "mammoth";

// Dynamic import for pdf-parse to avoid ES module issues
let pdfParse;

async function loadPdfParse() {
  if (!pdfParse) {
    try {
      const { createRequire } = await import("module");
      const require = createRequire(import.meta.url);
      pdfParse = require("pdf-parse");
    } catch (error) {
      console.error("Error loading pdf-parse:", error);
      throw new Error("PDF parsing library not available");
    }
  }
  return pdfParse;
}

export async function extractTextFromFile(file) {
  const { buffer, mimetype, originalname } = file;

  try {
    switch (mimetype) {
      case "application/pdf":
        return await extractFromPDF(buffer);

      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return await extractFromDOCX(buffer);

      case "text/plain":
        return buffer.toString("utf-8");

      default:
        throw new Error(
          `Unsupported file type: ${mimetype}. Please use PDF, DOCX, or TXT files.`
        );
    }
  } catch (error) {
    console.error(`Error extracting text from ${originalname}:`, error);
    throw new Error(
      `Failed to extract text from ${originalname}: ${error.message}`
    );
  }
}

async function extractFromPDF(buffer) {
  try {
    const pdfParseModule = await loadPdfParse();
    const data = await pdfParseModule(buffer, {
      // Options to improve text extraction quality
      normalizeWhitespace: true,
      disableCombineTextItems: false,
    });

    if (!data.text || data.text.trim().length === 0) {
      throw new Error(
        "PDF appears to be empty or contains no extractable text"
      );
    }

    return data.text;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
}

async function extractFromDOCX(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new Error(`DOCX parsing failed: ${error.message}`);
  }
}
