'use client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';

import { sigin } from '@/actions/auth';
import { Input } from '@/components/ui/input';

import { signInFormSchema } from '@/schemas/auth';
import { LogIn } from 'lucide-react';
import { useActionState } from 'react';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

export default function LoginForm() {
  const [state, action] = useActionState(sigin, undefined);

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { login: '', password: '' },
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Добро пожаловать</CardTitle>
          <CardDescription>
            Войдите в аккаунт чтобы использовать все функции панели управления
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={action} className="space-y-4">
              <FormField
                control={form.control}
                name="login"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Логин</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={form.formState.isSubmitting}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Войти
              </Button>
              {!state?.success && <p>{state?.message}</p>}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
