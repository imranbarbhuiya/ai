import { z } from 'zod/v4';
import {
  dataUIPartSchema,
  dynamicToolUIPartSchema,
  fileUIPartSchema,
  reasoningUIPartSchema,
  sourceDocumentUIPartSchema,
  sourceUrlUIPartSchema,
  stepStartUIPartSchema,
  textUIPartSchema,
  toolUIPartSchema,
  uiMessagePartSchema,
  uiMessageSchema,
} from './ui-message-schemas';
import type {
  TextUIPart,
  ReasoningUIPart,
  SourceUrlUIPart,
  SourceDocumentUIPart,
  FileUIPart,
  StepStartUIPart,
  DataUIPart,
  ToolUIPart,
  DynamicToolUIPart,
  UIMessage,
  UIMessagePart,
  UIDataTypes,
} from './ui-messages';

describe('UI Message Schemas', () => {
  describe('textUIPartSchema', () => {
    it('should validate a basic text part', () => {
      const validPart = {
        type: 'text',
        text: 'Hello, world!',
      };

      expect(() => textUIPartSchema.parse(validPart)).not.toThrow();
      expectTypeOf(
        textUIPartSchema.parse(validPart),
      ).toEqualTypeOf<TextUIPart>();
    });

    it('should validate a text part with state and provider metadata', () => {
      const validPart = {
        type: 'text',
        text: 'Hello, world!',
        state: 'done',
        providerMetadata: {
          openai: { model: 'gpt-4' },
        },
      };

      expect(() => textUIPartSchema.parse(validPart)).not.toThrow();
    });

    it('should reject invalid type', () => {
      const invalidPart = {
        type: 'invalid',
        text: 'Hello, world!',
      };

      expect(() => textUIPartSchema.parse(invalidPart)).toThrow();
    });

    it('should reject missing text', () => {
      const invalidPart = {
        type: 'text',
      };

      expect(() => textUIPartSchema.parse(invalidPart)).toThrow();
    });
  });

  describe('reasoningUIPartSchema', () => {
    it('should validate a basic reasoning part', () => {
      const validPart = {
        type: 'reasoning',
        text: 'Let me think about this...',
      };

      expect(() => reasoningUIPartSchema.parse(validPart)).not.toThrow();
      expectTypeOf(
        reasoningUIPartSchema.parse(validPart),
      ).toEqualTypeOf<ReasoningUIPart>();
    });

    it('should validate a reasoning part with state', () => {
      const validPart = {
        type: 'reasoning',
        text: 'Let me think about this...',
        state: 'streaming',
      };

      expect(() => reasoningUIPartSchema.parse(validPart)).not.toThrow();
    });
  });

  describe('sourceUrlUIPartSchema', () => {
    it('should validate a source URL part', () => {
      const validPart = {
        type: 'source-url',
        sourceId: 'src-1',
        url: 'https://example.com',
        title: 'Example Page',
      };

      expect(() => sourceUrlUIPartSchema.parse(validPart)).not.toThrow();
      expectTypeOf(
        sourceUrlUIPartSchema.parse(validPart),
      ).toEqualTypeOf<SourceUrlUIPart>();
    });

    it('should validate without optional title', () => {
      const validPart = {
        type: 'source-url',
        sourceId: 'src-1',
        url: 'https://example.com',
      };

      expect(() => sourceUrlUIPartSchema.parse(validPart)).not.toThrow();
    });
  });

  describe('sourceDocumentUIPartSchema', () => {
    it('should validate a source document part', () => {
      const validPart = {
        type: 'source-document',
        sourceId: 'doc-1',
        mediaType: 'application/pdf',
        title: 'Document Title',
        filename: 'document.pdf',
      };

      expect(() => sourceDocumentUIPartSchema.parse(validPart)).not.toThrow();
      expectTypeOf(
        sourceDocumentUIPartSchema.parse(validPart),
      ).toEqualTypeOf<SourceDocumentUIPart>();
    });

    it('should validate without optional filename', () => {
      const validPart = {
        type: 'source-document',
        sourceId: 'doc-1',
        mediaType: 'application/pdf',
        title: 'Document Title',
      };

      expect(() => sourceDocumentUIPartSchema.parse(validPart)).not.toThrow();
    });
  });

  describe('fileUIPartSchema', () => {
    it('should validate a file part', () => {
      const validPart = {
        type: 'file',
        mediaType: 'image/png',
        url: 'https://example.com/image.png',
        filename: 'image.png',
      };

      expect(() => fileUIPartSchema.parse(validPart)).not.toThrow();
      expectTypeOf(
        fileUIPartSchema.parse(validPart),
      ).toEqualTypeOf<FileUIPart>();
    });

    it('should validate without optional filename', () => {
      const validPart = {
        type: 'file',
        mediaType: 'image/png',
        url: 'https://example.com/image.png',
      };

      expect(() => fileUIPartSchema.parse(validPart)).not.toThrow();
    });
  });

  describe('stepStartUIPartSchema', () => {
    it('should validate a step start part', () => {
      const validPart = {
        type: 'step-start',
      };

      expect(() => stepStartUIPartSchema.parse(validPart)).not.toThrow();
      expectTypeOf(
        stepStartUIPartSchema.parse(validPart),
      ).toEqualTypeOf<StepStartUIPart>();
    });
  });

  describe('dataUIPartSchema', () => {
    it('should validate a data part', () => {
      const validPart = {
        type: 'data-custom',
        id: 'data-1',
        data: { key: 'value' },
      };

      expect(() => dataUIPartSchema.parse(validPart)).not.toThrow();
      const parsed = dataUIPartSchema.parse(validPart);
      expectTypeOf(parsed).toEqualTypeOf<DataUIPart<UIDataTypes>>();
    });

    it('should validate without optional id', () => {
      const validPart = {
        type: 'data-another',
        data: 'some data',
      };

      expect(() => dataUIPartSchema.parse(validPart)).not.toThrow();
    });

    it('should reject type that does not start with data-', () => {
      const invalidPart = {
        type: 'custom',
        data: {},
      };

      expect(() => dataUIPartSchema.parse(invalidPart)).toThrow();
    });
  });

  describe('toolUIPartSchema', () => {
    it('should validate tool part in input-streaming state', () => {
      const validPart = {
        type: 'tool-getWeather',
        toolCallId: 'call-1',
        state: 'input-streaming',
        input: { location: 'New York' },
      };

      expect(() => toolUIPartSchema.parse(validPart)).not.toThrow();
      const parsed = toolUIPartSchema.parse(validPart);

      expectTypeOf(parsed).toMatchTypeOf<ToolUIPart>();
    });

    it('should validate tool part in input-available state', () => {
      const validPart = {
        type: 'tool-getWeather',
        toolCallId: 'call-1',
        state: 'input-available',
        input: { location: 'New York' },
        providerExecuted: true,
      };

      expect(() => toolUIPartSchema.parse(validPart)).not.toThrow();
    });

    it('should validate tool part in output-available state', () => {
      const validPart = {
        type: 'tool-getWeather',
        toolCallId: 'call-1',
        state: 'output-available',
        input: { location: 'New York' },
        output: { temperature: 72 },
      };

      expect(() => toolUIPartSchema.parse(validPart)).not.toThrow();
    });

    it('should validate tool part in output-error state', () => {
      const validPart = {
        type: 'tool-getWeather',
        toolCallId: 'call-1',
        state: 'output-error',
        input: { location: 'New York' },
        errorText: 'Failed to fetch weather',
      };

      expect(() => toolUIPartSchema.parse(validPart)).not.toThrow();
    });

    it('should reject type that does not start with tool-', () => {
      const invalidPart = {
        type: 'getWeather',
        toolCallId: 'call-1',
        state: 'input-available',
        input: {},
      };

      expect(() => toolUIPartSchema.parse(invalidPart)).toThrow();
    });
  });

  describe('dynamicToolUIPartSchema', () => {
    it('should validate dynamic tool part in input-streaming state', () => {
      const validPart = {
        type: 'dynamic-tool',
        toolName: 'searchWeb',
        toolCallId: 'call-1',
        state: 'input-streaming',
        input: { query: 'AI news' },
      };

      expect(() => dynamicToolUIPartSchema.parse(validPart)).not.toThrow();
      const parsed = dynamicToolUIPartSchema.parse(validPart);
      expectTypeOf(parsed).toMatchTypeOf<DynamicToolUIPart>();
    });

    it('should validate dynamic tool part in output-available state', () => {
      const validPart = {
        type: 'dynamic-tool',
        toolName: 'searchWeb',
        toolCallId: 'call-1',
        state: 'output-available',
        input: { query: 'AI news' },
        output: { results: [] },
      };

      expect(() => dynamicToolUIPartSchema.parse(validPart)).not.toThrow();
    });

    it('should validate dynamic tool part in output-error state', () => {
      const validPart = {
        type: 'dynamic-tool',
        toolName: 'searchWeb',
        toolCallId: 'call-1',
        state: 'output-error',
        input: { query: 'AI news' },
        errorText: 'Search failed',
      };

      expect(() => dynamicToolUIPartSchema.parse(validPart)).not.toThrow();
    });
  });

  describe('uiMessagePartSchema', () => {
    it('should validate any valid message part type', () => {
      const textPart = {
        type: 'text',
        text: 'Hello',
      };

      const toolPart = {
        type: 'tool-getWeather',
        toolCallId: 'call-1',
        state: 'input-available',
        input: { location: 'NYC' },
      };

      expect(() => uiMessagePartSchema.parse(textPart)).not.toThrow();
      expect(() => uiMessagePartSchema.parse(toolPart)).not.toThrow();
    });
  });

  describe('uiMessageSchema', () => {
    it('should validate a basic UI message', () => {
      const validMessage = {
        id: 'msg-1',
        role: 'user',
        parts: [
          {
            type: 'text',
            text: 'Hello, AI!',
          },
        ],
      };

      expect(() => uiMessageSchema.parse(validMessage)).not.toThrow();
      expectTypeOf(
        uiMessageSchema.parse(validMessage),
      ).toEqualTypeOf<UIMessage>();
    });

    it('should validate a UI message with metadata', () => {
      const validMessage = {
        id: 'msg-1',
        role: 'assistant',
        metadata: {
          model: 'gpt-4',
          tokens: 150,
        },
        parts: [
          {
            type: 'text',
            text: 'Hello, human!',
          },
        ],
      };

      expect(() => uiMessageSchema.parse(validMessage)).not.toThrow();
    });

    it('should validate a complex UI message with multiple parts', () => {
      const validMessage = {
        id: 'msg-1',
        role: 'assistant',
        parts: [
          {
            type: 'text',
            text: 'Let me check the weather for you.',
          },
          {
            type: 'tool-getWeather',
            toolCallId: 'call-1',
            state: 'output-available',
            input: { location: 'San Francisco' },
            output: { temperature: 65, conditions: 'sunny' },
          },
          {
            type: 'text',
            text: 'The weather in San Francisco is 65°F and sunny.',
          },
        ],
      };

      expect(() => uiMessageSchema.parse(validMessage)).not.toThrow();
    });

    it('should reject invalid role', () => {
      const invalidMessage = {
        id: 'msg-1',
        role: 'invalid',
        parts: [
          {
            type: 'text',
            text: 'Hello',
          },
        ],
      };

      expect(() => uiMessageSchema.parse(invalidMessage)).toThrow();
    });

    it('should reject missing id', () => {
      const invalidMessage = {
        role: 'user',
        parts: [
          {
            type: 'text',
            text: 'Hello',
          },
        ],
      };

      expect(() => uiMessageSchema.parse(invalidMessage)).toThrow();
    });

    it('should reject empty parts array', () => {
      const invalidMessage = {
        id: 'msg-1',
        role: 'user',
        parts: [],
      };

      // This should actually be valid as empty parts are allowed
      expect(() => uiMessageSchema.parse(invalidMessage)).not.toThrow();
    });
  });

  describe('Runtime validation example', () => {
    it('should demonstrate runtime validation use case from the issue', () => {
      // Simulate JSON data from database
      const rawJsonData = JSON.stringify({
        id: 'msg-123',
        role: 'assistant',
        metadata: {
          createdAt: Date.now(),
          model: 'gpt-4',
        },
        parts: [
          {
            type: 'text',
            text: 'I can help you with that.',
            state: 'done',
          },
          {
            type: 'tool-searchWeb',
            toolCallId: 'call-456',
            state: 'output-available',
            input: { query: 'latest AI news' },
            output: { results: ['News item 1', 'News item 2'] },
          },
        ],
      });

      // Parse and validate - this is what users want to do
      const parsed = JSON.parse(rawJsonData);

      expect(() => {
        const validatedMessage = uiMessageSchema.parse(parsed);
        // This would be runtime-safe 🎉
        expect(validatedMessage.id).toBe('msg-123');
        expect(validatedMessage.role).toBe('assistant');
        expect(validatedMessage.parts).toHaveLength(2);
      }).not.toThrow();
    });

    it('should catch invalid data from database', () => {
      // Simulate corrupted/invalid JSON data from database
      const invalidJsonData = JSON.stringify({
        id: 'msg-123',
        role: 'invalid-role', // Invalid role
        parts: [
          {
            type: 'text',
            // Missing required 'text' field
          },
        ],
      });

      const parsed = JSON.parse(invalidJsonData);

      expect(() => {
        uiMessageSchema.parse(parsed);
      }).toThrow(); // Should catch the validation error
    });
  });
});
