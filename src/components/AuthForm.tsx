import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

interface AuthFormProps {
  onAuthSuccess: (user: User) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Состояние для формы входа
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  
  // Состояние для формы регистрации
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Функции для работы с localStorage
  const saveUser = (user: User) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('messenger_users', JSON.stringify(users));
  };

  const getUsers = (): User[] => {
    const users = localStorage.getItem('messenger_users');
    return users ? JSON.parse(users) : [];
  };

  const findUser = (username: string, password: string): User | null => {
    const users = getUsers();
    return users.find(user => user.username === username && password === 'password') || null;
  };

  const validateLogin = () => {
    const newErrors: Record<string, string> = {};
    
    if (!loginData.username.trim()) {
      newErrors.username = 'Введите имя пользователя';
    }
    
    if (!loginData.password.trim()) {
      newErrors.password = 'Введите пароль';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegistration = () => {
    const newErrors: Record<string, string> = {};
    const users = getUsers();
    
    if (!registerData.username.trim()) {
      newErrors.username = 'Введите имя пользователя';
    } else if (users.some(user => user.username === registerData.username)) {
      newErrors.username = 'Пользователь с таким именем уже существует';
    }
    
    if (!registerData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = 'Введите корректный email';
    } else if (users.some(user => user.email === registerData.email)) {
      newErrors.email = 'Пользователь с таким email уже существует';
    }
    
    if (!registerData.firstName.trim()) {
      newErrors.firstName = 'Введите имя';
    }
    
    if (!registerData.lastName.trim()) {
      newErrors.lastName = 'Введите фамилию';
    }
    
    if (!registerData.password.trim()) {
      newErrors.password = 'Введите пароль';
    } else if (registerData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLogin()) return;
    
    setLoading(true);
    
    // Симуляция запроса
    setTimeout(() => {
      const user = findUser(loginData.username, loginData.password);
      
      if (user) {
        onAuthSuccess(user);
      } else {
        setErrors({ general: 'Неверное имя пользователя или пароль' });
      }
      
      setLoading(false);
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegistration()) return;
    
    setLoading(true);
    
    // Симуляция запроса
    setTimeout(() => {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username: registerData.username,
        email: registerData.email,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        createdAt: new Date()
      };
      
      saveUser(newUser);
      onAuthSuccess(newUser);
      setLoading(false);
    }, 1000);
  };

  const handleDemoLogin = () => {
    const demoUser: User = {
      id: 'demo',
      username: 'demo_user',
      email: 'demo@example.com',
      firstName: 'Демо',
      lastName: 'Пользователь',
      createdAt: new Date()
    };
    onAuthSuccess(demoUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Avatar className="w-16 h-16 mx-auto mb-4">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              VK
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold text-foreground">VK Мессенджер</h1>
          <p className="text-muted-foreground mt-2">
            Войдите или создайте новый аккаунт
          </p>
        </div>

        <Card className="bg-card">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Добро пожаловать</CardTitle>
            <CardDescription>
              Войдите в свой аккаунт или зарегистрируйтесь
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => {
              setActiveTab(value as 'login' | 'register');
              setErrors({});
            }}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>
              
              {/* Форма входа */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Имя пользователя</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="Введите имя пользователя"
                      value={loginData.username}
                      onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                      className={errors.username ? 'border-destructive' : ''}
                    />
                    {errors.username && (
                      <p className="text-sm text-destructive">{errors.username}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Пароль</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Введите пароль"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      className={errors.password ? 'border-destructive' : ''}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>

                  {errors.general && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                      <p className="text-sm text-destructive">{errors.general}</p>
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                        Вход...
                      </>
                    ) : (
                      'Войти'
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              {/* Форма регистрации */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Имя</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Имя"
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                        className={errors.firstName ? 'border-destructive' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-destructive">{errors.firstName}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Фамилия</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Фамилия"
                        value={registerData.lastName}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                        className={errors.lastName ? 'border-destructive' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-xs text-destructive">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-username">Имя пользователя</Label>
                    <Input
                      id="register-username"
                      type="text"
                      placeholder="Выберите имя пользователя"
                      value={registerData.username}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                      className={errors.username ? 'border-destructive' : ''}
                    />
                    {errors.username && (
                      <p className="text-sm text-destructive">{errors.username}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Пароль</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Минимум 6 символов"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      className={errors.password ? 'border-destructive' : ''}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Повторите пароль</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Повторите пароль"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={errors.confirmPassword ? 'border-destructive' : ''}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                        Регистрация...
                      </>
                    ) : (
                      'Зарегистрироваться'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleDemoLogin}
              >
                <Icon name="Zap" size={16} className="mr-2" />
                Демо вход
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-4">
          💾 Аккаунты сохраняются локально в браузере
        </p>
      </div>
    </div>
  );
};

export default AuthForm;