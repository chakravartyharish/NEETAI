// OCR Pipeline Diagnostic Tool
// Comprehensive health check for OCR dependencies and functionality

import fs from 'fs';
import path from 'path';

interface DiagnosticResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
}

interface DiagnosticReport {
  passed: number;
  failed: number;
  warnings: number;
  results: DiagnosticResult[];
}

async function runDiagnostics(): Promise<DiagnosticReport> {
  console.log('🔍 Running OCR Pipeline Diagnostics...\n');
  
  const results: DiagnosticResult[] = [];
  
  console.log('📦 Checking package installations...');
  await checkPackageInstallation(results);
  
  console.log('📄 Checking for test PDF files...');
  await checkTestFiles(results);
  
  console.log('🧪 Testing basic PDF functionality...');
  await testPDFFunctionality(results);
  
  console.log('📁 Checking directory structure...');
  await checkDirectoryStructure(results);
  
  console.log('👁️ Testing Tesseract OCR initialization...');
  await testTesseractInit(results);
  
  const report = generateReport(results);
  displayReport(report);
  
  return report;
}

async function checkPackageInstallation(results: DiagnosticResult[]) {
  // Test pdf-parse (known to be problematic)
  try {
    const pdfParse = await import('pdf-parse');
    results.push({
      name: 'pdf-parse',
      status: 'pass',
      message: 'pdf-parse is installed and importable'
    });
  } catch (error) {
    results.push({
      name: 'pdf-parse',
      status: 'fail',
      message: 'pdf-parse import/initialization failed',
      details: error.message
    });
  }
  
  // Test tesseract.js
  try {
    const tesseract = await import('tesseract.js');
    results.push({
      name: 'tesseract.js',
      status: 'pass',
      message: 'tesseract.js is installed and importable'
    });
  } catch (error) {
    results.push({
      name: 'tesseract.js',
      status: 'fail',
      message: 'tesseract.js import failed',
      details: error.message
    });
  }
  
  // Test sharp
  try {
    const sharp = await import('sharp');
    results.push({
      name: 'sharp',
      status: 'pass',
      message: 'sharp is installed and importable'
    });
  } catch (error) {
    results.push({
      name: 'sharp',
      status: 'fail',
      message: 'sharp import failed',
      details: error.message
    });
  }
  
  // Test pdf2pic
  try {
    const pdf2pic = await import('pdf2pic');
    results.push({
      name: 'pdf2pic',
      status: 'pass',
      message: 'pdf2pic is installed and importable'
    });
  } catch (error) {
    results.push({
      name: 'pdf2pic',
      status: 'fail',
      message: 'pdf2pic import failed',
      details: error.message
    });
  }
  
  // Test pdf2image (alternative)
  try {
    const pdf2image = await import('pdf2image');
    results.push({
      name: 'pdf2image',
      status: 'pass',
      message: 'pdf2image is installed and importable'
    });
  } catch (error) {
    results.push({
      name: 'pdf2image',
      status: 'warning',
      message: 'pdf2image not available (optional fallback)',
      details: error.message
    });
  }
}

async function checkTestFiles(results: DiagnosticResult[]) {
  // Look for test PDF files in common locations
  const possiblePaths = [
    path.join(process.cwd(), 'NEET_2024_Physics.pdf'),
    path.join(process.cwd(), '../../NEET_2024_Physics.pdf'),
    path.join(process.cwd(), '../../../NEET_2024_Physics.pdf'),
    path.join(process.cwd(), 'test.pdf'),
    path.join(process.cwd(), 'sample.pdf')
  ];
  
  let foundTestPDF = false;
  let testPDFPath = '';
  
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      foundTestPDF = true;
      testPDFPath = filePath;
      break;
    }
  }
  
  if (foundTestPDF) {
    results.push({
      name: 'test-pdf',
      status: 'pass',
      message: `Test PDF found at: ${testPDFPath}`
    });
  } else {
    results.push({
      name: 'test-pdf',
      status: 'warning',
      message: 'No test PDF found in common locations',
      details: 'Searched: ' + possiblePaths.join(', ')
    });
  }
}

async function testPDFFunctionality(results: DiagnosticResult[]) {
  // Test pdf-parse functionality
  try {
    const pdfParse = await import('pdf-parse');
    
    // Try to use pdf-parse with a dummy operation
    // This will likely fail due to the internal test file issue
    const buffer = Buffer.from('dummy');
    await pdfParse.default(buffer);
    
    results.push({
      name: 'pdf-parsing',
      status: 'pass',
      message: 'PDF parsing functionality works'
    });
  } catch (error) {
    results.push({
      name: 'pdf-parsing',
      status: 'fail',
      message: 'PDF parsing failed',
      details: error.message
    });
  }
}

async function checkDirectoryStructure(results: DiagnosticResult[]) {
  const requiredDirs = [
    'lib/ocr',
    'lib/storage',
    'uploads'
  ];
  
  for (const dir of requiredDirs) {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      results.push({
        name: `directory-${dir.replace('/', '-')}`,
        status: 'pass',
        message: `Directory exists: ${dir}`
      });
    } else {
      results.push({
        name: `directory-${dir.replace('/', '-')}`,
        status: 'warning',
        message: `Directory missing: ${dir}`,
        details: 'Will be created automatically when needed'
      });
    }
  }
}

async function testTesseractInit(results: DiagnosticResult[]) {
  try {
    const { createWorker } = await import('tesseract.js');
    
    // Test worker creation and initialization
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.terminate();
    
    results.push({
      name: 'tesseract-init',
      status: 'pass',
      message: 'Tesseract worker initialization successful'
    });
  } catch (error) {
    results.push({
      name: 'tesseract-init',
      status: 'fail',
      message: 'Tesseract initialization failed',
      details: error.message
    });
  }
}

function generateReport(results: DiagnosticResult[]): DiagnosticReport {
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const warnings = results.filter(r => r.status === 'warning').length;
  
  return { passed, failed, warnings, results };
}

function displayReport(report: DiagnosticReport) {
  console.log('\n📊 DIAGNOSTIC REPORT\n');
  console.log('='.repeat(60));
  console.log(`✅ PASSED: ${report.passed}`);
  console.log(`❌ FAILED: ${report.failed}`);
  console.log(`⚠️  WARNINGS: ${report.warnings}`);
  console.log('='.repeat(60));
  
  // Group results by status for cleaner output
  const failedResults = report.results.filter(r => r.status === 'fail');
  const passedResults = report.results.filter(r => r.status === 'pass');
  const warningResults = report.results.filter(r => r.status === 'warning');
  
  // Show failed tests first
  failedResults.forEach(result => {
    console.log(`❌ ${result.name}: ${result.message}`);
    if (result.details) {
      console.log(`   └── ${result.details}`);
    }
  });
  
  // Show passed tests
  passedResults.forEach(result => {
    console.log(`✅ ${result.name}: ${result.message}`);
  });
  
  // Show warnings
  warningResults.forEach(result => {
    console.log(`⚠️  ${result.name}: ${result.message}`);
    if (result.details) {
      console.log(`   └── ${result.details}`);
    }
  });
  
  // Recommendations
  if (report.failed > 0 || report.warnings > 0) {
    console.log('\n🔧 RECOMMENDATIONS:\n');
    
    if (report.failed > 0) {
      console.log('❌ CRITICAL ISSUES FOUND:');
      failedResults.forEach(result => {
        console.log(`   • Fix ${result.name}: ${result.message}`);
        if (result.details) {
          console.log(`     Details: ${result.details}`);
        }
      });
    }
    
    if (report.warnings > 0) {
      console.log('\n⚠️  OPTIONAL IMPROVEMENTS:');
      warningResults.forEach(result => {
        console.log(`   • ${result.name}: ${result.message}`);
      });
    }
    
    console.log('\n🔧 Fix the failed checks above first, then run diagnostics again');
  } else {
    console.log('\n🎉 All diagnostics passed! OCR pipeline is ready.');
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  runDiagnostics()
    .then(() => {
      console.log('\n✅ Diagnostics completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Diagnostics failed:', error);
      process.exit(1);
    });
}

export { runDiagnostics, DiagnosticResult, DiagnosticReport };