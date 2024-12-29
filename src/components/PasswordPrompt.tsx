import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useToast } from './ui/use-toast';

interface PasswordPromptProps {
    onSuccess: () => void;
}

export function PasswordPrompt({ onSuccess }: PasswordPromptProps) {
    const [password, setPassword] = useState('');
    const { toast } = useToast();
    const correctPassword = import.meta.env.VITE_SETTINGS_PASSWORD || 'admin'; // Default password is 'admin'

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === correctPassword) {
            onSuccess();
            // Store in session storage so the user doesn't need to enter password again during this session
            sessionStorage.setItem('settingsAuthenticated', 'true');
        } else {
            toast({
                title: "Incorrect Password",
                description: "Please try again.",
                variant: "destructive",
            });
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Settings Access</CardTitle>
                    <CardDescription>Please enter the password to access settings</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full"
                        />
                        <Button type="submit" className="w-full">
                            Submit
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
