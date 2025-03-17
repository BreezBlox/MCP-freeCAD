
/**
 * Intent Parser Module for Model Context Protocol
 * 
 * Responsible for parsing natural language design intents into structured
 * design specifications that can be processed by the Design Generator.
 */
import { DesignIntent, StructuredDesign, PrimitiveShape, Operation, DesignMetadata, UserFeedback } from './schema';

/**
 * Parse a natural language design intent into a structured design specification
 * 
 * @param intent The natural language design intent from the user
 * @returns A structured design specification or a request for clarification
 */
export async function parseDesignIntent(
  intent: DesignIntent
): Promise<StructuredDesign | UserFeedback> {
  try {
    // Example implementation that recognizes simple shapes
    // In a real implementation, this would use NLP techniques or an LLM API
    const prompt = intent.prompt.toLowerCase();
    
    // Extract basic dimensions
    const dimensionMatch = prompt.match(/(\d+)(?:\s*)(mm|cm|m|inch|in)?/);
    const size = dimensionMatch ? parseInt(dimensionMatch[1], 10) : 10;
    const unit = dimensionMatch && dimensionMatch[2] ? dimensionMatch[2] : 'mm';
    
    // Extract shape type
    let primitives: PrimitiveShape[] = [];
    let operations: Operation[] = [];
    
    if (prompt.includes('cube') || prompt.includes('box')) {
      primitives.push({
        id: generateId(),
        type: 'cube',
        parameters: {
          length: size,
          width: size,
          height: size,
          unit
        }
      });
    } else if (prompt.includes('sphere')) {
      primitives.push({
        id: generateId(),
        type: 'sphere',
        parameters: {
          radius: size / 2,
          unit
        }
      });
    } else if (prompt.includes('cylinder')) {
      primitives.push({
        id: generateId(),
        type: 'cylinder',
        parameters: {
          radius: size / 2,
          height: size,
          unit
        }
      });
    } else {
      // If unable to determine shape, request clarification
      return {
        status: 'clarification',
        message: 'Could not determine what shape to create.',
        details: 'Please specify a shape type such as "cube", "sphere", or "cylinder".',
        suggestedActions: [
          {
            type: 'clarify',
            description: 'Specify a primitive shape'
          }
        ]
      };
    }
    
    // Create metadata for the design
    const metadata: DesignMetadata = {
      name: `Design from "${intent.prompt}"`,
      description: intent.prompt,
      author: 'MCP User',
      createdAt: new Date().toISOString(),
      units: 'mm' // Default unit
    };
    
    return {
      primitives,
      operations,
      metadata
    };
  } catch (error) {
    console.error('Error parsing design intent:', error);
    return {
      status: 'error',
      message: 'Failed to parse design intent',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Generate a unique ID for shape elements
 */
function generateId(): string {
  return 'shape_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Check if the design intent is ambiguous and requires clarification
 * 
 * @param intent The design intent to check
 * @returns True if clarification is needed, false otherwise
 */
export function needsClarification(intent: DesignIntent): boolean {
  const prompt = intent.prompt.toLowerCase();
  
  // Check if the prompt is too vague
  if (prompt.length < 5) return true;
  
  // Check if it contains any shape keywords
  const shapeKeywords = ['cube', 'box', 'sphere', 'cylinder', 'cone', 'torus'];
  const hasShapeKeyword = shapeKeywords.some(keyword => prompt.includes(keyword));
  
  if (!hasShapeKeyword) return true;
  
  // Check if it has numeric dimensions
  const hasDimensions = /\d+/.test(prompt);
  
  return !hasDimensions;
}

/**
 * Generate clarification questions for ambiguous design intents
 * 
 * @param intent The design intent that needs clarification
 * @returns A list of clarification questions
 */
export function generateClarificationQuestions(
  intent: DesignIntent
): string[] {
  const prompt = intent.prompt.toLowerCase();
  const questions: string[] = [];
  
  // Check for missing shape
  const shapeKeywords = ['cube', 'box', 'sphere', 'cylinder', 'cone', 'torus'];
  const hasShapeKeyword = shapeKeywords.some(keyword => prompt.includes(keyword));
  
  if (!hasShapeKeyword) {
    questions.push('What shape would you like to create?');
  }
  
  // Check for missing dimensions
  const hasDimensions = /\d+/.test(prompt);
  
  if (!hasDimensions) {
    questions.push('What dimensions should the shape have?');
  }
  
  return questions;
}
