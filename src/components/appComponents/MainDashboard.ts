// components/appComponents/MainDashBoard.ts
import * as BUI from "@thatopen/ui";
import { DashboardCard } from "./DashboardCard";

export const MainDashboard = BUI.Component.create(() => {
  return BUI.html`
    <main class="w-full flex-1 px-6 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 auto-rows-[minmax(300px,_auto)] overflow-y-auto">
      ${DashboardCard()}
    </main>
  `;
});
