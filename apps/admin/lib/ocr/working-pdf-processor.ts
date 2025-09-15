// Working PDF Processor - Stable Fallback
// Uses pdf2json instead of corrupted pdf-parse

import fs from 'fs';
import pdf2json from 'pdf2json';

export interface PDFQuestion {
  questionNumber: number;
  questionText: string;
  options: { [key: string]: string };
  subject?: 'Physics' | 'Chemistry' | 'Biology';
  pageNumber: number;
}

export interface PDFProcessingResult {
  questions: PDFQuestion[];
  totalPages: number;
  extractedText: string;
  processingTime: number;
}

export async function processWorkingPDF(filePath: string): Promise<PDFProcessingResult> {
  console.log('🔧 Starting Working PDF Processor...');
  const startTime = Date.now();
  
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      reject(new Error(`PDF file not found: ${filePath}`));
      return;
    }

    const pdfParser = new (pdf2json as any)();
    
    pdfParser.on('pdfParser_dataError', (error: any) => {
      console.error('❌ PDF parsing error:', error);
      reject(error);
    });

    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
      try {
        console.log('📄 PDF loaded successfully, extracting text...');
        
        // Extract text from all pages
        let combinedText = '';
        const pageTexts: string[] = [];
        
        pdfData.formImage?.Pages?.forEach((page: any, index: number) => {
          const pageText = extractPageText(page);
          pageTexts.push(pageText);
          combinedText += pageText + '\n\n';
        });
        
        console.log(`📝 Extracted ${combinedText.length} characters from ${pageTexts.length} pages`);
        
        // Parse questions using flexible NEET patterns
        const questions = parseNEETQuestions(pageTexts, combinedText);
        
        const result: PDFProcessingResult = {
          questions,
          totalPages: pageTexts.length,
          extractedText: combinedText,
          processingTime: Date.now() - startTime
        };
        
        console.log(`✅ Working PDF Processor completed: ${questions.length} questions found`);
        resolve(result);
        
      } catch (error) {
        console.error('❌ Text extraction failed:', error);
        reject(error);
      }
    });

    console.log(`📖 Loading PDF: ${filePath}`);
    pdfParser.loadPDF(filePath);
  });
}

function extractPageText(page: any): string {
  let pageText = '';
  
  page.Texts?.forEach((textObj: any) => {
    if (textObj.R && Array.isArray(textObj.R)) {
      textObj.R.forEach((run: any) => {
        if (run.T) {
          const decodedText = decodeURIComponent(run.T);
          pageText += decodedText + ' ';
        }
      });
    }
  });
  
  return pageText.trim();
}

function parseNEETQuestions(pageTexts: string[], combinedText: string): PDFQuestion[] {
  console.log('🔍 Parsing NEET questions with flexible patterns...');
  const questions: PDFQuestion[] = [];
  
  // Multiple question extraction patterns for robustness
  const questionPatterns = [
    // Standard numbered questions
    /(\d+)[\.\)]\s*(.+?)(?=\d+[\.\)]|$)/gs,
    // Q.1, Q.2 format
    /Q[\.\s]*(\d+)[\.\s]*(.+?)(?=Q[\.\s]*\d+|$)/gs,
    // Question 1, Question 2 format
    /Question[\s]*(\d+)[\:\.\s]*(.+?)(?=Question[\s]*\d+|$)/gs
  ];
  
  let questionMap = new Map<number, PDFQuestion>();
  
  // Try each pattern
  for (const pattern of questionPatterns) {
    let match;
    pattern.lastIndex = 0; // Reset regex
    
    while ((match = pattern.exec(combinedText)) !== null) {
      const questionNumber = parseInt(match[1]);
      const questionContent = match[2].trim();
      
      if (questionContent.length < 10 || questionNumber < 1 || questionNumber > 200) {
        continue; // Skip invalid matches
      }
      
      // Skip if we already have this question number with better content
      if (questionMap.has(questionNumber) && 
          questionMap.get(questionNumber)!.questionText.length > questionContent.length) {
        continue;
      }
      
      console.log(`🔧 Processing question ${questionNumber}...`);
      
      // Extract options using multiple patterns
      const options = extractNEETOptions(questionContent);
      
      if (Object.keys(options).length >= 2) {
        const question: PDFQuestion = {
          questionNumber,
          questionText: cleanQuestionText(questionContent),
          options,
          subject: classifySubject(questionContent),
          pageNumber: findPageNumber(questionContent, pageTexts)
        };
        
        questionMap.set(questionNumber, question);
        console.log(`✅ Question ${questionNumber}: ${Object.keys(options).length} options, subject: ${question.subject}`);
      } else {
        console.log(`⚠️ Question ${questionNumber}: Only ${Object.keys(options).length} options found`);
      }
    }
  }
  
  // Convert map to sorted array
  const sortedQuestions = Array.from(questionMap.values())
    .sort((a, b) => a.questionNumber - b.questionNumber);
  
  console.log(`📊 Total questions parsed: ${sortedQuestions.length}`);
  return sortedQuestions;
}

function extractNEETOptions(questionText: string): { [key: string]: string } {
  console.log('🔍 Extracting NEET options...');
  
  // Multiple option extraction patterns for maximum compatibility
  const optionPatterns = [
    // Pattern 1: (1) option text (2) option text
    {
      regex: /\((\d+)\)\s*([^(]+?)(?=\(\d+\)|$)/g,
      getKey: (match: string) => ['A', 'B', 'C', 'D'][parseInt(match) - 1]
    },
    // Pattern 2: (A) option text (B) option text  
    {
      regex: /\(([A-D])\)\s*([^(]+?)(?=\([A-D]\)|$)/g,
      getKey: (match: string) => match
    },
    // Pattern 3: 1. option text 2. option text
    {
      regex: /(\d+)\.\s*([^1-4\n]+?)(?=\d+\.|$)/g,
      getKey: (match: string) => ['A', 'B', 'C', 'D'][parseInt(match) - 1]
    },
    // Pattern 4: A. option text B. option text
    {
      regex: /([A-D])\.\s*([^A-D\n]+?)(?=[A-D]\.|$)/g,
      getKey: (match: string) => match
    },
    // Pattern 5: Spaced format - A option B option
    {
      regex: /\b([A-D])\s+([^A-D]{10,100}?)(?=\s+[A-D]\s|$)/g,
      getKey: (match: string) => match
    }
  ];
  
  for (const pattern of optionPatterns) {
    const options: { [key: string]: string } = {};
    let match;
    
    pattern.regex.lastIndex = 0;
    while ((match = pattern.regex.exec(questionText)) !== null) {
      const key = pattern.getKey(match[1]);
      const value = match[2]?.trim();
      
      if (key && value && value.length > 1 && value.length < 300) {
        options[key] = cleanOptionText(value);
      }
    }
    
    // Return first pattern that finds multiple options
    if (Object.keys(options).length >= 2) {
      console.log(`✅ Found ${Object.keys(options).length} options using pattern`);
      return options;
    }
  }
  
  console.log('❌ No options found with any pattern');
  return {};
}

function cleanQuestionText(text: string): string {
  return text
    .replace(/^\d+[\.\)]\s*/, '') // Remove question number prefix
    .replace(/\s+/g, ' ')         // Normalize whitespace
    .replace(/[\r\n]+/g, ' ')     // Replace line breaks with spaces
    .trim();
}

function cleanOptionText(text: string): string {
  return text
    .replace(/^[A-D\d][\.\)\:]\s*/, '') // Remove option prefix
    .replace(/\s+/g, ' ')               // Normalize whitespace
    .replace(/[\r\n]+/g, ' ')           // Replace line breaks with spaces
    .trim();
}

function classifySubject(text: string): 'Physics' | 'Chemistry' | 'Biology' {
  const lowerText = text.toLowerCase();
  
  // Physics keywords
  const physicsKeywords = [
    'force', 'energy', 'motion', 'velocity', 'acceleration', 'mass', 
    'newton', 'gravity', 'electric', 'magnetic', 'wave', 'frequency', 
    'wavelength', 'momentum', 'power', 'work', 'potential', 'kinetic'
  ];
  
  // Chemistry keywords
  const chemistryKeywords = [
    'molecule', 'atom', 'reaction', 'compound', 'element', 'bond', 
    'acid', 'base', 'ph', 'molar', 'oxidation', 'reduction', 'ion',
    'catalyst', 'solution', 'concentration', 'equilibrium'
  ];
  
  // Biology keywords
  const biologyKeywords = [
    'cell', 'dna', 'gene', 'protein', 'enzyme', 'tissue', 'organ', 
    'species', 'evolution', 'photosynthesis', 'respiration', 'membrane',
    'mitosis', 'meiosis', 'chromosome', 'heredity', 'ecosystem'
  ];
  
  const physicsScore = physicsKeywords.filter(word => lowerText.includes(word)).length;
  const chemistryScore = chemistryKeywords.filter(word => lowerText.includes(word)).length;
  const biologyScore = biologyKeywords.filter(word => lowerText.includes(word)).length;
  
  if (physicsScore >= chemistryScore && physicsScore >= biologyScore) return 'Physics';
  if (chemistryScore >= biologyScore) return 'Chemistry';
  return 'Biology';
}

function findPageNumber(questionContent: string, pageTexts: string[]): number {
  // Find which page contains this question content
  for (let i = 0; i < pageTexts.length; i++) {
    if (pageTexts[i].includes(questionContent.substring(0, 50))) {
      return i + 1;
    }
  }
  return 1; // Default to page 1
}

export default processWorkingPDF;