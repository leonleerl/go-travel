'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage,Card, CardContent, ScrollArea } from '@/components/ui';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"

const Map = dynamic(() => import('../components/Map'), { ssr: false });

const formSchema = z.object({
  destination: z.string().min(1,{message: '目的地不能为空'}).max(20,{message: '目的地不能超过20个字符'}),
  days: z.string().min(1,{message: '旅行天数不能为空'}),
  budget: z.string().min(1,{message: '预算不能为空'}),
  interests: z.string().min(1,{message: '兴趣不能为空'}).max(50,{message: '兴趣不能超过50个字符'}),
});


export default function Home() {
  const [messages, setMessages] = useState<string[]>([
    '你好！我是你的AI旅游助手，请在地图上点击地点，或输入想去的城市，我来为你生成旅行建议！',
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: '',
      days: '',
      budget: '',
      interests: '',
    },
  })
  
  const handleSend = (data: z.infer<typeof formSchema>) => {
    // if (!input.trim()) return;
    // setMessages((prev) => [...prev, input]);
    // setInput('');
    console.log(data);
    // TODO: 你可以在这里调用 OpenAI API
  };

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
        <div className="w-full md:w-[400px] p-4 border border-gray-500 bg-muted flex flex-col m-1 rounded-2xl">
          {/* 聊天内容区 */}
          <ScrollArea className="flex-1 pr-2 space-y-3 bg-amber-100">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`rounded-xl px-4 py-2 max-w-[90%] text-sm whitespace-pre-wrap ${
                  idx % 2 === 0
                    ? 'bg-blue-100 text-left'
                    : 'bg-green-100 text-right self-end'
                }`}
              >
                {msg}
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
                          <FormLabel>目的地</FormLabel>
                          <FormMessage/>
                        </div>
                        <FormControl>
                          <Input placeholder='输入目的地...' {...field} />
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
                          <FormLabel>旅行天数</FormLabel>
                          <FormMessage/>
                        </div>
                        <FormControl>
                          <Input 
                            placeholder="输入天数..." 
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
                          <FormLabel>预算（例如 3000人民币）</FormLabel>
                          <FormMessage/>
                        </div>
                        <FormControl>
                          <Input 
                            placeholder="输入预算..." 
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
                          <FormLabel>兴趣（历史、自然等）</FormLabel>
                          <FormMessage/>
                        </div>
                        <FormControl>
                          <Input placeholder="输入兴趣..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">发送</Button>
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