import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Heart, Sparkles, Shield, Zap, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AIService } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const WarriorAskCellaPage = ({ onBack }: { onBack?: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [question, setQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      id: '1',
      question: 'How can I manage pain during a crisis?',
      answer: 'During a pain crisis, try heat therapy, gentle stretching, and stay hydrated. Contact your healthcare team if pain persists.',
      timestamp: '2 hours ago',
      type: 'crisis' as const
    },
    {
      id: '2', 
      question: 'Best foods for sickle cell?',
      answer: 'Focus on iron-rich foods like spinach, lean meats, and legumes. Avoid foods high in saturated fats.',
      timestamp: 'Yesterday',
      type: 'general' as const
    }
  ]);

  const handleAskQuestion = async () => {
    if (!question.trim() || !user?.id) return;

    setIsLoading(true);
    try {
      const response = await AIService.askCella(user.id, question, 'question');
      
      const newChat = {
        id: Date.now().toString(),
        question: question,
        answer: response,
        timestamp: 'Just now',
        type: 'general' as const
      };
      
      setChatHistory([newChat, ...chatHistory]);
      setCurrentAnswer(response);
      setQuestion('');
      
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
    { text: "Pain management tips?", icon: Shield, color: "from-red-500 to-pink-500" },
    { text: "Hydration goals?", icon: Heart, color: "from-blue-500 to-cyan-500" },
    { text: "Exercise safety?", icon: Zap, color: "from-green-500 to-emerald-500" },
    { text: "Medication timing?", icon: Clock, color: "from-purple-500 to-pink-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-brand-red to-pink-500 rounded-full p-6 shadow-xl">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Ask Cella</h1>
          <p className="text-xl text-gray-600">Your AI health companion</p>
        </div>

        {/* Chat Input */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-red to-pink-500 h-2"></div>
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask me anything about your health..."
                className="flex-1 text-lg py-6 border-2 focus:border-brand-red"
                onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
              />
              <Button
                onClick={handleAskQuestion}
                disabled={!question.trim() || isLoading}
                size="lg"
                className="bg-gradient-to-r from-brand-red to-pink-500 hover:from-brand-red/90 hover:to-pink-500/90 px-8"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Questions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickQuestions.map((q, index) => {
            const Icon = q.icon;
            return (
              <Card 
                key={index} 
                className="cursor-pointer shadow-lg border-0 hover:shadow-xl transition-all duration-300 group overflow-hidden"
                onClick={() => setQuestion(q.text)}
              >
                <div className={`h-1 bg-gradient-to-r ${q.color}`}></div>
                <CardContent className="p-4 text-center">
                  <div className={`bg-gradient-to-r ${q.color} rounded-full p-3 w-fit mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-medium text-gray-900">{q.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Current Answer */}
        {currentAnswer && (
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-brand-red to-pink-500 rounded-full p-3 flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">Cella's Response</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{currentAnswer}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat History */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Recent Conversations</h2>
          {chatHistory.map((chat) => (
            <Card key={chat.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{chat.question}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{chat.type}</Badge>
                      <span className="text-sm text-gray-500">{chat.timestamp}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{chat.answer}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Notice */}
        <Card className="border-2 border-red-200 bg-red-50 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="font-bold text-red-800 mb-2">Emergency Reminder</h3>
            <p className="text-red-700">
              If you're experiencing severe pain or symptoms, contact your healthcare provider immediately or call emergency services.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WarriorAskCellaPage;