// Enhanced NEET OCR Processor - Production Ready
// Comprehensive NEET question extraction with advanced document analysis

import fs from 'fs';
import path from 'path';
import pdf2json from 'pdf2json';
import { createWorker } from 'tesseract.js';
import sharp from 'sharp';
import pdf2pic from 'pdf2pic';

export interface EnhancedNEETOptions {
  useOCR: boolean;
  preprocessImages: boolean;
  confidenceThreshold: number;
  subjects: string[];
  maxPages?: number;
  skipInstructionPages: boolean;
  enableMathFormulaParsing: boolean;
  strictNEETFormat: boolean;
}

export interface NEETQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  options: { [key: string]: string };
  subject: 'Physics' | 'Chemistry' | 'Biology';
  complexity: 'low' | 'medium' | 'high';
  hasMath: boolean;
  hasImage: boolean;
  correctAnswer?: string;
  explanation?: string;
  pageNumber: number;
  confidence: number;
}

export interface ProcessingResult {
  questions: NEETQuestion[];
  metadata: {
    totalPages: number;
    pagesProcessed: number;
    questionsFound: number;
    averageConfidence: number;
    processingTime: number;
    documentAnalysis: DocumentAnalysisResult;
  };
  errors: string[];
  warnings: string[];
}

interface DocumentAnalysisResult {
  isNEETFormat: boolean;
  hasInstructions: boolean;
  hasSolutions: boolean;
  estimatedQuestionCount: number;
  contentQuality: 'excellent' | 'good' | 'fair' | 'poor';
}

export class EnhancedNEETProcessor {
  private worker: any = null;
  private options: EnhancedNEETOptions;
  
  constructor(options: EnhancedNEETOptions) {
    this.options = options;
  }

  async processFile(filePath: string): Promise<ProcessingResult> {
    const startTime = Date.now();
    console.log(`🚀 Starting Enhanced NEET OCR Processing: ${filePath}`);
    
    try {
      // Phase 1: Document Analysis
      console.log('🔍 Phase 1: NEET Document Analysis...');
      const analysis = await this.analyzeNEETDocument(filePath);
      console.log('📊 Document Analysis Result:', analysis);

      if (!analysis.isNEETFormat && this.options.strictNEETFormat) {
        throw new Error('Document does not match NEET format requirements');
      }

      // Phase 2: Smart Text Extraction
      console.log('📄 Phase 2: Smart text extraction...');
      const extractedText = await this.smartTextExtraction(filePath);
      
      // Phase 3: Advanced Question Parsing
      console.log('🔍 Phase 3: Advanced NEET question parsing...');
      const questions = await this.parseNEETQuestions(extractedText, filePath);

      const processingTime = Date.now() - startTime;
      const avgConfidence = questions.length > 0 
        ? questions.reduce((sum, q) => sum + q.confidence, 0) / questions.length 
        : 0;

      return {
        questions,
        metadata: {
          totalPages: extractedText.pageCount || 0,
          pagesProcessed: questions.length > 0 ? extractedText.pageCount || 0 : 0,
          questionsFound: questions.length,
          averageConfidence: avgConfidence,
          processingTime,
          documentAnalysis: analysis,
        },
        errors: [],
        warnings: []
      };

    } catch (error) {
      console.error('❌ Enhanced NEET processing failed:', error);
      return {
        questions: [],
        metadata: {
          totalPages: 0,
          pagesProcessed: 0,
          questionsFound: 0,
          averageConfidence: 0,
          processingTime: Date.now() - startTime,
          documentAnalysis: {
            isNEETFormat: false,
            hasInstructions: false,
            hasSolutions: false,
            estimatedQuestionCount: 0,
            contentQuality: 'poor'
          }
        },
        errors: [error.message],
        warnings: []
      };
    } finally {
      if (this.worker) {
        await this.worker.terminate();
      }
    }
  }

  private async analyzeNEETDocument(filePath: string): Promise<DocumentAnalysisResult> {
    return new Promise((resolve, reject) => {
      const pdfParser = new (pdf2json as any)();
      
      pdfParser.on('pdfParser_dataError', reject);
      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        const text = this.extractTextFromPDFData(pdfData);
        
        // NEET format detection patterns
        const neetIndicators = [
          /NEET.*\d{4}/i,
          /National.*Eligibility.*Entrance.*Test/i,
          /Physics.*Chemistry.*Biology/i,
          /Medical.*Entrance/i
        ];
        
        const isNEETFormat = neetIndicators.some(pattern => pattern.test(text));
        const hasInstructions = /instruction|direction|guide/i.test(text);
        const hasSolutions = /answer.*key|solution|correct.*answer/i.test(text);
        
        // Estimate question count based on question number patterns
        const questionMatches = text.match(/(?:\d+[\.\)]\s)|(?:Q[\.\s]*\d+)/gi) || [];
        const estimatedQuestionCount = Math.max(questionMatches.length * 0.8, 150); // NEET typically has 180
        
        // Content quality assessment
        const wordCount = text.split(/\s+/).length;
        let contentQuality: 'excellent' | 'good' | 'fair' | 'poor';
        if (wordCount > 10000) contentQuality = 'excellent';
        else if (wordCount > 5000) contentQuality = 'good';
        else if (wordCount > 2000) contentQuality = 'fair';
        else contentQuality = 'poor';
        
        resolve({
          isNEETFormat,
          hasInstructions,
          hasSolutions,
          estimatedQuestionCount,
          contentQuality
        });
      });
      
      pdfParser.loadPDF(filePath);
    });
  }

  private async smartTextExtraction(filePath: string): Promise<{ text: string; pageCount: number; pageTexts: string[] }> {
    console.log('📊 Smart text extraction with NEET optimization...');
    
    return new Promise((resolve, reject) => {
      const pdfParser = new (pdf2json as any)();
      
      pdfParser.on('pdfParser_dataError', reject);
      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        const pageTexts: string[] = [];
        let combinedText = '';
        
        console.log(`📄 Processing ${pdfData.formImage?.Pages?.length || 0} pages with smart extraction...`);
        
        pdfData.formImage?.Pages?.forEach((page: any, index: number) => {
          const pageText = this.extractPageText(page);
          
          // Skip instruction pages if enabled
          if (this.options.skipInstructionPages && this.isInstructionPage(pageText, index)) {
            console.log(`⏭️ Skipping instruction page ${index + 1}`);
            pageTexts.push('');
            return;
          }
          
          pageTexts.push(pageText);
          combinedText += pageText + '\n\n';
        });
        
        console.log(`📝 Smart extraction completed: ${combinedText.length} characters`);
        
        resolve({
          text: combinedText,
          pageCount: pdfData.formImage?.Pages?.length || 0,
          pageTexts
        });
      });
      
      pdfParser.loadPDF(filePath);
    });
  }

  private extractTextFromPDFData(pdfData: any): string {
    let text = '';
    pdfData.formImage?.Pages?.forEach((page: any) => {
      text += this.extractPageText(page) + ' ';
    });
    return text;
  }

  private extractPageText(page: any): string {
    let pageText = '';
    page.Texts?.forEach((textObj: any) => {
      const decodedText = decodeURIComponent(textObj.R?.[0]?.T || '');
      pageText += decodedText + ' ';
    });
    return pageText;
  }

  private isInstructionPage(pageText: string, pageIndex: number): boolean {
    // First page is often instructions
    if (pageIndex === 0) return true;
    
    const instructionPatterns = [
      /instruction/i,
      /direction/i,
      /read.*carefully/i,
      /before.*answering/i,
      /marking.*scheme/i,
      /time.*allowed/i
    ];
    
    return instructionPatterns.some(pattern => pattern.test(pageText));
  }

  private async parseNEETQuestions(extractData: { text: string; pageTexts: string[] }, filePath: string): Promise<NEETQuestion[]> {
    const questions: NEETQuestion[] = [];
    console.log(`🔍 Advanced NEET question parsing from ${extractData.text.length} characters...`);
    
    // Process each page separately for better accuracy
    for (let i = 0; i < extractData.pageTexts.length; i++) {
      const pageText = extractData.pageTexts[i];
      if (!pageText || pageText.length < 50) continue;
      
      console.log(`📄 Processing page ${i + 1}...`);
      const pageQuestions = await this.parsePageQuestions(pageText, i + 1);
      questions.push(...pageQuestions);
      
      // Add OCR fallback for pages with few questions found
      if (pageQuestions.length === 0 && this.options.useOCR) {
        console.log(`📝 OCR fallback for page ${i + 1}...`);
        const ocrQuestions = await this.processPageWithOCR(filePath, i + 1);
        questions.push(...ocrQuestions);
      }
      
      // Limit pages if specified
      if (this.options.maxPages && i >= this.options.maxPages - 1) {
        console.log(`📄 Reached max pages limit: ${this.options.maxPages}`);
        break;
      }
    }
    
    // Remove duplicates and validate
    const uniqueQuestions = this.removeDuplicateQuestions(questions);
    console.log(`✅ Advanced parsing complete: ${uniqueQuestions.length} unique questions`);
    
    return uniqueQuestions;
  }

  private async parsePageQuestions(pageText: string, pageNumber: number): Promise<NEETQuestion[]> {
    const questions: NEETQuestion[] = [];
    
    // Enhanced NEET question patterns
    const questionPatterns = [
      /(\d+)[\.\)]\s*(.+?)(?=\d+[\.\)]|$)/gs,
      /Q[\.\s]*(\d+)[\.\s]*(.+?)(?=Q[\.\s]*\d+|$)/gs,
      /Question[\s\-]*(\d+)[\:\.\s]*(.+?)(?=Question[\s\-]*\d+|$)/gs
    ];
    
    for (const pattern of questionPatterns) {
      let match;
      while ((match = pattern.exec(pageText)) !== null) {
        const questionNumber = parseInt(match[1]);
        const questionContent = match[2].trim();
        
        console.log(`🔧 Parsing NEET question ${questionNumber}...`);
        
        if (questionContent.length < 10) continue; // Skip very short matches
        
        // Advanced option extraction
        const options = await this.extractNEETOptions(questionContent);
        
        if (Object.keys(options).length >= 2) { // At least 2 options required
          const question: NEETQuestion = {
            id: `neet_${pageNumber}_${questionNumber}`,
            questionNumber,
            questionText: this.cleanQuestionText(questionContent),
            options,
            subject: this.classifySubject(questionContent),
            complexity: this.assessComplexity(questionContent),
            hasMath: this.containsMath(questionContent),
            hasImage: this.containsImageReference(questionContent),
            pageNumber,
            confidence: this.calculateConfidence(questionContent, options)
          };
          
          console.log(`✅ Question ${questionNumber} parsed: ${question.subject}, complexity: ${question.complexity}`);
          questions.push(question);
        } else {
          console.log(`❌ Question ${questionNumber}: Option extraction failed: ${Object.keys(options).length}/4 options found`);
        }
      }
    }
    
    console.log(`📝 Page ${pageNumber}: ${questions.length} questions found`);
    return questions;
  }

  private async extractNEETOptions(questionText: string): Promise<{ [key: string]: string }> {
    console.log('🔍 Advanced NEET option extraction...');
    
    const optionPatterns = [
      // Standard NEET patterns with numbers
      {
        name: 'NEET-numeric',
        pattern: /\(?\s*([1-4])\s*\)?\s*([^\n\r]+?)(?=\s*\(?\s*[1-4]\s*\)|$)/gs,
        keyMap: (num: string) => ['A', 'B', 'C', 'D'][parseInt(num) - 1]
      },
      // Standard NEET patterns with letters
      {
        name: 'NEET-alpha',
        pattern: /\(?\s*([A-D])\s*\)?\s*([^\n\r]+?)(?=\s*\(?\s*[A-D]\s*\)|$)/gs,
        keyMap: (letter: string) => letter
      },
      // Numbered list format
      {
        name: 'numbered-list',
        pattern: /(?:^|\n)\s*([1-4])[\.\)]\s*([^\n]+)/gm,
        keyMap: (num: string) => ['A', 'B', 'C', 'D'][parseInt(num) - 1]
      },
      // Letter list format  
      {
        name: 'letter-list',
        pattern: /(?:^|\n)\s*([a-d]|[A-D])[\.\)]\s*([^\n]+)/gm,
        keyMap: (letter: string) => letter.toUpperCase()
      },
      // Spaced options format
      {
        name: 'spaced-options',
        pattern: /([A-D])\s*[:\-\.]?\s*([^A-D\n]{5,}?)(?=[A-D]\s*[:\-\.]|$)/gs,
        keyMap: (letter: string) => letter
      }
    ];

    for (const patternConfig of optionPatterns) {
      console.log(`🔍 Trying ${patternConfig.name} pattern...`);
      const options: { [key: string]: string } = {};
      let match;
      
      while ((match = patternConfig.pattern.exec(questionText)) !== null) {
        const key = patternConfig.keyMap(match[1]);
        const value = match[2]?.trim();
        
        if (key && value && value.length > 1 && value.length < 200) {
          options[key] = this.cleanOptionText(value);
        }
      }
      
      if (Object.keys(options).length >= 2) {
        console.log(`✅ Successfully extracted ${Object.keys(options).length} options using ${patternConfig.name}`);
        return options;
      }
      
      // Reset regex for next pattern
      patternConfig.pattern.lastIndex = 0;
    }
    
    return {};
  }

  private async processPageWithOCR(filePath: string, pageNumber: number): Promise<NEETQuestion[]> {
    if (!this.worker) {
      console.log('👁️ Initializing Tesseract worker...');
      this.worker = await createWorker();
      await this.worker.loadLanguage('eng');
      await this.worker.initialize('eng');
    }
    
    try {
      console.log(`📝 OCR Page ${pageNumber}...`);
      
      // Convert PDF page to image
      const convert = pdf2pic.fromPath(filePath, {
        density: 300,
        saveFilename: `page_${pageNumber}`,
        savePath: "/tmp",
        format: "png",
        width: 2480,
        height: 3508
      });
      
      const result = await convert(pageNumber, { responseType: "buffer" });
      
      // Preprocess image if enabled
      let imageBuffer = result.buffer;
      if (this.options.preprocessImages) {
        console.log('🖼️ Preprocessing image for better OCR...');
        imageBuffer = await sharp(result.buffer)
          .greyscale()
          .normalize()
          .sharpen()
          .toBuffer();
      }
      
      // Run OCR
      const { data: { text, confidence } } = await this.worker.recognize(imageBuffer);
      console.log(`📝 OCR Page ${pageNumber}: ${text.length} characters, confidence: ${confidence.toFixed(2)}`);
      
      if (confidence < this.options.confidenceThreshold * 100) {
        console.log(`⚠️ OCR confidence too low: ${confidence.toFixed(2)}%`);
        return [];
      }
      
      // Parse questions from OCR text
      const questions = await this.parsePageQuestions(text, pageNumber);
      
      // Update confidence scores
      questions.forEach(q => {
        q.confidence = Math.min(q.confidence, confidence / 100);
      });
      
      console.log(`📝 OCR Page ${pageNumber}: ${questions.length} questions, confidence: ${(confidence/100).toFixed(2)}`);
      return questions;
      
    } catch (error) {
      console.error(`❌ OCR failed for page ${pageNumber}:`, error);
      return [];
    }
  }

  private cleanQuestionText(text: string): string {
    return text
      .replace(/^\d+[\.\)]\s*/, '') // Remove question number
      .replace(/\s+/g, ' ')         // Normalize whitespace
      .trim();
  }

  private cleanOptionText(text: string): string {
    return text
      .replace(/^[A-D][\.\)\:\-]\s*/, '') // Remove option letter
      .replace(/\s+/g, ' ')               // Normalize whitespace
      .trim();
  }

  private classifySubject(text: string): 'Physics' | 'Chemistry' | 'Biology' {
    const physicsKeywords = ['force', 'energy', 'motion', 'velocity', 'acceleration', 'mass', 'newton', 'gravity', 'electric', 'magnetic', 'wave', 'frequency', 'wavelength'];
    const chemistryKeywords = ['molecule', 'atom', 'reaction', 'compound', 'element', 'bond', 'acid', 'base', 'pH', 'molar', 'oxidation', 'reduction'];
    const biologyKeywords = ['cell', 'DNA', 'gene', 'protein', 'enzyme', 'tissue', 'organ', 'species', 'evolution', 'photosynthesis', 'respiration'];
    
    const lowerText = text.toLowerCase();
    
    const physicsScore = physicsKeywords.filter(word => lowerText.includes(word)).length;
    const chemistryScore = chemistryKeywords.filter(word => lowerText.includes(word)).length;
    const biologyScore = biologyKeywords.filter(word => lowerText.includes(word)).length;
    
    if (physicsScore >= chemistryScore && physicsScore >= biologyScore) return 'Physics';
    if (chemistryScore >= biologyScore) return 'Chemistry';
    return 'Biology';
  }

  private assessComplexity(text: string): 'low' | 'medium' | 'high' {
    const complexityIndicators = [
      /calculate|compute|derive|prove/i,
      /\d+\.\d+|\d+\/\d+/,  // Decimal numbers or fractions
      /\([^\)]+\)/,         // Parenthetical expressions
      /[A-Z]{2,}/           // Chemical formulas or physics constants
    ];
    
    const matches = complexityIndicators.filter(pattern => pattern.test(text)).length;
    
    if (matches >= 3) return 'high';
    if (matches >= 1) return 'medium';
    return 'low';
  }

  private containsMath(text: string): boolean {
    return /\d+|\+|\-|\*|\/|\=|\^|\√|∑|∫|∆|π|α|β|γ|θ|λ|μ|σ|Ω/.test(text);
  }

  private containsImageReference(text: string): boolean {
    return /figure|diagram|image|graph|chart|picture|illustration/i.test(text);
  }

  private calculateConfidence(questionText: string, options: { [key: string]: string }): number {
    let confidence = 0.5; // Base confidence
    
    // Text length indicators
    if (questionText.length > 20) confidence += 0.1;
    if (questionText.length > 50) confidence += 0.1;
    
    // Option quality
    const optionCount = Object.keys(options).length;
    if (optionCount >= 4) confidence += 0.2;
    else if (optionCount >= 3) confidence += 0.1;
    
    // Content indicators
    if (this.containsMath(questionText)) confidence += 0.1;
    if (/\?/.test(questionText)) confidence += 0.1; // Has question mark
    
    return Math.min(confidence, 1.0);
  }

  private removeDuplicateQuestions(questions: NEETQuestion[]): NEETQuestion[] {
    const seen = new Set<string>();
    return questions.filter(q => {
      const key = `${q.questionNumber}_${q.questionText.substring(0, 50)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

// Main processing function
export async function processEnhancedNEETFile(filePath: string, options: EnhancedNEETOptions): Promise<ProcessingResult> {
  const processor = new EnhancedNEETProcessor(options);
  return processor.processFile(filePath);
}

// Default export
export default EnhancedNEETProcessor;