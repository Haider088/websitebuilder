import { useState, useCallback, useEffect } from 'react';
import { AIMessage, AIContext, AIAction } from '../types/ai';
import { sendMessage, isAIAvailable, initializeAI, getQuickSuggestions } from '../utils/aiService';

export function useAI(context: AIContext) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [recentActions, setRecentActions] = useState<string[]>([]);

  useEffect(() => {
    const available = initializeAI();
    setIsAvailable(available);
  }, []);

  const addUserMessage = useCallback((content: string) => {
    const message: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, message]);
    return message;
  }, []);

  const addAssistantMessage = useCallback((content: string, actions: AIAction[] = []) => {
    const message: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content,
      timestamp: Date.now(),
      actions,
      executed: false,
    };
    
    setMessages(prev => [...prev, message]);
    return message;
  }, []);

  const sendUserMessage = useCallback(async (userMessage: string, screenshot?: string) => {
    if (!isAvailable) {
      throw new Error('AI is not available. Please add your Gemini API key.');
    }

    setIsLoading(true);
    
    try {
      // Add user message
      const userMsg = userMessage + (screenshot ? ' 📸' : '');
      addUserMessage(userMsg);

      // Get conversation history
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Update context with recent actions
      const updatedContext: AIContext = {
        ...context,
        recentActions,
      };

      // Send to AI (with optional screenshot)
      const response = await sendMessage(userMessage, updatedContext, history, screenshot);

      // Add assistant response
      addAssistantMessage(response.message, response.actions);

      return response;
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Add error message
      addAssistantMessage(
        'Sorry, I encountered an error. Please check your API key and try again.',
        []
      );
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAvailable, messages, context, recentActions, addUserMessage, addAssistantMessage]);

  const markActionExecuted = useCallback((messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, executed: true, isExecuting: false } : msg
    ));
  }, []);

  const markActionExecuting = useCallback((messageId: string, executing: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isExecuting: executing } : msg
    ));
  }, []);

  const setActionError = useCallback((messageId: string, error: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, error, isExecuting: false } : msg
    ));
  }, []);

  const trackAction = useCallback((action: string) => {
    setRecentActions(prev => [...prev.slice(-9), action]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const getSuggestions = useCallback(() => {
    return getQuickSuggestions(context);
  }, [context]);

  return {
    messages,
    isLoading,
    isAvailable,
    sendMessage: sendUserMessage,
    markActionExecuted,
    markActionExecuting,
    setActionError,
    trackAction,
    clearMessages,
    getSuggestions,
  };
}
