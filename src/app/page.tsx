'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage,Card, CardContent, ScrollArea } from '@/components/ui';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import ReactMarkdown from 'react-markdown';
import { Flex, Spinner } from '@radix-ui/themes';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

const formSchema = z.object({
  destination: z.string().min(1,{message: 'Cannot be empty'}).max(20,{message: 'Cannot be more than 20 characters'}),
  days: z.string().min(1,{message: 'Cannot be empty'}),
  budget: z.string().min(1,{message: 'Cannot be empty'}),
  interests: z.string().min(1,{message: 'Cannot be empty'}).max(50,{message: 'Interests cannot be more than 50 characters'}),
});


export default function Home() {
  const [messages, setMessages] = useState<string[]>([
    'Hi, I am your AI travel assistant🤖. You can ask me anything about travel in your language! Please click on a location on the map, or enter a city you want to visit, and I will generate travel suggestions for you! ',
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: '',
      days: '',
      budget: '',
      interests: '',
    },
  })
  
  const handleSend = async (prompt: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/agent', {
        method: 'POST',
        body: JSON.stringify(prompt),
      });
      const data = await response.json();
      console.log(data);
      setMessages((prev) => [...prev, data.result]);
    } catch (error) { 
      console.error(error);
      setMessages((prev) => [...prev, 'An error occurred. Please try again later.']);
    } finally{
      setIsLoading(false);
    }
  };
  
  const deleteContent = () => {
    setMessages([
      'Hi, I am your AI travel assistant🤖. You can ask me anything about travel in your language! Please click on a location on the map, or enter a city you want to visit, and I will generate travel suggestions for you! ',
    ]);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航 */}
      <header className="bg-primary text-white p-4 text-xl font-semibold shadow">
        🌏 AI旅游助手
      </header>

      {/* 主区域：地图 + 聊天 */}
      <main className="flex flex-1 flex-col md:flex-row">
        {/* 地图 */}
        <div className="flex-1 p-4">
          <Card className="h-full p-2">
            <Map apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''} />
          </Card>
        </div>

        {/* 聊天助手 */}
        <div className="w-full md:w-[400px] p-4 border border-gray-500 bg-muted flex flex-col m-1 rounded-2xl overflow-y-auto">
          {/* 聊天内容区 */}
          <ScrollArea className="flex-1 bg-gray-200 overflow-y-auto mb-4 rounded-2xl" style={{ maxHeight: '500px' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className="rounded-xl px-4 py-2 max-w-[90%] text-sm whitespace-pre-wrap bg-blue-100 text-left my-2"
              >
                <ReactMarkdown>{msg}</ReactMarkdown>
              </div>
            ))}
          </ScrollArea>
          
          <Card>
            <CardContent>
              <FormProvider {...form}>  
                <form onSubmit={form.handleSubmit(handleSend)} className="space-y-1">
                  <FormField 
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex gap-2'>
                          <FormLabel>Destination</FormLabel>
                          <FormMessage/>
                        </div>
                        <FormControl>
                          <Input placeholder='For example: London, Tokyo, Sydney, etc.' {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField 
                    control={form.control}
                    name="days"
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex gap-2'>
                          <FormLabel>Days</FormLabel>
                          <FormMessage/>
                        </div>
                        <FormControl>
                          <Input 
                            placeholder="For example: 3 days, 5 days, etc." 
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField 
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex gap-2'>
                          <FormLabel>Budget</FormLabel>
                          <FormMessage/>
                        </div>
                        <FormControl>
                          <Input 
                            placeholder="For example: 3000 CNY, 500 USD, etc." 
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField 
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex gap-2'>
                          <FormLabel>Interests</FormLabel>
                          <FormMessage/>
                        </div>
                        <FormControl>
                          <Input placeholder="For example: history, nature, etc." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Flex gap={'2'}>
                    <Button type="submit" className='w-2/3' disabled={isLoading}>
                      {isLoading ? <Flex align={'center'}><div>AI正在思考...</div><Spinner size={"1"}/></Flex> : '发送'}
                    </Button>
                    <Button type='button' onClick={deleteContent} variant={'destructive'} className='w-1/3'>清除AI对话</Button>
                    </Flex>
                </form>
              </FormProvider>
            </CardContent>
          </Card>

        </div>
      </main>

      {/* 底部 */}
      <footer className="text-center text-sm text-muted-foreground py-2 border-t">
        © 2025 AI Travel Assistant
      </footer>
    </div>
  );
}