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

export type AppRole = 'senior' | 'family' | 'provider' | 'volunteer';

export interface SeniorProfile {
  id?: string;
  name: string;
  age?: number;
  phone?: string;
  address?: string;
  city?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  familyCode?: string;
}

export interface ConnectedSenior {
  id?: string;
  name: string;
  city?: string;
  relationship?: string;
  familyCode?: string;
  phone?: string;
}

class GlobalStore {
  private language: 'hi' | 'en' = 'en';
  private listeners: Set<() => void> = new Set();
  private authToken: string | null = null;
  private role: AppRole | null = null;
  private user: any = null;
  private connectedSenior: ConnectedSenior | null = null;
  private familyCodeDirectory: Record<string, ConnectedSenior> = {};

  private profile: SeniorProfile = {
    name: 'Shanti Devi',
    age: 68,
    phone: '+91 98765 43210',
    address: 'Vaishali Nagar, Jaipur',
    city: 'Jaipur',
    emergencyContactName: 'Kiran - Daughter',
    emergencyContactPhone: '+91 99887 76655',
  };

  private trustedPeople: TrustedPerson[] = [
    {
      id: '1',
      name: 'Amit Sharma',
      role: 'Neighbour',
      phone: '+91 98290 12345',
      availability: 'Available',
      isVerified: true,
      trustScore: 98,
    },
    {
      id: '2',
      name: 'Rakesh',
      role: 'Society Guard',
      phone: '+91 94140 54321',
      availability: 'Available',
      isVerified: true,
      trustScore: 95,
    },
    {
      id: '3',
      name: 'Raj Plumbing',
      role: 'Verified Provider',
      phone: '+91 91660 98765',
      availability: 'Busy',
      isVerified: true,
      trustScore: 92,
    },
    {
      id: '4',
      name: 'Dr. Mehta',
      role: 'Family Doctor',
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
      title: 'Medicine Pickup',
      status: 'Completed',
      time: 'Yesterday',
      helperName: 'Amit Sharma',
      rating: 5,
    },
    {
      id: 'r2',
      category: 'Doctor',
      title: 'Doctor Visit Assistance',
      status: 'Scheduled',
      time: 'Tomorrow - 10:00 AM',
      helperName: 'Dr. Mehta',
    },
  ];

  getLanguage() {
    return this.language;
  }

  setLanguage(lang: 'hi' | 'en') {
    this.language = lang;
    this.notify();
  }

  getToken() {
    return this.authToken;
  }

  setToken(token: string | null) {
    this.authToken = token;
    this.notify();
  }

  getRole() {
    return this.role;
  }

  setRole(role: AppRole | null) {
    this.role = role;
    this.notify();
  }

  getUser() {
    return this.user;
  }

  setUser(user: any) {
    this.user = user;
    this.notify();
  }

  getConnectedSenior() {
    return this.connectedSenior;
  }

  setConnectedSenior(senior: ConnectedSenior | null) {
    this.connectedSenior = senior;
    this.notify();
  }

  registerSeniorCode(familyCode: string, senior: ConnectedSenior) {
    const normalizedCode = familyCode.trim().toUpperCase();
    this.familyCodeDirectory[normalizedCode] = {
      ...senior,
      familyCode: normalizedCode,
    };
    this.notify();
  }

  findSeniorByCode(familyCode: string) {
    return this.familyCodeDirectory[familyCode.trim().toUpperCase()] || null;
  }

  getProfile() {
    return this.profile;
  }

  updateProfile(updated: Partial<SeniorProfile>) {
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
      id: `req-${Date.now()}`,
    };
    this.requests.unshift(newReq);
    this.notify();
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}

export const globalStore = new GlobalStore();
