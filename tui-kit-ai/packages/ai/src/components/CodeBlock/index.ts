export { CodeBlock } from './CodeBlock';
export type { 
  CodeBlockProps, 
  CodeAction, 
  CodeMetadata, 
  SearchResult, 
  CodeBlockEvents, 
  CodeBlockMethods,
  Language,
  CodeTheme,
  CodeBlockVariant,
  CodeBlockState,
  SyntaxHighlighting,
  LanguageDetection,
  CodeFormatter,
  CodeValidator,
  ValidationError,
  ValidationWarning
} from './CodeBlock.types';
export { 
  generateCodeBlockStyles, 
  getCodeBlockVariantClass, 
  getCodeBlockStateClass, 
  getCodeBlockThemeClass,
  generateResponsiveCodeBlockStyles
} from './CodeBlock.styles';