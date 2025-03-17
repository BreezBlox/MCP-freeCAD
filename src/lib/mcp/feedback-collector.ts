
/**
 * Feedback Collector Module for Model Context Protocol
 * 
 * Responsible for collecting and formatting feedback about execution
 * results to provide to the user.
 */
import { ExecutionResult, UserFeedback, SuggestedAction } from './schema';

/**
 * Generate user feedback from an execution result
 * 
 * @param result The execution result
 * @returns Formatted user feedback
 */
export function generateUserFeedback(result: ExecutionResult): UserFeedback {
  if (result.success) {
    return {
      status: 'success',
      message: 'Model created successfully!',
      details: result.warnings && result.warnings.length > 0
        ? `Model created with ${result.warnings.length} warning(s).`
        : 'The model was created without any warnings.',
      suggestedActions: getSuggestedActionsForSuccess(result)
    };
  } else {
    return {
      status: 'error',
      message: 'Failed to create model.',
      details: result.errorMessage || 'An unknown error occurred during execution.',
      suggestedActions: getSuggestedActionsForFailure(result)
    };
  }
}

/**
 * Get suggested actions for a successful execution
 * 
 * @param result The successful execution result
 * @returns Array of suggested actions
 */
function getSuggestedActionsForSuccess(result: ExecutionResult): SuggestedAction[] {
  const actions: SuggestedAction[] = [
    {
      type: 'accept',
      description: 'Use this model'
    }
  ];
  
  if (result.warnings && result.warnings.length > 0) {
    actions.push({
      type: 'modify',
      description: 'Modify design to address warnings'
    });
  }
  
  return actions;
}

/**
 * Get suggested actions for a failed execution
 * 
 * @param result The failed execution result
 * @returns Array of suggested actions
 */
function getSuggestedActionsForFailure(result: ExecutionResult): SuggestedAction[] {
  return [
    {
      type: 'regenerate',
      description: 'Try again with simplified geometry'
    },
    {
      type: 'modify',
      description: 'Modify design parameters'
    },
    {
      type: 'clarify',
      description: 'Provide more details about the design'
    }
  ];
}

/**
 * Log user feedback for analysis
 * 
 * @param feedback The user feedback to log
 */
export function logUserFeedback(feedback: UserFeedback): void {
  console.log('User feedback:', JSON.stringify(feedback, null, 2));
  
  // In a real implementation, this might send the feedback to an analytics
  // service or server for logging and analysis.
}

/**
 * Format error messages for user display
 * 
 * @param errorMessage The raw error message
 * @returns A user-friendly error message
 */
export function formatErrorMessage(errorMessage: string): string {
  // Clean up common FreeCAD error messages to make them more user-friendly
  
  // Example transformation: convert technical error to user-friendly message
  if (errorMessage.includes('TopoDS_Shape is null')) {
    return 'The design resulted in an invalid shape. Try simplifying your geometry.';
  }
  
  if (errorMessage.includes('out of bounds')) {
    return 'One or more parameters are out of the allowed range. Check your dimensions.';
  }
  
  // If no specific transformation applies, return the original message
  return errorMessage;
}
