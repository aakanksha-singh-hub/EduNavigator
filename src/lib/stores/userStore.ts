import { create } from 'zustand';
import { 
  UserProfile, 
  CareerRecommendation, 
  UserStore, 
  EnhancedUserProfile,
  ProgressData,
  Achievement,
  StreakData,
  ChatConversation,
  ChatMessage,
  ResumeVersion
} from '../types';

// Helper functions for localStorage persistence
const getStoredData = () => {
  try {
    const stored = localStorage.getItem('career-mentor-store');
    const parsed = stored ? JSON.parse(stored) : {};
    console.log('Retrieved data from localStorage:', parsed);
    return parsed;
  } catch (error) {
    console.error('Failed to retrieve from localStorage:', error);
    return {};
  }
};

const setStoredData = (data: any) => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem('career-mentor-store', serialized);
    console.log('Saved data to localStorage:', data);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const initialData = getStoredData();

export const useUserStore = create<UserStore>((set, get) => ({
      // Basic profile data
      profile: initialData.profile || null,
      enhancedProfile: initialData.enhancedProfile || null,
      results: initialData.results || null,
      
      // Chat data
      currentConversation: null,
      conversations: initialData.conversations || [],
      
      // Resume versions
      resumeVersions: initialData.resumeVersions || [],
      
      // Basic actions
      setProfile: (profile: UserProfile) => {
        set({ profile });
        const currentState = get();
        setStoredData({ ...currentState, profile });
      },
      
      setEnhancedProfile: (profile: EnhancedUserProfile) => {
        console.log('Setting enhanced profile in store:', profile);
        set({ enhancedProfile: profile });
        const currentState = get();
        setStoredData({ ...currentState, enhancedProfile: profile });
        console.log('Enhanced profile saved to store and localStorage');
      },
      
      setResults: (results: CareerRecommendation) => {
        set({ results });
        const currentState = get();
        setStoredData({ ...currentState, results });
      },
      
      // Progress tracking actions
      updateProgress: (progress: Partial<ProgressData>) => {
        const { enhancedProfile } = get();
        if (enhancedProfile) {
          set({
            enhancedProfile: {
              ...enhancedProfile,
              progressData: {
                ...enhancedProfile.progressData,
                ...progress,
                lastUpdated: new Date()
              },
              updatedAt: new Date()
            }
          });
        }
      },
      
      addAchievement: (achievement: Achievement) => {
        const { enhancedProfile } = get();
        if (enhancedProfile) {
          set({
            enhancedProfile: {
              ...enhancedProfile,
              achievements: [...enhancedProfile.achievements, achievement],
              experiencePoints: enhancedProfile.experiencePoints + achievement.experiencePoints,
              updatedAt: new Date()
            }
          });
        }
      },
      
      updateStreak: (streakData: StreakData) => {
        const { enhancedProfile } = get();
        if (enhancedProfile) {
          set({
            enhancedProfile: {
              ...enhancedProfile,
              streaks: streakData,
              updatedAt: new Date()
            }
          });
        }
      },
      
      // Chatbot actions
      setCurrentConversation: (conversation: ChatConversation | null) =>
        set({ currentConversation: conversation }),
      
      addMessage: (conversationId: string, message: ChatMessage) => {
        const { conversations, currentConversation } = get();
        
        // Update conversations array
        const updatedConversations = conversations.map(conv => 
          conv.id === conversationId 
            ? { ...conv, messages: [...conv.messages, message], updatedAt: new Date() }
            : conv
        );
        
        // Update current conversation if it matches
        const updatedCurrentConversation = currentConversation?.id === conversationId
          ? { ...currentConversation, messages: [...currentConversation.messages, message], updatedAt: new Date() }
          : currentConversation;
        
        set({ 
          conversations: updatedConversations,
          currentConversation: updatedCurrentConversation
        });
      },
      
      createConversation: (title: string): ChatConversation => {
        const { enhancedProfile } = get();
        const newConversation: ChatConversation = {
          id: `conv_${Date.now()}`,
          title,
          messages: [],
          context: {
            userProfile: enhancedProfile!,
            currentTopic: 'general',
            recentActions: [],
            relevantData: {},
            conversationGoals: []
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true
        };
        
        set(state => ({
          conversations: [...state.conversations, newConversation],
          currentConversation: newConversation
        }));
        
        return newConversation;
      },
      
      // Resume actions
      addResumeVersion: (version: ResumeVersion) => {
        set(state => ({
          resumeVersions: [...state.resumeVersions, version]
        }));
      },
      
      updateResumeVersion: (id: string, updates: Partial<ResumeVersion>) => {
        set(state => ({
          resumeVersions: state.resumeVersions.map(version =>
            version.id === id ? { ...version, ...updates } : version
          )
        }));
      },
      
      setActiveResumeVersion: (id: string) => {
        set(state => ({
          resumeVersions: state.resumeVersions.map(version => ({
            ...version,
            isActive: version.id === id
          }))
        }));
      },
      
      // Utility actions
      clearData: () => {
        const clearedState = { 
          profile: null, 
          enhancedProfile: null,
          results: null,
          currentConversation: null,
          conversations: [],
          resumeVersions: []
        };
        set(clearedState);
        setStoredData(clearedState);
      },
      
      exportData: (): string => {
        const state = get();
        const exportData = {
          profile: state.profile,
          enhancedProfile: state.enhancedProfile,
          results: state.results,
          conversations: state.conversations,
          resumeVersions: state.resumeVersions,
          exportedAt: new Date().toISOString(),
          version: '1.0'
        };
        return JSON.stringify(exportData, null, 2);
      },
      
      importData: (data: string): void => {
        try {
          const importedData = JSON.parse(data);
          set({
            profile: importedData.profile || null,
            enhancedProfile: importedData.enhancedProfile || null,
            results: importedData.results || null,
            conversations: importedData.conversations || [],
            resumeVersions: importedData.resumeVersions || [],
            currentConversation: null
          });
        } catch (error) {
          console.error('Error importing data:', error);
          throw new Error('Invalid data format');
        }
      }
    }));
