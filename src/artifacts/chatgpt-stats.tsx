import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDropzone } from 'react-dropzone';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import CountMetricTimeSeries from '@/components/count-metric-time-series';
import ConversationsGroupedTable from '@/components/conversations-grouped-table';

interface ChatGPTMessage {
  id: string;
  author: {
    role: "assistant" | "user" | "system";
    name?: string | null;
  };
  content: {
    content_type: "text";
    parts: string[];
  };
  create_time: number;
}

interface ChatGPTConversation {
  id: string;
  title: string;
  create_time: number;
  update_time: number;
  mapping: {
    [key: string]: {
      id: string;
      message?: ChatGPTMessage;
      parent?: string;
      children: string[];
    };
  };
  current_node: string;
}

interface Metrics {
  totalConversations: number;
  messageCount: number;
  userMessages: number;
  assistantMessages: number;
  averageTurns: number;
  totalUserChars: number;
  totalAssistantChars: number;
  totalUserWords: number;
  totalAssistantWords: number;
  averageUserPromptLength: number;
  averageBotResponseLength: number;
  averageUserWords: number;
  averageAssistantWords: number;
  peakUsageHour: number;
  codeContainingPercentage: number;
  shortConversationsPercentage: number;
  mediumConversationsPercentage: number;
  longConversationsPercentage: number;
}

interface TimeSeriesDataPoint {
  date: string;
  value: number;
  type?: string;
}

interface MessageLengthData {
  userLengths: TimeSeriesDataPoint[];
  botLengths: TimeSeriesDataPoint[];
}

const ChatgptStats = () => {
  const [conversations, setConversations] = useState<ChatGPTConversation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          setConversations(jsonData);
          setError(null);
        } catch (err) {
          setError('Error parsing JSON file. Please make sure it\'s a valid ChatGPT conversations export.');
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json']
    },
    maxFiles: 1
  });

  const getMessageContent = (message: ChatGPTMessage | undefined): string => {
    if (!message) return '';
    
    // Handle different possible content structures
    const content = message.content;
    if (!content) return '';
    
    if (Array.isArray(content.parts)) {
      return content.parts.filter(Boolean).join(' ');
    }
    
    // If parts is undefined but content is a string
    if (typeof content === 'string') {
      return content;
    }
    
    return '';
  };

  const calculateMetrics = (conversations: ChatGPTConversation[]): Metrics => {
    if (!conversations.length) return {} as Metrics;

    // Basic message counts
    let totalMessages = 0;
    let userMessages = 0;
    let assistantMessages = 0;
    let totalUserChars = 0;
    let totalAssistantChars = 0;
    let totalUserWords = 0;
    let totalAssistantWords = 0;
    let codeContainingCount = 0;

    conversations.forEach(conv => {
      const nodes = Object.values(conv.mapping);
      const messagesInConv = nodes.filter(item => item.message).length;
      totalMessages += messagesInConv;

      // Track if this conversation has code
      let hasCode = false;

      nodes.forEach(node => {
        if (!node.message) return;

        const content = getMessageContent(node.message);
        const wordCount = content.trim().split(/\s+/).length;
        
        if (node.message.author.role === 'user') {
          userMessages++;
          totalUserChars += content.length;
          totalUserWords += wordCount;
        } else if (node.message.author.role === 'assistant') {
          assistantMessages++;
          totalAssistantChars += content.length;
          totalAssistantWords += wordCount;
          // Only count code once per conversation and verify there's content between backticks
          if (!hasCode && /```[\s\S]+?```/.test(content)) {
            hasCode = true;
            codeContainingCount++;
          }
        }
      });
    });

    const totalConversations = conversations.length;

    // Calculate conversation length distribution based on user messages only
    const userMessagesPerConversation = conversations.map(conv => 
      Object.values(conv.mapping)
        .filter(item => item.message?.author.role === 'user')
        .length
    );
    
    const shortConvs = userMessagesPerConversation.filter(len => len === 1).length;
    const mediumConvs = userMessagesPerConversation.filter(len => len >= 2 && len <= 3).length;
    const longConvs = userMessagesPerConversation.filter(len => len > 3).length;

    return {
      totalConversations,
      messageCount: totalMessages,
      userMessages,
      assistantMessages,
      averageTurns: totalMessages / totalConversations,
      totalUserChars,
      totalAssistantChars,
      totalUserWords,
      totalAssistantWords,
      averageUserPromptLength: totalUserChars / userMessages,
      averageBotResponseLength: totalAssistantChars / assistantMessages,
      averageUserWords: totalUserWords / userMessages,
      averageAssistantWords: totalAssistantWords / assistantMessages,
      peakUsageHour: calculatePeakUsageHour(conversations),
      codeContainingPercentage: (codeContainingCount / totalConversations) * 100,
      shortConversationsPercentage: (shortConvs / totalConversations) * 100,
      mediumConversationsPercentage: (mediumConvs / totalConversations) * 100,
      longConversationsPercentage: (longConvs / totalConversations) * 100,
    };
  };

  const calculatePeakUsageHour = (conversations: ChatGPTConversation[]): number => {
    const hourCounts = new Array(24).fill(0);
    
    conversations.forEach(conv => {
      Object.values(conv.mapping).forEach(node => {
        if (node.message) {
          const hour = new Date(node.message.create_time * 1000).getHours();
          hourCounts[hour]++;
        }
      });
    });

    return hourCounts.indexOf(Math.max(...hourCounts));
  };

  const generateTimeSeriesData = (conversations: ChatGPTConversation[]): TimeSeriesDataPoint[] => {
    const messagesByDate = new Map<string, number>();

    conversations.forEach(conv => {
      Object.values(conv.mapping).forEach(node => {
        if (node.message) {
          const date = new Date(node.message.create_time * 1000).toISOString().split('T')[0];
          messagesByDate.set(date, (messagesByDate.get(date) || 0) + 1);
        }
      });
    });

    return Array.from(messagesByDate.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const generateHourlyActivityData = (conversations: ChatGPTConversation[]): TimeSeriesDataPoint[] => {
    const hourCounts = new Array(24).fill(0);

    conversations.forEach(conv => {
      Object.values(conv.mapping).forEach(node => {
        if (node.message) {
          const hour = new Date(node.message.create_time * 1000).getHours();
          hourCounts[hour]++;
        }
      });
    });

    return hourCounts.map((value, hour) => ({
      date: new Date(2024, 0, 1, hour).toISOString(),
      value
    }));
  };

  const generateMessageLengthData = (conversations: ChatGPTConversation[]): MessageLengthData => {
    const userLengthsByDate = new Map<string, { total: number; count: number }>();
    const botLengthsByDate = new Map<string, { total: number; count: number }>();

    conversations.forEach(conv => {
      Object.values(conv.mapping).forEach(node => {
        if (!node.message) return;

        const date = new Date(node.message.create_time * 1000).toISOString().split('T')[0];
        const content = getMessageContent(node.message);

        if (node.message.author.role === 'user') {
          const current = userLengthsByDate.get(date) || { total: 0, count: 0 };
          userLengthsByDate.set(date, {
            total: current.total + content.length,
            count: current.count + 1
          });
        } else if (node.message.author.role === 'assistant') {
          const current = botLengthsByDate.get(date) || { total: 0, count: 0 };
          botLengthsByDate.set(date, {
            total: current.total + content.length,
            count: current.count + 1
          });
        }
      });
    });

    const userLengths = Array.from(userLengthsByDate.entries())
      .map(([date, { total, count }]) => ({
        date,
        value: total / count
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const botLengths = Array.from(botLengthsByDate.entries())
      .map(([date, { total, count }]) => ({
        date,
        value: total / count
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return { userLengths, botLengths };
  };

  const metrics = useMemo(() => {
    return calculateMetrics(conversations);
  }, [conversations]);

  const timeSeriesData = useMemo(() => {
    return generateTimeSeriesData(conversations);
  }, [conversations]);

  const hourlyActivityData = useMemo(() => {
    return generateHourlyActivityData(conversations);
  }, [conversations]);

  const messageLengthData = useMemo(() => {
    return generateMessageLengthData(conversations);
  }, [conversations]);

  const transformedGroups = useMemo(() => {
    if (!conversations.length) return [];

    const groupedByDate = conversations.reduce((acc, conv) => {
      const date = new Date(conv.create_time * 1000).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }

      const firstMessage = Object.values(conv.mapping)
        .find(node => node.message?.author.role === 'user')
        ?.message;

      acc[date].push({
        title: conv.title,
        messageCount: Object.values(conv.mapping).filter(node => node.message).length,
        firstMessage: getMessageContent(firstMessage),
        id: conv.id
      });

      return acc;
    }, {} as { [key: string]: Array<{ title: string; messageCount: number; firstMessage: string; id: string }> });

    return Object.entries(groupedByDate)
      .map(([date, conversations]) => ({
        date,
        conversations
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 10);
  }, [conversations]);

  return (
    <div className="w-full max-w-6xl space-y-6">
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle>Analyze your ChatGPT usage, 100% locally</CardTitle>
          <span className="">
            <a href="https://chatgpt.com/#settings/DataControls" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">ChatGPT Data Controls</a> → "Export" → Check email → Unzip for conversations.json
          </span>
        </CardHeader>
        <CardContent>
          <div 
            {...getRootProps()} 
            className={cn(
              "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary"
            )}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the conversations.json file here...</p>
            ) : (
              <p>Drag and drop your conversations.json file here, or click to select file</p>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {metrics && Object.keys(metrics).length > 0 && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalConversations.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.totalConversations > 1000 ? "That's more AI chats than emails in your spam folder! 📬" :
                     metrics.totalConversations > 500 ? "More conversations than your last 10 family reunions combined! 👨‍👩‍👧‍👦" :
                     metrics.totalConversations > 100 ? "More chats than your last dating app adventure! 💘" :
                     "More AI convos than actual phone calls this year! 📱"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Messages per Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.averageTurns.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.averageTurns > 10 ? "Each chat is like a Netflix series - can't stop won't stop! 🎬" :
                     metrics.averageTurns > 6 ? "Like those group chats that never end! 💭" :
                     metrics.averageTurns > 3 ? "The perfect email chain length! 📧" :
                     "Faster than ordering coffee! ⚡"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Words</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(metrics.totalUserWords + metrics.totalAssistantWords).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((metrics.totalUserWords / (metrics.totalUserWords + metrics.totalAssistantWords)) * 100)}% from you, {Math.round((metrics.totalAssistantWords / (metrics.totalUserWords + metrics.totalAssistantWords)) * 100)}% from assistant
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.totalUserWords + metrics.totalAssistantWords > 500000 ? "You've written the entire Lord of the Rings trilogy! 🧙‍♂️" :
                     metrics.totalUserWords + metrics.totalAssistantWords > 100000 ? "That's War and Peace territory! 📚" :
                     metrics.totalUserWords + metrics.totalAssistantWords > 50000 ? "You could fill a Shakespeare play! 🎭" :
                     "Longer than your last 100 emails combined! ✉️"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg User Message Length</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(metrics.averageUserPromptLength).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">characters</p>
                  <p className="text-xs text-muted-foreground">
                    {metrics.averageUserPromptLength > 500 ? "Your texts must be legendary group chat essays! 📱" :
                     metrics.averageUserPromptLength > 280 ? "Your friends probably hate texting you (in a good way)! 😅" :
                     metrics.averageUserPromptLength > 100 ? "More detailed than your average text! 💬" :
                     "Shorter than your friend's 'k' responses! 🤏"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Assistant Response Length</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(metrics.averageBotResponseLength).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">characters</p>
                  <p className="text-xs text-muted-foreground">
                    {metrics.averageBotResponseLength > 1000 ? "AI thinks it's writing your biography! 📖" :
                     metrics.averageBotResponseLength > 500 ? "Like that friend who never stops talking! 🗣️" :
                     metrics.averageBotResponseLength > 200 ? "More words than your last work email! 💼" :
                     "Surprisingly concise for an AI! 🎯"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversation Length Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Quick Chats (1-2)</span>
                      <span className="text-sm font-medium">{Math.round(metrics.shortConversationsPercentage)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Deep Dives (3-5)</span>
                      <span className="text-sm font-medium">{Math.round(metrics.mediumConversationsPercentage)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Marathon Sessions (6+)</span>
                      <span className="text-sm font-medium">{Math.round(metrics.longConversationsPercentage)}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {metrics.longConversationsPercentage > 50 ? "You love a good debate! 🎭" :
                     metrics.mediumConversationsPercentage > 50 ? "Balanced conversationalist! ⚖️" :
                     "Quick problem solver! 🚀"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Code-Containing Chats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(metrics.codeContainingPercentage)}%</div>
                  <p className="text-xs text-muted-foreground mt-1">of all conversations</p>
                  <p className="text-xs text-muted-foreground">
                    {metrics.codeContainingPercentage > 75 ? "Basically Stack Overflow 2.0! 💻" :
                     metrics.codeContainingPercentage > 50 ? "Half developer, half explorer! 🔍" :
                     metrics.codeContainingPercentage > 25 ? "Casual coder! 👨‍💻" :
                     "More talk than code! 💬"}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {metrics && Object.keys(metrics).length > 0 && (
        <>
          <div className="mt-8 space-y-6">
            <CountMetricTimeSeries
              title={`${
                timeSeriesData.length === 0 ? "Just getting started! 🌱" :
                timeSeriesData[timeSeriesData.length - 1].value > timeSeriesData[0].value * 2 ? "AI Addiction Level: Exponential! 📈" :
                timeSeriesData[timeSeriesData.length - 1].value > timeSeriesData[0].value ? "The AI Obsession Grows! 🚀" :
                timeSeriesData[timeSeriesData.length - 1].value < timeSeriesData[0].value * 0.5 ? "Breaking Free from AI? 🤔" :
                "Steady AI Companionship 🤝"
              }`}
              description="Number of messages exchanged per time period"
              data={timeSeriesData}
              defaultAggregation="monthly"
            />

            <CountMetricTimeSeries
              title={` ${
                metrics.peakUsageHour < 5 ? "Burning the midnight oil with AI! 🌙" :
                metrics.peakUsageHour < 9 ? "Rise and shine with ChatGPT! ☀️" :
                metrics.peakUsageHour < 12 ? "Morning productivity peak! ⚡" :
                metrics.peakUsageHour < 14 ? "Lunch break brainstorming? 🥪" :
                metrics.peakUsageHour < 18 ? "Afternoon creativity flowing! 💭" :
                metrics.peakUsageHour < 22 ? "Evening thoughts with AI! 🌆" :
                "Night owl mode activated! 🦉"
              }`}
              description="Busiest time of day"
              data={hourlyActivityData}
              xAxisLabel="Hour"
              yAxisLabel="Message Count"
              valueFormatter={(value) => value.toString()}
              customDateFormatter={(date) => {
                const hour = new Date(date).getHours();
                return hour === 0 ? '12 AM' : 
                       hour < 12 ? `${hour} AM` : 
                       hour === 12 ? '12 PM' : 
                       `${hour - 12} PM`;
              }}
              defaultAggregation="daily"
              hideAggregation
            />

            <CountMetricTimeSeries
              title={`${
                Math.max(...messageLengthData.userLengths.map(d => d.value)) > 1000 ? "Novel Writer vs AI Novelist! 📚" :
                Math.max(...messageLengthData.userLengths.map(d => d.value)) > 500 ? "The Great AI Essay Exchange! ✍️" :
                Math.max(...messageLengthData.userLengths.map(d => d.value)) > 200 ? "Chatty Humans, Chattier AI! 💬" :
                "Short & Sweet Conversations 🍬"
              }`}
              description="Average message length for users and assistant"
              data={[
                ...(messageLengthData.userLengths || []).map(d => ({ ...d, type: 'user' })),
                ...(messageLengthData.botLengths || []).map(d => ({ ...d, type: 'assistant' }))
              ]}
              xAxisLabel="Date"
              yAxisLabel="Characters"
              valueFormatter={(value) => `${Math.round(value)} chars`}
              categories={['user', 'assistant']}
              showLegend
              defaultAggregation="monthly"
            />
          </div>
          
          <Card className="mt-8 border-0 shadow-none">
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <ConversationsGroupedTable conversationGroups={transformedGroups} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ChatgptStats;