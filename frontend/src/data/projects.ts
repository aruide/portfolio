import type { Project } from '@/types';

export const projectsData: Project[] = [
  {
    title: 'Système de Reconnaissance Faciale',
    description:
      'IA avancée utilisant des réseaux de neurones convolutionnels pour la détection et reconnaissance faciale en temps réel.',
    tech: ['Python', 'OpenCV', 'TensorFlow', 'Keras'],
    image: 'Advanced facial recognition system with real-time detection capabilities',
  },
  {
    title: 'Chatbot Conversationnel',
    description:
      'Assistant IA intelligent basé sur des transformers pour des conversations naturelles et contextuelles.',
    tech: ['NLP', 'Transformers', 'BERT', 'Flask'],
    image: 'Modern AI chatbot interface with natural language processing',
  },
  {
    title: 'Prédiction de Marché',
    description:
      "Modèle prédictif utilisant l'apprentissage automatique pour analyser les tendances financières.",
    tech: ['Pandas', 'Scikit-learn', 'LSTM', 'Plotly'],
    image: 'Financial market prediction dashboard with AI analytics',
  },
];
