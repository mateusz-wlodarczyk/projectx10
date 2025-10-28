import { useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * Custom hook for common navigation patterns
 */
export const useNavigation = () => {
  const router = useRouter();

  const navigateTo = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  const navigateBack = useCallback(() => {
    router.back();
  }, [router]);

  const navigateReplace = useCallback((path: string) => {
    router.replace(path);
  }, [router]);

  return {
    navigateTo,
    navigateBack,
    navigateReplace,
    router,
  };
};

/**
 * Custom hook for landing page navigation
 */
export const useLandingNavigation = () => {
  const { navigateTo } = useNavigation();

  const goToRegister = useCallback(() => {
    navigateTo("/auth/register");
  }, [navigateTo]);

  const goToLogin = useCallback(() => {
    navigateTo("/auth/login");
  }, [navigateTo]);

  const goToDashboard = useCallback(() => {
    navigateTo("/dashboard");
  }, [navigateTo]);

  return {
    goToRegister,
    goToLogin,
    goToDashboard,
  };
};

/**
 * Custom hook for boat navigation
 */
export const useBoatNavigation = () => {
  const { navigateTo, navigateBack } = useNavigation();

  const goToBoatDetails = useCallback((boatId: string) => {
    navigateTo(`/boats/${boatId}`);
  }, [navigateTo]);

  const goToBoatsList = useCallback(() => {
    navigateTo("/boats");
  }, [navigateTo]);

  const goBackToBoats = useCallback(() => {
    navigateBack();
  }, [navigateBack]);

  return {
    goToBoatDetails,
    goToBoatsList,
    goBackToBoats,
  };
};
