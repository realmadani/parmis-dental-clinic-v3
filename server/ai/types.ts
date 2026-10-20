export interface StructuredPortfolioCase {
  id: string;
  caseNumber?: string;
  title: string;
  category: string;
  categoryLabel: string;
  description: string;
  patientInfo?: string;
  duration?: string;
  guaranteeText?: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  badge?: string;
}

export interface DoctorProfileCardData {
  name: string;
  role: string;
  medicalCouncilCode: string;
  image: string;
  experience: string;
  bio: string;
}

export interface ChatActionItem {
  id: string;
  type:
    | 'call_clinic'
    | 'open_booking'
    | 'open_cost_calculator'
    | 'open_google_maps'
    | 'open_neshan'
    | 'open_balad'
    | 'navigate_contact'
    | 'navigate_services'
    | 'navigate_gallery';
  label: string;
  url?: string;
  serviceId?: string;
  icon: string;
}

export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiChatResponsePayload {
  reply: string;
  cases: StructuredPortfolioCase[];
  doctorCard?: DoctorProfileCardData | null;
  actions: ChatActionItem[];
  followUpSuggestions: string[];
  mode: 'gemini' | 'knowledge_engine';
}
