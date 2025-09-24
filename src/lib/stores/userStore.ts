import { create } from 'zustand';
import { UserProfile, CareerRecommendation, UserStore } from '../types';

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  results: null,
  
  setProfile: (profile: UserProfile) => 
    set({ profile }),
  
  setResults: (results: CareerRecommendation) => 
    set({ results }),
  
  clearData: () => 
    set({ profile: null, results: null }),
}));
