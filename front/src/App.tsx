import { AppProvider } from "./common/AppContext";
import AppRoutes from "./common/routes";

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
