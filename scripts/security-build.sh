#!/bin/bash

# Security Analysis Build Script
# This script ensures dependencies are built for CodeQL analysis without requiring full app builds

echo "🔍 Preparing codebase for security analysis..."

# Build shared packages only (no app builds that require external services)
echo "📦 Building shared packages..."
cd packages/ui && npm run build:styles && npm run build:components
cd ../..

# Create minimal dist directories to satisfy imports
echo "📁 Creating minimal build outputs..."
mkdir -p apps/web/.next
mkdir -p apps/admin/.next  
mkdir -p apps/coach/.next

# Create stub files to prevent import errors during analysis
echo "export {};" > apps/web/.next/index.js
echo "export {};" > apps/admin/.next/index.js
echo "export {};" > apps/coach/.next/index.js

echo "✅ Security analysis preparation complete"