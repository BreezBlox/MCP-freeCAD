
/**
 * Design Generator Module for Model Context Protocol
 * 
 * Responsible for translating structured design specifications into
 * FreeCAD Python operations that can be executed by the Execution Engine.
 */
import { StructuredDesign, PrimitiveShape, Operation, FreeCADScript } from './schema';

/**
 * Generate FreeCAD Python code from a structured design specification
 * 
 * @param design The structured design specification
 * @returns FreeCAD Python script
 */
export function generateFreeCADCode(design: StructuredDesign): FreeCADScript {
  // Standard imports for FreeCAD Python scripts
  const imports = [
    'import FreeCAD as App',
    'import Part',
    'from FreeCAD import Base'
  ];
  
  // Start building the Python code
  let codeLines: string[] = [
    ...imports,
    '',
    '# Create a new document',
    'doc = App.newDocument()',
    ''
  ];
  
  // Create primitive shapes
  design.primitives.forEach(primitive => {
    const shapeCode = generatePrimitiveCode(primitive);
    codeLines.push(`# Create ${primitive.type}`);
    codeLines.push(...shapeCode);
    codeLines.push('');
  });
  
  // Apply operations
  if (design.operations.length > 0) {
    codeLines.push('# Apply operations');
    design.operations.forEach(operation => {
      const operationCode = generateOperationCode(operation);
      codeLines.push(...operationCode);
      codeLines.push('');
    });
  }
  
  // Finalize the document
  codeLines.push('# Recompute the document');
  codeLines.push('doc.recompute()');
  codeLines.push('');
  codeLines.push('# Save the document (optional)');
  codeLines.push(`# doc.saveAs("${design.metadata.name.replace(/[^a-zA-Z0-9]/g, '_')}.FCStd")`);
  
  return {
    code: codeLines.join('\n'),
    imports,
    safeToExecute: true // Basic safety check
  };
}

/**
 * Generate Python code for a primitive shape
 * 
 * @param primitive The primitive shape specification
 * @returns Array of Python code lines
 */
function generatePrimitiveCode(primitive: PrimitiveShape): string[] {
  const varName = primitive.id;
  const lines: string[] = [];
  
  switch (primitive.type) {
    case 'cube':
      const length = primitive.parameters.length as number;
      const width = primitive.parameters.width as number;
      const height = primitive.parameters.height as number;
      lines.push(`${varName} = Part.makeBox(${length}, ${width}, ${height})`);
      break;
      
    case 'sphere':
      const radius = primitive.parameters.radius as number;
      lines.push(`${varName} = Part.makeSphere(${radius})`);
      break;
      
    case 'cylinder':
      const cylRadius = primitive.parameters.radius as number;
      const cylHeight = primitive.parameters.height as number;
      lines.push(`${varName} = Part.makeCylinder(${cylRadius}, ${cylHeight})`);
      break;
      
    case 'cone':
      const coneRadius1 = primitive.parameters.radius1 as number;
      const coneRadius2 = primitive.parameters.radius2 as number || 0;
      const coneHeight = primitive.parameters.height as number;
      lines.push(`${varName} = Part.makeCone(${coneRadius1}, ${coneRadius2}, ${coneHeight})`);
      break;
      
    case 'torus':
      const torusRadius1 = primitive.parameters.radius1 as number;
      const torusRadius2 = primitive.parameters.radius2 as number;
      lines.push(`${varName} = Part.makeTorus(${torusRadius1}, ${torusRadius2})`);
      break;
  }
  
  // Apply position and rotation if specified
  if (primitive.position) {
    const pos = primitive.position;
    lines.push(`${varName}.translate(Base.Vector(${pos.x}, ${pos.y}, ${pos.z}))`);
  }
  
  if (primitive.rotation) {
    const rot = primitive.rotation;
    lines.push(`${varName}.rotate(Base.Vector(0,0,0), Base.Vector(1,0,0), ${rot.x})`);
    lines.push(`${varName}.rotate(Base.Vector(0,0,0), Base.Vector(0,1,0), ${rot.y})`);
    lines.push(`${varName}.rotate(Base.Vector(0,0,0), Base.Vector(0,0,1), ${rot.z})`);
  }
  
  // Create a shape object in the document
  lines.push(`shape_obj = doc.addObject("Part::Feature", "${primitive.type.charAt(0).toUpperCase() + primitive.type.slice(1)}")`);
  lines.push(`shape_obj.Shape = ${varName}`);
  
  return lines;
}

/**
 * Generate Python code for an operation
 * 
 * @param operation The operation specification
 * @returns Array of Python code lines
 */
function generateOperationCode(operation: Operation): string[] {
  const lines: string[] = [];
  const resultName = `result_${operation.type}_${operation.targetIds.join('_')}`;
  
  switch (operation.type) {
    case 'union':
      lines.push(`${resultName} = ${operation.targetIds[0]}.fuse(${operation.targetIds.slice(1).join(', ')})`);
      break;
      
    case 'difference':
      lines.push(`${resultName} = ${operation.targetIds[0]}.cut(${operation.targetIds.slice(1).join(', ')})`);
      break;
      
    case 'intersection':
      lines.push(`${resultName} = ${operation.targetIds[0]}.common(${operation.targetIds.slice(1).join(', ')})`);
      break;
      
    case 'fillet':
      const radius = operation.parameters?.radius as number || 1.0;
      lines.push(`${resultName} = ${operation.targetIds[0]}.makeFillet(${radius}, ${operation.targetIds[0]}.Edges)`);
      break;
      
    case 'chamfer':
      const distance = operation.parameters?.distance as number || 1.0;
      lines.push(`${resultName} = ${operation.targetIds[0]}.makeChamfer(${distance}, ${operation.targetIds[0]}.Edges)`);
      break;
  }
  
  // Create a shape object for the result
  lines.push(`result_obj = doc.addObject("Part::Feature", "${operation.type.charAt(0).toUpperCase() + operation.type.slice(1)}")`);
  lines.push(`result_obj.Shape = ${resultName}`);
  
  return lines;
}

/**
 * Validate a FreeCAD script for safety before execution
 * 
 * @param script The FreeCAD script to validate
 * @returns True if the script is safe to execute, false otherwise
 */
export function validateScriptSafety(script: FreeCADScript): boolean {
  const code = script.code.toLowerCase();
  
  // Check for potentially dangerous operations
  const dangerousPatterns = [
    'import os',
    'import sys',
    'import subprocess',
    'exec(',
    'eval(',
    'execfile(',
    '__import__',
    'open(',
    'file(',
    'system(',
    'popen('
  ];
  
  return !dangerousPatterns.some(pattern => code.includes(pattern.toLowerCase()));
}
