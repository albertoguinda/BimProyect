import * as BUI from "@thatopen/ui";

export const DashboardCard = () => {
  const numberOfDashboard = [1, 2, 3]
  return BUI.html`${numberOfDashboard.map(
    (dashboard) => BUI.html`
      <div id="chart${dashboard}" class="h-[400px] bg-white rounded-2xl shadow-md p-4"></div>
    `
  )}`;
};
