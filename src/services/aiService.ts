
import { supabase } from '@/integrations/supabase/client';
import { ChatLog } from '@/types/health';

export class AIService {
  static async askCella(userId: string, question: string, messageType: 'question' | 'emergency' | 'general' = 'question') {
    try {
      // Call the Edge Function for AI processing
      const { data, error } = await supabase.functions.invoke('ask-cella', {
        body: {
          userId,
          question,
          messageType
        }
      });

      if (error) throw error;

      // Log the conversation
      await this.logChat(userId, question, data.response, messageType);

      return data.response;
    } catch (error) {
      console.error('Error asking Cella:', error);
      throw error;
    }
  }

  static async logChat(userId: string, message: string, response: string, messageType: 'question' | 'emergency' | 'general') {
    const { data, error } = await supabase
      .from('chat_logs')
      .insert({
        user_id: userId,
        message,
        response,
        message_type: messageType
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getChatHistory(userId: string, limit: number = 20) {
    const { data, error } = await supabase
      .from('chat_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as ChatLog[];
  }
}
