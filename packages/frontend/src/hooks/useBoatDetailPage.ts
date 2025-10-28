import { useCallback } from "react";
import { useBoatDetail } from "@/src/hooks/useBoatDetail";
import { useBoatNavigation } from "@/src/hooks/useNavigation";

interface UseBoatDetailPageProps {
  slug: string;
}

export const useBoatDetailPage = ({ slug }: UseBoatDetailPageProps) => {
  const { goBackToBoats } = useBoatNavigation();
  
  const boatDetailData = useBoatDetail(slug);

  const handleBack = useCallback(() => {
    goBackToBoats();
  }, [goBackToBoats]);

  return {
    ...boatDetailData,
    handleBack,
  };
};
