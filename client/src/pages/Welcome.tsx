import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAssessment } from '@/context/AssessmentContext';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { TowerVisualization } from '@/components/TowerVisualization';

export default function Welcome() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { setCurrentUser, setCurrentScreen } = useAssessment();

  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiRequest('POST', '/api/users', userData);
      return response.json();
    },
    onSuccess: (user) => {
      setCurrentUser(user);
      setCurrentScreen('foundation-stones');
    }
  });

  const handleStart = () => {
    if (!email.trim()) {
      alert('Email is required to continue');
      return;
    }

    createUserMutation.mutate({
      email: email.trim(),
      firstName: firstName.trim() || null,
      lastName: lastName.trim() || null,
      startedAt: new Date()
    });
  };

  const towerBlocks = [
    { gradient: 'gradient-1', width: 'w-32', height: 'h-6' },
    { gradient: 'gradient-2', width: 'w-28', height: 'h-6' },
    { gradient: 'gradient-3', width: 'w-24', height: 'h-6' },
    { gradient: 'gradient-4', width: 'w-20', height: 'h-6' },
    { gradient: 'gradient-5', width: 'w-16', height: 'h-6' }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fade-in"
        >
          <h1 className="text-3xl font-bold text-blue-600 mb-4">Inner DNA</h1>
          <p className="text-xl text-gray-600 mb-8">Discover Your Unique Inner DNA</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="mx-auto mb-8 tower-preview">
            <TowerVisualization title="" blocks={towerBlocks} />
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Build your personality tower through intuitive choices and discover your unique Inner DNA profile
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="max-w-md mx-auto mb-8">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-6">Begin Your Journey</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleStart}
            disabled={createUserMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {createUserMutation.isPending ? 'Starting...' : 'Begin Your Journey'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
