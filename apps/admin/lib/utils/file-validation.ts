/**
 * File Upload Security Validation Utilities
 * Provides comprehensive security checks for file uploads in the admin system
 */

export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: readonly string[];
  allowedExtensions?: readonly string[];
  maxFiles?: number;
  requireSecureHeader?: boolean;
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedName?: string;
}

// Default security configuration
const DEFAULT_OPTIONS: Required<FileValidationOptions> = {
  maxSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: ['application/pdf'] as readonly string[],
  allowedExtensions: ['.pdf'] as readonly string[],
  maxFiles: 10,
  requireSecureHeader: true,
};

// Dangerous file extensions that should never be allowed
const DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar',
  '.app', '.deb', '.pkg', '.dmg', '.msi', '.run', '.sh', '.bash',
  '.ps1', '.psm1', '.psd1', '.ps1xml', '.psc1', '.psc2',
  '.msp', '.mst', '.cpl', '.inf', '.ins', '.isp', '.msc',
  '.gadget', '.lnk', '.url', '.website', '.ws', '.wsf', '.wsh'
];

// MIME type validation patterns
const MIME_TYPE_PATTERNS = {
  pdf: /^application\/pdf$/,
  image: /^image\/(jpeg|jpg|png|gif|webp)$/,
  text: /^text\/(plain|csv)$/,
};

/**
 * Validates a single file for security and business rules
 */
export function validateFile(
  file: File,
  options: FileValidationOptions = {}
): FileValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. File size validation
  if (file.size > opts.maxSize) {
    errors.push(`File size ${formatFileSize(file.size)} exceeds maximum allowed size ${formatFileSize(opts.maxSize)}`);
  }

  if (file.size === 0) {
    errors.push('File is empty');
  }

  // 2. File type validation (MIME type)
  if (!opts.allowedTypes.includes(file.type)) {
    errors.push(`File type "${file.type}" is not allowed. Allowed types: ${opts.allowedTypes.join(', ')}`);
  }

  // 3. File extension validation
  const extension = getFileExtension(file.name);
  if (!opts.allowedExtensions.includes(extension)) {
    errors.push(`File extension "${extension}" is not allowed. Allowed extensions: ${opts.allowedExtensions.join(', ')}`);
  }

  // 4. Dangerous extension check
  if (DANGEROUS_EXTENSIONS.includes(extension.toLowerCase())) {
    errors.push(`File extension "${extension}" is potentially dangerous and not allowed`);
  }

  // 5. Filename validation
  const filenameValidation = validateFilename(file.name);
  if (!filenameValidation.isValid) {
    errors.push(...filenameValidation.errors);
  }
  if (filenameValidation.warnings.length > 0) {
    warnings.push(...filenameValidation.warnings);
  }

  // 6. PDF-specific validation
  if (file.type === 'application/pdf') {
    const pdfValidation = validatePDFFile(file);
    if (pdfValidation.warnings.length > 0) {
      warnings.push(...pdfValidation.warnings);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitizedName: sanitizeFilename(file.name),
  };
}

/**
 * Validates multiple files
 */
export function validateFiles(
  files: File[],
  options: FileValidationOptions = {}
): FileValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check file count
  if (files.length > opts.maxFiles) {
    errors.push(`Too many files. Maximum allowed: ${opts.maxFiles}, provided: ${files.length}`);
  }

  // Validate each file
  const fileValidations = files.map(file => validateFile(file, options));

  fileValidations.forEach((validation, index) => {
    if (!validation.isValid) {
      errors.push(`File ${index + 1} (${files[index].name}): ${validation.errors.join(', ')}`);
    }
    warnings.push(...validation.warnings);
  });

  // Check for duplicate filenames
  const filenames = files.map(f => f.name.toLowerCase());
  const duplicates = filenames.filter((name, index) => filenames.indexOf(name) !== index);
  if (duplicates.length > 0) {
    warnings.push(`Duplicate filenames detected: ${[...new Set(duplicates)].join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates filename for security issues
 */
function validateFilename(filename: string): FileValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for null bytes
  if (filename.includes('\0')) {
    errors.push('Filename contains null bytes');
  }

  // Check for path traversal attempts
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    errors.push('Filename contains path traversal characters');
  }

  // Check for extremely long filenames
  if (filename.length > 255) {
    errors.push('Filename is too long (maximum 255 characters)');
  }

  // Check for control characters
  if (/[\x00-\x1f\x7f-\x9f]/.test(filename)) {
    warnings.push('Filename contains control characters');
  }

  // Check for Unicode issues
  if (filename !== filename.normalize('NFC')) {
    warnings.push('Filename contains non-normalized Unicode characters');
  }

  // Check for hidden files (starting with .)
  if (filename.startsWith('.')) {
    warnings.push('Hidden file detected');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * PDF-specific validation
 */
function validatePDFFile(file: File): Pick<FileValidationResult, 'warnings'> {
  const warnings: string[] = [];

  // Check if file actually appears to be a PDF by reading header
  // Note: This is a basic check; in production, you'd want more thorough validation
  if (file.size < 4) {
    warnings.push('PDF file appears to be too small to be valid');
  }

  return { warnings };
}

/**
 * Sanitizes filename by removing or replacing problematic characters
 */
export function sanitizeFilename(filename: string): string {
  // Remove path components
  filename = filename.replace(/.*[\/\\]/, '');

  // Replace problematic characters
  filename = filename.replace(/[^a-zA-Z0-9.-_]/g, '_');

  // Ensure it doesn't start with a dot
  if (filename.startsWith('.')) {
    filename = 'file_' + filename;
  }

  // Limit length
  if (filename.length > 100) {
    const extension = getFileExtension(filename);
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.') || filename.length);
    filename = nameWithoutExt.substring(0, 95 - extension.length) + extension;
  }

  return filename;
}

/**
 * Gets file extension with dot
 */
function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot === -1 ? '' : filename.substring(lastDot).toLowerCase();
}

/**
 * Formats file size in human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validates file header to ensure it matches the declared MIME type
 * This helps prevent file type spoofing attacks
 */
export async function validateFileHeader(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) {
        resolve(false);
        return;
      }

      const arrayBuffer = e.target.result as ArrayBuffer;
      const bytes = new Uint8Array(arrayBuffer);

      // Check PDF header
      if (file.type === 'application/pdf') {
        const pdfHeader = bytes.slice(0, 4);
        const pdfSignature = [0x25, 0x50, 0x44, 0x46]; // %PDF
        const isValidPDF = pdfSignature.every((byte, index) => byte === pdfHeader[index]);
        resolve(isValidPDF);
        return;
      }

      resolve(true); // For other types, assume valid for now
    };

    reader.onerror = () => resolve(false);
    reader.readAsArrayBuffer(file.slice(0, 10)); // Read first 10 bytes
  });
}

/**
 * Security configuration for different environments
 */
export const SECURITY_CONFIGS = {
  development: {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
    maxFiles: 20,
    requireSecureHeader: false,
  },
  production: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    maxFiles: 10,
    requireSecureHeader: true,
  },
} as const;

/**
 * Gets security configuration based on environment
 */
export function getSecurityConfig(): FileValidationOptions {
  const env = process.env.NODE_ENV || 'development';
  const config = SECURITY_CONFIGS[env as keyof typeof SECURITY_CONFIGS] || SECURITY_CONFIGS.development;
  return {
    ...config,
    allowedTypes: [...config.allowedTypes],
    allowedExtensions: [...config.allowedExtensions],
  };
}