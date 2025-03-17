
/**
 * Model Context Protocol (MCP) Schema Definitions
 * 
 * This file contains the TypeScript interfaces that define the schema for
 * data exchange between components of the MCP system.
 */

// Natural language design intent from user
export interface DesignIntent {
  prompt: string;
  contextId: string;
  constraints?: DesignConstraint[];
}

// Specific design constraints extracted from natural language
export interface DesignConstraint {
  type: 'dimension' | 'material' | 'tolerance' | 'relationship';
  parameter: string;
  value: number | string;
  unit?: string;
}

// Structured representation of the design after parsing
export interface StructuredDesign {
  primitives: PrimitiveShape[];
  operations: Operation[];
  metadata: DesignMetadata;
}

// Basic shape primitives supported by FreeCAD
export interface PrimitiveShape {
  id: string;
  type: 'cube' | 'sphere' | 'cylinder' | 'cone' | 'torus';
  parameters: Record<string, number | string>;
  position?: Position;
  rotation?: Rotation;
}

// Position in 3D space
export interface Position {
  x: number;
  y: number;
  z: number;
}

// Rotation in 3D space
export interface Rotation {
  x: number;
  y: number;
  z: number;
}

// Operations to be performed on shapes
export interface Operation {
  type: 'union' | 'difference' | 'intersection' | 'fillet' | 'chamfer';
  targetIds: string[];
  parameters?: Record<string, number | string>;
}

// Metadata about the design
export interface DesignMetadata {
  name: string;
  description: string;
  author: string;
  createdAt: string;
  units: 'mm' | 'cm' | 'in';
}

// FreeCAD Python script
export interface FreeCADScript {
  code: string;
  imports: string[];
  safeToExecute: boolean;
}

// Execution result returned from FreeCAD
export interface ExecutionResult {
  success: boolean;
  objectIds?: string[];
  errorMessage?: string;
  warnings?: string[];
  renderUrl?: string;
}

// Feedback from the system to the user
export interface UserFeedback {
  status: 'success' | 'error' | 'warning' | 'info' | 'clarification';
  message: string;
  details?: string;
  suggestedActions?: SuggestedAction[];
}

// Actions that can be suggested to the user
export interface SuggestedAction {
  type: 'clarify' | 'modify' | 'regenerate' | 'accept';
  description: string;
  parameters?: Record<string, unknown>;
}
