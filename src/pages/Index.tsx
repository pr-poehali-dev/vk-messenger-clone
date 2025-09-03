import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import AuthForm from '@/components/AuthForm';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other' | 'bot';
  timestamp: Date;
  senderName?: string;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
  type: 'chat' | 'group' | 'channel' | 'bot';
  isOnline?: boolean;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState('chats');
  const [activeChat, setActiveChat] = useState<string | null>('1');
  const [messageText, setMessageText] = useState('');

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('current_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('current_user');
  };

  // Если пользователь не авторизован, показываем форму входа
  if (!user) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }
  
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Анна Петрова',
      lastMessage: 'Привет! Как дела?',
      timestamp: '14:30',
      unread: 2,
      avatar: '/api/placeholder/32/32',
      type: 'chat',
      isOnline: true
    },
    {
      id: '2',
      name: 'Чат-бот Помощник',
      lastMessage: 'Чем могу помочь?',
      timestamp: '13:15',
      unread: 0,
      avatar: '/api/placeholder/32/32',
      type: 'bot',
      isOnline: true
    },
    {
      id: '3',
      name: 'Группа разработчиков',
      lastMessage: 'Обсуждение нового проекта',
      timestamp: '12:45',
      unread: 5,
      avatar: '/api/placeholder/32/32',
      type: 'group'
    },
    {
      id: '4',
      name: 'Канал Новости IT',
      lastMessage: 'Новости о React 19',
      timestamp: '10:20',
      unread: 12,
      avatar: '/api/placeholder/32/32',
      type: 'channel'
    }
  ]);

  const [messages] = useState<Message[]>([
    {
      id: '1',
      text: 'Привет! Как дела?',
      sender: 'other',
      timestamp: new Date(),
      senderName: 'Анна Петрова'
    },
    {
      id: '2',
      text: 'Отлично! Работаю над новым проектом',
      sender: 'me',
      timestamp: new Date()
    },
    {
      id: '3',
      text: 'Звучит интересно! Расскажи подробнее',
      sender: 'other',
      timestamp: new Date(),
      senderName: 'Анна Петрова'
    }
  ]);

  const botQuickReplies = [
    'Помощь',
    'Статистика',
    'Настройки',
    'FAQ'
  ];

  const sidebarSections = [
    { id: 'chats', name: 'Чаты', icon: 'MessageCircle' },
    { id: 'contacts', name: 'Контакты', icon: 'Users' },
    { id: 'groups', name: 'Группы', icon: 'Users2' },
    { id: 'channels', name: 'Каналы', icon: 'Radio' },
    { id: 'settings', name: 'Настройки', icon: 'Settings' }
  ];

  const filteredChats = chats.filter(chat => {
    if (activeSection === 'chats') return chat.type === 'chat' || chat.type === 'bot';
    if (activeSection === 'groups') return chat.type === 'group';
    if (activeSection === 'channels') return chat.type === 'channel';
    return true;
  });

  const sendMessage = () => {
    if (messageText.trim()) {
      // Логика отправки сообщения
      setMessageText('');
    }
  };

  const handleQuickReply = (reply: string) => {
    setMessageText(reply);
  };

  return (
    <div className="h-screen bg-background dark flex">
      {/* Боковая панель навигации */}
      <div className="w-16 bg-card border-r border-border flex flex-col items-center py-4">
        <div className="mb-8 group relative">
          <Avatar className="w-8 h-8 cursor-pointer">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {user.firstName[0]}{user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          
          {/* Меню пользователя */}
          <div className="absolute left-full ml-2 top-0 bg-popover border border-border rounded-md py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 min-w-[200px]">
            <div className="text-sm font-medium text-popover-foreground mb-1">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-xs text-muted-foreground mb-3">
              @{user.username}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-xs h-8"
              onClick={handleLogout}
            >
              <Icon name="LogOut" size={14} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          {sidebarSections.map(section => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "ghost"}
              size="sm"
              className="w-10 h-10 p-0"
              onClick={() => setActiveSection(section.id)}
            >
              <Icon name={section.icon as any} size={20} />
            </Button>
          ))}
        </div>
      </div>

      {/* Панель чатов */}
      <div className="w-80 bg-card border-r border-border flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {sidebarSections.find(s => s.id === activeSection)?.name}
            </h2>
            <Button variant="ghost" size="sm">
              <Icon name="Search" size={16} />
            </Button>
          </div>
        </CardHeader>
        
        <ScrollArea className="flex-1">
          <div className="px-4 pb-4">
            {filteredChats.map(chat => (
              <div
                key={chat.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                  activeChat === chat.id ? 'bg-accent' : ''
                } mb-2`}
                onClick={() => setActiveChat(chat.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback>{chat.name[0]}</AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center truncate">
                        <span className="font-medium text-sm truncate">
                          {chat.name}
                        </span>
                        {chat.type === 'bot' && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            БОТ
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {chat.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && (
                        <Badge variant="default" className="ml-2 text-xs min-w-[20px] h-5 flex items-center justify-center">
                          {chat.unread > 99 ? '99+' : chat.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Основная область чата */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Заголовок чата */}
            <div className="border-b border-border p-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={chats.find(c => c.id === activeChat)?.avatar} />
                  <AvatarFallback>{chats.find(c => c.id === activeChat)?.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{chats.find(c => c.id === activeChat)?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {chats.find(c => c.id === activeChat)?.isOnline ? 'в сети' : 'был(а) недавно'}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Icon name="Phone" size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icon name="Video" size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icon name="MoreVertical" size={16} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Область сообщений */}
            <ScrollArea className="flex-1 px-4 py-4">
              <div className="space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex items-end gap-2 ${
                      message.sender === 'me' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.sender !== 'me' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{message.senderName?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender === 'me'
                          ? 'bg-primary text-primary-foreground'
                          : message.sender === 'bot'
                          ? 'bg-secondary text-secondary-foreground border'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Быстрые ответы для ботов */}
            {chats.find(c => c.id === activeChat)?.type === 'bot' && (
              <div className="px-4 py-2 border-t border-border">
                <div className="flex gap-2 flex-wrap">
                  {botQuickReplies.map(reply => (
                    <Button
                      key={reply}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Поле ввода сообщения */}
            <div className="border-t border-border p-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Icon name="Paperclip" size={16} />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Написать сообщение..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="pr-10"
                  />
                  <Button
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={sendMessage}
                  >
                    <Icon name="Send" size={14} />
                  </Button>
                </div>
                <Button variant="ghost" size="sm">
                  <Icon name="Mic" size={16} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Icon name="MessageSquare" size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Выберите чат</p>
              <p className="text-sm">Выберите чат из списка, чтобы начать общение</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;