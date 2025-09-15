// Test Script for Enhanced NEET OCR Processor
// Production-ready testing with comprehensive analysis

import { processEnhancedNEETFile } from './enhanced-neet-processor';
import path from 'path';

async function testEnhancedNEET() {
  console.log('🧪 Testing Enhanced NEET OCR Processor (Production Ready)...');
  console.log('='.repeat(60));
  
  const testPDFPath = path.join(process.cwd(), '../../NEET_2024_Physics.pdf');
  
  try {
    console.log('📄 Testing with PDF:', testPDFPath);
    console.log('⏱️ Starting processing...\n');
    
    const result = await processEnhancedNEETFile(testPDFPath, {
      useOCR: true,
      preprocessImages: true,
      confidenceThreshold: 0.6,
      subjects: ['Physics', 'Chemistry', 'Biology'],
      maxPages: 30, // Production test with more pages
      skipInstructionPages: true,
      enableMathFormulaParsing: true,
      strictNEETFormat: true,
    });
    
    console.log('\n🎉 ENHANCED NEET OCR RESULTS:');
    console.log('='.repeat(60));
    
    // Document Analysis
    console.log('\n📊 DOCUMENT ANALYSIS:');
    console.log(`   NEET Format detected: ${result.metadata.documentAnalysis.isNEETFormat ? '✅ Yes' : '❌ No'}`);
    console.log(`   Has instructions: ${result.metadata.documentAnalysis.hasInstructions ? 'Yes' : 'No'}`);
    console.log(`   Has solutions: ${result.metadata.documentAnalysis.hasSolutions ? 'Yes' : 'No'}`);
    console.log(`   Content quality: ${result.metadata.documentAnalysis.contentQuality.toUpperCase()}`);
    console.log(`   Estimated questions: ${result.metadata.documentAnalysis.estimatedQuestionCount}`);
    
    // Processing Stats
    console.log('\n📈 PROCESSING STATISTICS:');
    console.log(`   Total pages: ${result.metadata.totalPages}`);
    console.log(`   Pages processed: ${result.metadata.pagesProcessed}`);
    console.log(`   Questions found: ${result.metadata.questionsFound}`);
    console.log(`   Average confidence: ${(result.metadata.averageConfidence * 100).toFixed(1)}%`);
    console.log(`   Processing time: ${(result.metadata.processingTime / 1000).toFixed(2)}s`);
    
    // Question Analysis
    if (result.questions.length > 0) {
      console.log('\n📚 QUESTION BREAKDOWN:');
      
      // Subject distribution
      const subjectCount = result.questions.reduce((acc, q) => {
        acc[q.subject] = (acc[q.subject] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });
      
      Object.entries(subjectCount).forEach(([subject, count]) => {
        console.log(`   ${subject}: ${count} questions`);
      });
      
      // Complexity distribution
      const complexityCount = result.questions.reduce((acc, q) => {
        acc[q.complexity] = (acc[q.complexity] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });
      
      console.log('\n🎯 COMPLEXITY BREAKDOWN:');
      Object.entries(complexityCount).forEach(([complexity, count]) => {
        console.log(`   ${complexity.charAt(0).toUpperCase() + complexity.slice(1)}: ${count} questions`);
      });
      
      // Show sample questions
      console.log('\n📝 SAMPLE QUESTIONS:');
      result.questions.slice(0, 3).forEach((q, index) => {
        console.log(`\n${index + 1}. Question ${q.questionNumber} (${q.subject}):`);
        console.log(`   Text: ${q.questionText.substring(0, 100)}${q.questionText.length > 100 ? '...' : ''}`);
        console.log(`   Options: ${Object.keys(q.options).length} (${Object.keys(q.options).join(', ')})`);
        console.log(`   Confidence: ${(q.confidence * 100).toFixed(1)}%`);
        console.log(`   Features: ${q.hasMath ? 'Math' : 'No Math'}, ${q.hasImage ? 'Image' : 'No Image'}`);
      });
    }
    
    // Quality Assessment
    console.log('\n🏆 QUALITY ASSESSMENT:');
    const qualityScore = calculateQualityScore(result);
    console.log(`   Overall Quality Score: ${qualityScore.score}/100`);
    console.log(`   Quality Rating: ${qualityScore.rating}`);
    
    // Recommendations
    if (qualityScore.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      qualityScore.recommendations.forEach(rec => {
        console.log(`   • ${rec}`);
      });
    }
    
    // Error and Warning Summary
    if (result.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      result.errors.forEach(error => {
        console.log(`   • ${error}`);
      });
    }
    
    if (result.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      result.warnings.forEach(warning => {
        console.log(`   • ${warning}`);
      });
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`✅ Enhanced NEET OCR Test Complete - ${result.questions.length} questions extracted`);
    
  } catch (error) {
    console.error('\n❌ Enhanced NEET OCR Test Failed:');
    console.error('   Error:', error.message);
    console.error('   Stack:', error.stack);
    
    // Troubleshooting suggestions
    console.log('\n🔧 TROUBLESHOOTING SUGGESTIONS:');
    console.log('   1. Check if PDF file exists at the specified path');
    console.log('   2. Ensure all OCR dependencies are installed (npm install)');
    console.log('   3. Verify PDF is not corrupted and is readable');
    console.log('   4. Check available system memory for OCR processing');
    console.log('   5. Try running diagnose-ocr.ts for detailed dependency check');
  }
}

function calculateQualityScore(result: any): { score: number; rating: string; recommendations: string[] } {
  let score = 0;
  const recommendations: string[] = [];
  
  // Document analysis score (30 points)
  if (result.metadata.documentAnalysis.isNEETFormat) score += 15;
  else recommendations.push('Document may not be in standard NEET format');
  
  if (result.metadata.documentAnalysis.contentQuality === 'excellent') score += 15;
  else if (result.metadata.documentAnalysis.contentQuality === 'good') score += 10;
  else if (result.metadata.documentAnalysis.contentQuality === 'fair') score += 5;
  else recommendations.push('Improve PDF quality or resolution');
  
  // Question extraction score (40 points)
  const extractionRate = result.metadata.questionsFound / Math.max(result.metadata.documentAnalysis.estimatedQuestionCount, 100);
  if (extractionRate >= 0.8) score += 20;
  else if (extractionRate >= 0.6) score += 15;
  else if (extractionRate >= 0.4) score += 10;
  else if (extractionRate >= 0.2) score += 5;
  else recommendations.push('Low question extraction rate - check PDF formatting');
  
  if (result.questions.length > 0) {
    const avgOptionCount = result.questions.reduce((sum: number, q: any) => sum + Object.keys(q.options).length, 0) / result.questions.length;
    if (avgOptionCount >= 3.5) score += 20;
    else if (avgOptionCount >= 2.5) score += 15;
    else if (avgOptionCount >= 1.5) score += 10;
    else recommendations.push('Many questions missing complete option sets');
  }
  
  // Confidence score (20 points)
  if (result.metadata.averageConfidence >= 0.8) score += 20;
  else if (result.metadata.averageConfidence >= 0.7) score += 15;
  else if (result.metadata.averageConfidence >= 0.6) score += 10;
  else if (result.metadata.averageConfidence >= 0.5) score += 5;
  else recommendations.push('Low confidence scores - consider OCR preprocessing');
  
  // Processing efficiency (10 points)
  const processingSpeed = result.metadata.totalPages / (result.metadata.processingTime / 1000); // pages per second
  if (processingSpeed >= 2) score += 10;
  else if (processingSpeed >= 1) score += 7;
  else if (processingSpeed >= 0.5) score += 5;
  else recommendations.push('Processing speed could be improved');
  
  // Determine rating
  let rating: string;
  if (score >= 90) rating = 'EXCELLENT';
  else if (score >= 80) rating = 'VERY GOOD';
  else if (score >= 70) rating = 'GOOD';
  else if (score >= 60) rating = 'FAIR';
  else if (score >= 50) rating = 'POOR';
  else rating = 'VERY POOR';
  
  return { score, rating, recommendations };
}

// Main execution when run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testEnhancedNEET()
    .then(() => {
      console.log('\n🎯 Test execution completed successfully.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test execution failed:', error);
      process.exit(1);
    });
}

export { testEnhancedNEET };