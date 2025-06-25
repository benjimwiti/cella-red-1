
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, AlertTriangle, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AIService } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

const AskCellaPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [question, setQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data: chatHistory = [] } = useQuery({
    queryKey: ['chat-history', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await AIService.getChatHistory(user.id, 10);
    },
    enabled: !!user?.id,
  });

  const handleAskQuestion = async (messageType: 'question' | 'emergency' | 'general' = 'question') => {
    if (!question.trim() || !user?.id) return;

    setIsLoading(true);
    try {
      const response = await AIService.askCella(user.id, question, messageType);
      setCurrentAnswer(response);
      setQuestion('');
      
      // Refresh chat history
      // queryClient.invalidateQueries(['chat-history', user.id]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from Cella. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "How can I prevent pain crises?",
    "What foods should I avoid?",
    "How much water should I drink daily?",
    "When should I call my doctor?",
    "What are good exercises for me?",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-cella-rose-light to-white">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-cella-rose rounded-full p-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ask Cella</h1>
          <p className="text-cella-grey">Your AI companion for sickle cell health guidance</p>
        </div>

        {/* Emergency Alert */}
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              <div className="text-sm">
                <strong>Emergency?</strong> Call 911 or go to the nearest ER immediately if you're having a severe crisis.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Answer */}
        {currentAnswer && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="bg-cella-rose rounded-full p-2 flex-shrink-0">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-cella-rose mb-2">Cella's Response:</div>
                  <div className="text-gray-700 leading-relaxed">{currentAnswer}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Question Input */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask me about sickle cell health, pain management, lifestyle tips..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                />
                <Button
                  onClick={() => handleAskQuestion()}
                  disabled={!question.trim() || isLoading}
                  className="bg-cella-rose hover:bg-cella-rose-dark"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAskQuestion('emergency')}
                  disabled={!question.trim() || isLoading}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Emergency
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAskQuestion('general')}
                  disabled={!question.trim() || isLoading}
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  General
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Questions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Quick Questions</h3>
            <div className="space-y-2">
              {quickQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => setQuestion(q)}
                  className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Chat History */}
        {chatHistory.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Recent Conversations</h3>
              <div className="space-y-3">
                {chatHistory.slice(0, 3).map((chat) => (
                  <div key={chat.id} className="border-l-4 border-cella-rose-light pl-4">
                    <div className="text-sm text-gray-600 mb-1">{chat.message}</div>
                    <div className="text-xs text-cella-grey flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {chat.message_type}
                      </Badge>
                      {new Date(chat.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 text-center">
              <strong>Medical Disclaimer:</strong> Cella provides general health information and support. 
              Always consult with your healthcare provider for medical advice, diagnosis, or treatment decisions.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AskCellaPage;
