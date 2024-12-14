export type NavigationPage = 'dashboard' | 'courses' | 'admin';

export interface NavigationProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
}