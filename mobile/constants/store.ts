export interface TrustedPerson {
  id: string;
  name: string;
  role: string;
  phone: string;
  availability: 'Available' | 'Busy' | 'Offline';
  isVerified: boolean;
  relationship?: string;
  trustScore: number;
}

export interface RequestItem {
  id: string;
  category: string;
  title: string;
  status: string;
  time: string;
  helperName?: string;
  helperPhone?: string;
  rating?: number;
}

class GlobalStore {
  private language: 'hi' | 'en' = 'hi';
  private listeners: Set<() => void> = new Set();

  private profile = {
    name: 'Shanti Devi (शांति देवी)',
    age: 68,
    phone: '+91 98765 43210',
    address: 'Plot No. 12, Sector 3, Vaishali Nagar, Jaipur (जयपुर)',
    emergencyContactName: 'Kiran (किरण - Daughter)',
    emergencyContactPhone: '+91 99887 76655',
  };

  private trustedPeople: TrustedPerson[] = [
    {
      id: '1',
      name: 'Amit Sharma (अमित शर्मा)',
      role: 'Neighbour (पड़ोसी)',
      phone: '+91 98290 12345',
      availability: 'Available',
      isVerified: true,
      trustScore: 98,
    },
    {
      id: '2',
      name: 'Rakesh (राकेश)',
      role: 'Society Guard (गार्ड)',
      phone: '+91 94140 54321',
      availability: 'Available',
      isVerified: true,
      trustScore: 95,
    },
    {
      id: '3',
      name: 'Raj Plumbing (राज प्लंबिंग)',
      role: 'Verified Provider (प्लंबर)',
      phone: '+91 91660 98765',
      availability: 'Available',
      isVerified: true,
      trustScore: 92,
    },
    {
      id: '4',
      name: 'Dr. Mehta (डॉ. मेहता)',
      role: 'Family Doctor (पारिवारिक डॉक्टर)',
      phone: '+91 98280 67890',
      availability: 'Available',
      isVerified: true,
      trustScore: 99,
    },
  ];

  private requests: RequestItem[] = [
    {
      id: 'r1',
      category: 'Medicine',
      title: 'Medicine Pickup (दवाई लाना)',
      status: 'Completed',
      time: 'Yesterday (कल)',
      helperName: 'Amit Sharma',
      rating: 5,
    },
    {
      id: 'r2',
      category: 'Doctor',
      title: 'Doctor Visit Assistance (डॉक्टर के पास जाना)',
      status: 'Scheduled',
      time: 'Tomorrow (आने वाला कल - 10:00 AM)',
      helperName: 'Dr. Mehta',
    },
  ];

  // Active simulated request state
  private demoFlowState: 'idle' | 'listening' | 'confirm' | 'intent' | 'dispatch' | 'matching' | 'backup_warning' | 'tracking' | 'arrived' | 'progress' | 'completed' = 'idle';
  private demoInputText: string = '';
  private activeRequestCategory: string = '';
  private simulatedScenario: 'regular' | 'backup' | 'emergency' = 'backup'; // default backup to showcase core concept
  private activeRating: number = 0;

  getLanguage() {
    return this.language;
  }

  setLanguage(lang: 'hi' | 'en') {
    this.language = lang;
    this.notify();
  }

  getProfile() {
    return this.profile;
  }

  updateProfile(updated: typeof this.profile) {
    this.profile = { ...this.profile, ...updated };
    this.notify();
  }

  getTrustedPeople() {
    return this.trustedPeople;
  }

  addTrustedPerson(person: Omit<TrustedPerson, 'id'>) {
    const newPerson: TrustedPerson = {
      ...person,
      id: Date.now().toString(),
    };
    this.trustedPeople.push(newPerson);
    this.notify();
  }

  getRequests() {
    return this.requests;
  }

  addRequest(req: Omit<RequestItem, 'id'>) {
    const newReq: RequestItem = {
      ...req,
      id: 'req-' + Date.now().toString(),
    };
    this.requests.unshift(newReq);
    this.notify();
  }

  // Simulation controls
  getDemoState() {
    return this.demoFlowState;
  }

  setDemoState(state: typeof this.demoFlowState) {
    this.demoFlowState = state;
    this.notify();
  }

  getDemoInputText() {
    return this.demoInputText;
  }

  setDemoInputText(text: string, category: string = 'household') {
    this.demoInputText = text;
    this.activeRequestCategory = category;
    this.notify();
  }

  getCategory() {
    return this.activeRequestCategory;
  }

  getScenario() {
    return this.simulatedScenario;
  }

  setScenario(scenario: typeof this.simulatedScenario) {
    this.simulatedScenario = scenario;
    this.notify();
  }

  getActiveRating() {
    return this.activeRating;
  }

  setActiveRating(rating: number) {
    this.activeRating = rating;
    this.notify();
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }
}

export const globalStore = new GlobalStore();
