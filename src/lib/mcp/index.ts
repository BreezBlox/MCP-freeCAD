
/**
 * Model Context Protocol (MCP) - Main Integration Module
 * 
 * This module ties together all the components of the MCP system and provides
 * a simple API for the application to use.
 */
import { DesignIntent, StructuredDesign, FreeCADScript, ExecutionResult, UserFeedback } from './schema';
import { parseDesignIntent, needsClarification, generateClarificationQuestions } from './intent-parser';
import { generateFreeCADCode, validateScriptSafety } from './design-generator';
import { executeScript, connectToFreeCAD, renderModel } from './execution-engine';
import { generateUserFeedback, formatErrorMessage } from './feedback-collector';

/**
 * Process a design intent through the complete MCP pipeline
 * 
 * @param intent The natural language design intent from the user
 * @returns The result of processing the design intent
 */
export async function processDesignIntent(
  intent: DesignIntent
): Promise<{
  structuredDesign?: StructuredDesign;
  script?: FreeCADScript;
  executionResult?: ExecutionResult;
  feedback: UserFeedback;
}> {
  try {
    // Check if the design intent needs clarification
    if (needsClarification(intent)) {
      const questions = generateClarificationQuestions(intent);
      return {
        feedback: {
          status: 'clarification',
          message: 'Your design intent needs more details.',
          details: 'Please provide additional information to create your model.',
          suggestedActions: questions.map(question => ({
            type: 'clarify',
            description: question
          }))
        }
      };
    }
    
    // Parse the design intent into a structured design
    const parsedResult = await parseDesignIntent(intent);
    
    // Handle case where parsing returned a need for clarification
    if ('status' in parsedResult) {
      return { feedback: parsedResult };
    }
    
    // Generate FreeCAD code from the structured design
    const script = generateFreeCADCode(parsedResult);
    
    // Validate script safety
    if (!validateScriptSafety(script)) {
      return {
        structuredDesign: parsedResult,
        script,
        feedback: {
          status: 'error',
          message: 'Generated code contains unsafe operations.',
          details: 'The system detected potentially dangerous operations in the generated code.',
          suggestedActions: [{
            type: 'modify',
            description: 'Modify your design intent to avoid unsafe operations.'
          }]
        }
      };
    }
    
    // Execute the script in FreeCAD (mock implementation)
    const executionResult = await executeScript(script);
    
    // Generate user feedback based on execution result
    const feedback = generateUserFeedback(executionResult);
    
    return {
      structuredDesign: parsedResult,
      script,
      executionResult,
      feedback
    };
  } catch (error) {
    console.error('Error in MCP pipeline:', error);
    
    // Return error feedback
    return {
      feedback: {
        status: 'error',
        message: 'An unexpected error occurred while processing your design.',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestedActions: [{
          type: 'regenerate',
          description: 'Try again with a simpler design'
        }]
      }
    };
  }
}

/**
 * Connect to a FreeCAD instance
 * 
 * @param host The host address of the FreeCAD instance
 * @param port The port number of the FreeCAD instance
 * @returns True if connection was successful, false otherwise
 */
export async function connectToFreeCADInstance(
  host: string = 'localhost',
  port: number = 8080
): Promise<boolean> {
  return connectToFreeCAD(host, port);
}

// Export all components for direct access if needed
export * from './schema';
export * from './intent-parser';
export * from './design-generator';
export * from './execution-engine';
export * from './feedback-collector';
