import { z } from 'zod/v4';
import { providerMetadataSchema } from '../types/provider-metadata';

/**
 * Zod schema for TextUIPart
 */
export const textUIPartSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
  state: z.enum(['streaming', 'done']).optional(),
  providerMetadata: providerMetadataSchema.optional(),
});

/**
 * Zod schema for ReasoningUIPart
 */
export const reasoningUIPartSchema = z.object({
  type: z.literal('reasoning'),
  text: z.string(),
  state: z.enum(['streaming', 'done']).optional(),
  providerMetadata: providerMetadataSchema.optional(),
});

/**
 * Zod schema for SourceUrlUIPart
 */
export const sourceUrlUIPartSchema = z.object({
  type: z.literal('source-url'),
  sourceId: z.string(),
  url: z.string(),
  title: z.string().optional(),
  providerMetadata: providerMetadataSchema.optional(),
});

/**
 * Zod schema for SourceDocumentUIPart
 */
export const sourceDocumentUIPartSchema = z.object({
  type: z.literal('source-document'),
  sourceId: z.string(),
  mediaType: z.string(),
  title: z.string(),
  filename: z.string().optional(),
  providerMetadata: providerMetadataSchema.optional(),
});

/**
 * Zod schema for FileUIPart
 */
export const fileUIPartSchema = z.object({
  type: z.literal('file'),
  mediaType: z.string(),
  filename: z.string().optional(),
  url: z.string(),
  providerMetadata: providerMetadataSchema.optional(),
});

/**
 * Zod schema for StepStartUIPart
 */
export const stepStartUIPartSchema = z.object({
  type: z.literal('step-start'),
});

/**
 * Zod schema for DataUIPart
 */
export const dataUIPartSchema = z.object({
  type: z.templateLiteral([z.literal('data-'), z.string()]),
  id: z.string().optional(),
  data: z.unknown(),
});

/**
 * Zod schema for ToolUIPart
 */
export const toolUIPartSchema = z.discriminatedUnion('state', [
  z.object({
    type: z.templateLiteral([z.literal('tool-'), z.string()]),
    toolCallId: z.string(),
    state: z.literal('input-streaming'),
    input: z.unknown(),
    providerExecuted: z.boolean().optional(),
  }),
  z.object({
    type: z.templateLiteral([z.literal('tool-'), z.string()]),
    toolCallId: z.string(),
    state: z.literal('input-available'),
    input: z.unknown(),
    providerExecuted: z.boolean().optional(),
    callProviderMetadata: providerMetadataSchema.optional(),
  }),
  z.object({
    type: z.templateLiteral([z.literal('tool-'), z.string()]),
    toolCallId: z.string(),
    state: z.literal('output-available'),
    input: z.unknown(),
    output: z.unknown(),
    providerExecuted: z.boolean().optional(),
    callProviderMetadata: providerMetadataSchema.optional(),
  }),
  z.object({
    type: z.templateLiteral([z.literal('tool-'), z.string()]),
    toolCallId: z.string(),
    state: z.literal('output-error'),
    input: z.unknown(),
    errorText: z.string(),
    providerExecuted: z.boolean().optional(),
    callProviderMetadata: providerMetadataSchema.optional(),
  }),
]);

/**
 * Zod schema for DynamicToolUIPart
 */
export const dynamicToolUIPartSchema = z.discriminatedUnion('state', [
  z.object({
    type: z.literal('dynamic-tool'),
    toolName: z.string(),
    toolCallId: z.string(),
    state: z.literal('input-streaming'),
    input: z.unknown().optional(),
  }),
  z.object({
    type: z.literal('dynamic-tool'),
    toolName: z.string(),
    toolCallId: z.string(),
    state: z.literal('input-available'),
    input: z.unknown(),
    callProviderMetadata: providerMetadataSchema.optional(),
  }),
  z.object({
    type: z.literal('dynamic-tool'),
    toolName: z.string(),
    toolCallId: z.string(),
    state: z.literal('output-available'),
    input: z.unknown(),
    output: z.unknown(),
    callProviderMetadata: providerMetadataSchema.optional(),
  }),
  z.object({
    type: z.literal('dynamic-tool'),
    toolName: z.string(),
    toolCallId: z.string(),
    state: z.literal('output-error'),
    input: z.unknown(),
    errorText: z.string(),
    callProviderMetadata: providerMetadataSchema.optional(),
  }),
]);

/**
 * Zod schema for UIMessagePart
 *
 * This accepts any valid UI message part type.
 */
export const uiMessagePartSchema = z.union([
  textUIPartSchema,
  reasoningUIPartSchema,
  sourceUrlUIPartSchema,
  sourceDocumentUIPartSchema,
  fileUIPartSchema,
  stepStartUIPartSchema,
  dataUIPartSchema,
  toolUIPartSchema,
  dynamicToolUIPartSchema,
]);

/**
 * Zod schema for UIMessage
 *
 * This creates a basic UIMessage schema that accepts unknown metadata and
 * standard data types and tools. For more specific validation, extend this
 * schema or create your own based on your specific types.
 */
export const uiMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['system', 'user', 'assistant']),
  metadata: z.unknown().optional(),
  parts: z.array(uiMessagePartSchema),
});
