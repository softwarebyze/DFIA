import { useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { analytics } from "analytics";

export const AngelOnly = ({ children }: { children?: React.ReactNode }) => {
  const client = useStreamVideoClient();
  const isAngel = client?.state.connectedUser?.custom?.dashboard_user;
  analytics.track("angelOnlyButton", { isAngel });

  return !isAngel ? null : children;
};

export const NonAngelOnly = ({ children }: { children?: React.ReactNode }) => {
  const client = useStreamVideoClient();
  const isAngel = client?.state.connectedUser?.custom?.dashboard_user;
  analytics.track("nonAngelOnlyButton", { isAngel });

  return isAngel ? null : children;
}