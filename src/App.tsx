import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRoute, parseRoute } from '@/hooks/useRoute';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/AuthModal';
import { PetziqAI } from '@/components/PetziqAI';
import FloatingShapes from '@/components/FloatingShapes';
import { AppNav } from '@/components/AppNav';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Logo } from '@/components/Logo';
import { ToastContainer, useToasts } from '@/components/Toast';
import { LandingPage } from '@/pages/LandingPage';
import { ExplorePage } from '@/pages/ExplorePage';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { CategoryDetailPage } from '@/pages/CategoryDetailPage';
import { BreedPage } from '@/pages/BreedPage';
import { PlantDetailPage } from '@/pages/PlantDetailPage';
import { PlantsPage } from '@/pages/PlantsPage';
import { RemindersPage } from '@/pages/RemindersPage';
import { CarePage } from '@/pages/CarePage';
import { ProblemSolverPage } from '@/pages/ProblemSolverPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { AboutPage } from '@/pages/AboutPage';
import { PlusSection } from '@/components/PlusSection';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { MyPetsPage } from '@/pages/MyPetsPage';
import { PetDetailPage } from '@/pages/PetDetailPage';
import { MyPlantsPage } from '@/pages/MyPlantsPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProgressPage } from '@/pages/ProgressPage';
import { FoodGuidePage } from '@/pages/FoodGuidePage';
import { BlogPage } from '@/pages/BlogPage';
import { BlogPostPage } from '@/pages/BlogPostPage';
import { SmartTagsPage } from '@/pages/SmartTagsPage';
import { SmartTagCreatePage } from '@/pages/SmartTagCreatePage';
import { TagProfilePage } from '@/pages/TagProfilePage';
import { AdminPage, type AdminTab } from '@/pages/AdminPage';
import { MissingPhoneModal } from '@/components/MissingPhoneModal';
import { LegalModal, CookieConsentBanner, type LegalModalType } from '@/components/LegalModals';
import type { CategoryId } from '@/data/types';

const PROTECTED_PAGES = new Set([
  'reminders',
  'favorites',
  'my-pets',
  'my-plants',
  'dashboard',
  'progress',
  'activity',
  'smart-tags',
  'smart-tags-create',
  'smart-tags-edit',
  'admin',
  'admin-orders',
  'admin-customers',
  'admin-pets',
  'admin-plants',
  'admin-tags',
  'admin-animal-database',
  'admin-settings',
]);
const PROTECTED_FEATURE_LABELS: Record<string, string> = {
  reminders: 'Reminders',
  favorites: 'Favorites',
  'my-pets': 'My Pets',
  'my-plants': 'My Plants',
  dashboard: 'My Petziq',
  progress: 'Progress',
  activity: 'Activity Tracker',
  'smart-tags': 'Smart Tags',
  'smart-tags-create': 'Smart Tags',
  'smart-tags-edit': 'Smart Tags',
  admin: 'Admin Dashboard',
  'admin-orders': 'Admin Dashboard',
  'admin-customers': 'Admin Dashboard',
  'admin-pets': 'Admin Dashboard',
  'admin-plants': 'Admin Dashboard',
  'admin-tags': 'Admin Dashboard',
  'admin-animal-database': 'Admin Dashboard',
  'admin-settings': 'Admin Dashboard',
};

/**
 * Admin subroutes open the existing AdminPage on the matching tab, so
 * /admin/orders, /admin/customers, … never fall through to a blank screen.
 */
const ADMIN_ROUTES: Record<string, AdminTab> = {
  admin: 'overview',
  'admin-customers': 'users',
  'admin-orders': 'orders',
  'admin-pets': 'pets',
  'admin-plants': 'plants',
  'admin-tags': 'tags',
  'admin-animal-database': 'animal-database',
  'admin-settings': 'settings',
};

/**
 * Every page id this router can render. Anything outside this set (and outside
 * ADMIN_ROUTES) falls back to the 404 page instead of an empty main area.
 */
const RENDERED_PAGES = new Set([
  'home',
  'explore',
  'categories',
  'breed',
  'plants',
  'reminders',
  'care',
  'food',
  'problems',
  'favorites',
  'my-pets',
  'my-plants',
  'dashboard',
  'progress',
  'about',
  'plus',
  'blog',
  'smart-tags',
  'smart-tags-create',
  'smart-tags-edit',
  'tag',
]);

function App() {
  const { session, loading, setPendingRedirect, consumePendingRedirect } =
    useAuth();
  const [path, navigate] = useRoute();
  const { toasts, dismiss } = useToasts();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authFeatureLabel, setAuthFeatureLabel] = useState<string | undefined>();
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);

  const { page, params } = useMemo(() => parseRoute(path), [path]);

  const navigateWithAuth = useCallback(
    (target: string) => {
      const clean = target.replace(/^\//, '');
      if (['privacy', 'terms', 'refund', 'cookies', 'deletion', 'contact', 'help'].includes(clean)) {
        setLegalModal(clean as LegalModalType);
        return;
      }
      const parsed = parseRoute(target);
      if (PROTECTED_PAGES.has(parsed.page) && !session) {
        setPendingRedirect(target);
        setAuthFeatureLabel(PROTECTED_FEATURE_LABELS[parsed.page]);
        setAuthModalOpen(true);
        return;
      }
      navigate(target);
    },
    [session, setPendingRedirect, navigate],
  );

  const requireAuth = useCallback(
    (featureLabel: string, action?: () => void) => {
      if (!session) {
        setPendingRedirect(path);
        setAuthFeatureLabel(featureLabel);
        setAuthModalOpen(true);
        return false;
      }
      if (action) action();
      return true;
    },
    [session, path, setPendingRedirect],
  );

  const handleAuthClose = useCallback(() => {
    setAuthModalOpen(false);
    setAuthFeatureLabel(undefined);
  }, []);

  useEffect(() => {
    if (session && authModalOpen) {
      const redirect = consumePendingRedirect();
      setAuthModalOpen(false);
      setAuthFeatureLabel(undefined);
      if (redirect) {
        navigate(redirect);
      }
    }
  }, [session, authModalOpen, consumePendingRedirect, navigate]);

  // World-class smooth scrolling via Lenis + GSAP ScrollTrigger ticker sync
  useEffect(() => {
    let lenisInstance: any = null;
    let removeTicker: (() => void) | null = null;

    import('@studio-freight/lenis').then(({ default: Lenis }) => {
      import('gsap').then(({ default: gsap }) => {
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          gsap.registerPlugin(ScrollTrigger);

          lenisInstance = new Lenis({
            duration: 1.0,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.0,
            infinite: false,
          });

          // Synchronize Lenis scroll with GSAP ScrollTrigger updates
          lenisInstance.on('scroll', ScrollTrigger.update);

          const updateLenis = (time: number) => {
            lenisInstance.raf(time * 1000);
          };

          gsap.ticker.add(updateLenis);
          gsap.ticker.lagSmoothing(500, 33);

          removeTicker = () => {
            gsap.ticker.remove(updateLenis);
          };
        });
      });
    }).catch((err) => {
      console.warn('Lenis smooth scrolling fallback:', err);
    });

    return () => {
      if (removeTicker) removeTicker();
      if (lenisInstance) lenisInstance.destroy();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <Logo size={64} withWordmark />
          <p className="text-sm font-mono text-ink-300">Loading Petziq…</p>
        </div>
      </div>
    );
  }

  const isLanding = page === 'home' && !session;
  // For logged-in users, "home" routes to the dashboard
  const isDashboard = session && (page === 'home' || page === 'dashboard');
  const showAppNav = session && !isLanding;
  const showLegacyNav = !session && !isLanding;

  return (
    <div className="flex min-h-screen flex-col">
      <FloatingShapes />
      {showAppNav && <AppNav currentPath={path} onNavigate={navigateWithAuth} />}
      {showLegacyNav && (
        <Navbar
          currentPath={path}
          favoritesCount={0}
          onNavigate={navigateWithAuth}
        />
      )}

      <div className={showAppNav ? 'flex-1 lg:pl-60' : 'flex-1'}>
        <main className="flex-1">
          {isLanding && (
            <LandingPage
              onNavigate={navigateWithAuth}
              onLogin={() => {
                setAuthFeatureLabel(undefined);
                setAuthModalOpen(true);
              }}
              onSignUp={() => {
                setAuthFeatureLabel(undefined);
                setAuthModalOpen(true);
              }}
            />
          )}

          {isDashboard && <DashboardPage onNavigate={navigate} />}

          {!isDashboard && page === 'home' && !session && null}

          {page === 'explore' && (
            <ExplorePage
              initialCategory={params.category as CategoryId | undefined}
              favorites={[]}
              isFavorite={() => false}
              toggleFavorite={() => {}}
              onNavigate={navigate}
            />
          )}
          {page === 'categories' && !params.category && (
            <CategoriesPage onNavigate={navigate} />
          )}
          {page === 'categories' && params.category && (
            <CategoryDetailPage
              categoryId={params.category as CategoryId}
              favorites={[]}
              isFavorite={() => false}
              toggleFavorite={() => {}}
              onNavigate={navigate}
            />
          )}
          {page === 'breed' && (
            <BreedPage
              breedId={params.id}
              favorites={[]}
              isFavorite={() => false}
              toggleFavorite={() => {}}
              onNavigate={navigate}
              addRecent={() => {}}
            />
          )}
          {page === 'plants' && !params.id && (
            <PlantsPage
              favorites={[]}
              isFavorite={() => false}
              toggleFavorite={() => {}}
              onNavigate={navigate}
            />
          )}
          {page === 'plants' && params.id && (
            <PlantDetailPage
              plantId={params.id}
              isFavorite={false}
              onToggleFavorite={() => {}}
              onNavigate={navigate}
              onRequireAuth={(label) => {
                setPendingRedirect(path);
                setAuthFeatureLabel(label);
                setAuthModalOpen(true);
              }}
            />
          )}
          {page === 'reminders' && session && <RemindersPage />}
          {page === 'care' && (
            <CarePage initialGuide={params.guide} onNavigate={navigate} />
          )}
          {page === 'food' && (
            <FoodGuidePage foodId={params.id} onNavigate={navigate} />
          )}
          {page === 'problems' && <ProblemSolverPage onNavigate={navigate} />}
          {page === 'favorites' && session && (
            <FavoritesPage onNavigate={navigate} />
          )}
          {page === 'my-pets' && !params.id && (
            <MyPetsPage onNavigate={navigate} onRequireAuth={requireAuth} />
          )}
          {page === 'my-pets' && params.id && (
            <PetDetailPage petId={params.id} onNavigate={navigate} />
          )}
          {page === 'my-plants' && (
            <MyPlantsPage onNavigate={navigate} onRequireAuth={requireAuth} />
          )}
          {page === 'progress' && session && (
            <ProgressPage onNavigate={navigate} />
          )}
          {page === 'about' && <AboutPage onNavigate={navigate} />}
          {page === 'plus' && (
            <div className="container-px pt-8 pb-24">
              <button
                onClick={() => navigate(session ? '/dashboard' : '/')}
                className="mb-6 text-sm text-ink-300 transition hover:text-ink-50"
              >
                Back
              </button>
              <PlusSection onNavigate={navigate} embedded />
            </div>
          )}
          {page === 'blog' && !params.id && (
            <BlogPage onNavigate={navigate} />
          )}
          {page === 'blog' && params.id && (
            <BlogPostPage postId={params.id} onNavigate={navigate} />
          )}
          {page === 'smart-tags' && (
            <SmartTagsPage
              onNavigate={navigateWithAuth}
              onRequireAuth={(label, action) => {
                if (!session) {
                  setPendingRedirect(path);
                  setAuthFeatureLabel(label);
                  setAuthModalOpen(true);
                  return false;
                }
                if (action) action();
                return true;
              }}
            />
          )}
          {page === 'smart-tags-create' && (
            <SmartTagCreatePage onNavigate={navigateWithAuth} />
          )}
          {page === 'smart-tags-edit' && (
            <SmartTagCreatePage onNavigate={navigateWithAuth} editId={params.id} />
          )}
          {page === 'tag' && (
            <TagProfilePage tagId={params.tagId ?? ''} onNavigate={navigateWithAuth} />
          )}
          {ADMIN_ROUTES[page] !== undefined && (
            <AdminPage onNavigate={navigateWithAuth} initialTab={ADMIN_ROUTES[page]} />
          )}
          {page === 'notfound' && <NotFoundPage onNavigate={navigate} />}
          {page !== 'notfound' &&
            !RENDERED_PAGES.has(page) &&
            ADMIN_ROUTES[page] === undefined && (
              <NotFoundPage onNavigate={navigate} />
            )}
        </main>

        {showLegacyNav && <Footer onNavigate={navigateWithAuth} />}
      </div>

      <AuthModal
        open={authModalOpen}
        onClose={handleAuthClose}
        featureLabel={authFeatureLabel}
      />

      <MissingPhoneModal />

      <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />

      <CookieConsentBanner onOpenModal={(t) => setLegalModal(t)} />

      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      <PetziqAI />
    </div>
  );
}

export default App;
