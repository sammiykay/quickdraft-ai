import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Clock, AlertCircle, CheckCircle, Users } from 'lucide-react';
import ToneSelector from './ToneSelector';
import DraftPreview from './DraftPreview';
import { ToneType } from '../App';

interface Template {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  fields: { name: string; placeholder: string; type: 'text' | 'textarea' }[];
  template: string;
}

const templates: Template[] = [
  {
    id: 'meeting-reschedule',
    title: 'Meeting Reschedule',
    category: 'Meetings',
    icon: <Calendar className="w-4 h-4" />,
    fields: [
      { name: 'recipient', placeholder: 'Recipient name', type: 'text' },
      { name: 'meeting', placeholder: 'Meeting topic', type: 'text' },
      { name: 'date', placeholder: 'Original date', type: 'text' },
      { name: 'newDate', placeholder: 'New proposed date', type: 'text' },
    ],
    template: 'Hi {recipient},\n\nI need to reschedule our {meeting} originally planned for {date}. Would {newDate} work better for you?\n\nPlease let me know your availability.\n\nBest regards,'
  },
  {
    id: 'deadline-extension',
    title: 'Deadline Extension Request',
    category: 'Requests',
    icon: <Clock className="w-4 h-4" />,
    fields: [
      { name: 'recipient', placeholder: 'Recipient name', type: 'text' },
      { name: 'project', placeholder: 'Project name', type: 'text' },
      { name: 'deadline', placeholder: 'Current deadline', type: 'text' },
      { name: 'newDeadline', placeholder: 'Requested new deadline', type: 'text' },
      { name: 'reason', placeholder: 'Brief reason', type: 'textarea' },
    ],
    template: 'Dear {recipient},\n\nI am writing to request an extension for {project}, currently due {deadline}. Due to {reason}, I would like to request an extension until {newDeadline}.\n\nI apologize for any inconvenience and appreciate your understanding.\n\nThank you,'
  },
  {
    id: 'follow-up',
    title: 'Follow-up Email',
    category: 'Follow-ups',
    icon: <CheckCircle className="w-4 h-4" />,
    fields: [
      { name: 'recipient', placeholder: 'Recipient name', type: 'text' },
      { name: 'topic', placeholder: 'What you\'re following up on', type: 'text' },
      { name: 'date', placeholder: 'When it was discussed', type: 'text' },
    ],
    template: 'Hi {recipient},\n\nI wanted to follow up on our discussion about {topic} from {date}.\n\nDo you have any updates or next steps you\'d like to share?\n\nLooking forward to hearing from you.\n\nBest,'
  },
  {
    id: 'team-update',
    title: 'Team Update',
    category: 'Updates',
    icon: <Users className="w-4 h-4" />,
    fields: [
      { name: 'project', placeholder: 'Project name', type: 'text' },
      { name: 'progress', placeholder: 'Current progress', type: 'textarea' },
      { name: 'nextSteps', placeholder: 'Next steps', type: 'textarea' },
    ],
    template: 'Team,\n\nHere\'s a quick update on {project}:\n\nProgress: {progress}\n\nNext Steps: {nextSteps}\n\nPlease let me know if you have any questions.\n\nThanks,'
  }
];

const ManualMode: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [tone, setTone] = useState<ToneType>('professional');
  const [draft, setDraft] = useState<string>('');

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setFormData({});
    setDraft('');
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    const newFormData = { ...formData, [fieldName]: value };
    setFormData(newFormData);
    
    // Generate draft in real-time
    if (selectedTemplate) {
      let generatedDraft = selectedTemplate.template;
      selectedTemplate.fields.forEach(field => {
        const value = newFormData[field.name] || `[${field.placeholder}]`;
        generatedDraft = generatedDraft.replace(new RegExp(`{${field.name}}`, 'g'), value);
      });
      setDraft(generatedDraft);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
      >
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-slate-800">Template Library</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {templates.map((template) => (
            <motion.button
              key={template.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTemplateSelect(template)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedTemplate?.id === template.id
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                {template.icon}
                <span className="font-medium text-slate-800">{template.title}</span>
              </div>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {template.category}
              </span>
            </motion.button>
          ))}
        </div>

        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            <div className="border-t pt-4">
              <h3 className="font-medium text-slate-800 mb-3">Fill in the details:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedTemplate.fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-slate-700 mb-1 capitalize">
                      {field.name.replace(/([A-Z])/g, ' $1')}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={formData[field.name] || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        rows={3}
                      />
                    ) : (
                      <input
                        type="text"
                        value={formData[field.name] || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <ToneSelector selectedTone={tone} onToneChange={setTone} />
          </motion.div>
        )}
      </motion.div>
      
      {draft && selectedTemplate && (
        <DraftPreview
          content={draft}
          title={`Template: ${selectedTemplate.title}`}
          mode="manual"
          tone={tone}
        />
      )}
    </div>
  );
};

export default ManualMode;