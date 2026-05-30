import { useState } from 'react';
import { X, ChevronRight, User, Target, Users } from 'lucide-react';
import { Modal, Button, Input, Select } from '../ui';

const steps = [
  {
    icon: User,
    title: 'What are you looking for?',
    description: 'Tell us your role to personalize your experience.',
    content: ({ formData, setFormData }) => (
      <div className="space-y-4">
        <Select
          label="I am a..."
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          options={[
            { value: 'student', label: 'Student seeking mentorship' },
            { value: 'mentor', label: 'Professional offering mentorship' },
          ]}
        />
      </div>
    ),
  },
  {
    icon: Target,
    title: 'Your skills and goals',
    description: 'Help us match you with the right people.',
    content: ({ formData, setFormData }) => (
      <div className="space-y-4">
        <Input
          label="Your current skills (comma-separated)"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          placeholder="e.g. JavaScript, React, Python"
        />
        <Input
          label="Your career goals"
          value={formData.goals}
          onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
          placeholder="e.g. Become a full-stack developer"
        />
      </div>
    ),
  },
  {
    icon: Users,
    title: 'Your top matches',
    description: 'Based on your profile, here are personalized recommendations.',
    content: ({ formData }) => (
      <div className="text-center py-8">
        <Users size={48} className="mx-auto text-primary-600 mb-4" />
        <p className="text-sm text-slate-600">
          We'll show you {formData.role === 'student' ? 'mentors' : 'mentees'} that match your skills and goals.
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Complete your profile for better matches!
        </p>
      </div>
    ),
  },
];

export default function OnboardingModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    role: 'student',
    skills: '',
    goals: '',
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <Modal isOpen={isOpen} onClose={handleSkip} size="lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <Icon size={20} className="text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{step.title}</h2>
            <p className="text-sm text-slate-600">{step.description}</p>
          </div>
        </div>
        <button
          onClick={handleSkip}
          className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X size={20} className="text-slate-400" />
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full ${
                index <= currentStep ? 'bg-primary-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-slate-500">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      {step.content({ formData, setFormData })}

      <div className="flex justify-between w-full mt-6">
        <Button variant="ghost" onClick={handleSkip}>
          Skip for now
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={currentStep === 0 && !formData.role}
        >
          {currentStep === steps.length - 1 ? 'Get started' : 'Next'}
          <ChevronRight size={16} />
        </Button>
      </div>
    </Modal>
  );
}
