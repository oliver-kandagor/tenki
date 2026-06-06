export type OnboardingStackParamList = {
  GetStarted: undefined;
  IntroSlides: undefined;
  GoogleSignIn: undefined;
  Activities: undefined;
  Notifications: undefined;
  UpdateFrequency: undefined;
  Plan: undefined;
  Locations: undefined;
  Welcome: undefined;
  Success: undefined;
};

export type TreesStackParamList = {
  TreesHome: undefined;
  History: undefined;
  AnalysisDetail: { analysisId: string };
};

export type LabStackParamList = {
  LabHome: undefined;
  LabRun: {
    featureId: string;
    compareLat?: number;
    compareLon?: number;
    compareName?: string;
  };
};

export type UsageStackParamList = {
  UsageHome: undefined;
  Pricing: undefined;
};

export type RootTabParamList = {
  today: undefined;
  forecast: undefined;
  alerts: undefined;
  trees: undefined;
  usage: undefined;
  lab: undefined;
};
