// Fetch data from the Django endpoint
async function fetchStatistics() {
  try {
    const response = await fetch("/api/get_statistics"); // Update the URL
    const purchaseData = await response.json();

    // Initialize the statistics with the fetched data
    initStatistics(purchaseData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Initialize the statistics rendering
function initStatistics(purchaseData) {
  const statsGrid = document.querySelector(".stats-grid");
  const vendorStatsContainer = document.querySelector(".vendor-stats");

  // Create overview statistics
  const overviewStats = [
    {
      title: "Total Spent",
      value: formatCurrency(purchaseData.totalSpent),
      subtext: "All time spending",
      icon: "fa-wallet",
    },
    {
      title: "Total Items",
      value: purchaseData.totalItems,
      subtext: "Items purchased",
      icon: "fa-shopping-cart",
    },
    {
      title: "Average spent per trip",
      value: formatCurrency(purchaseData.averagePerTrip),
      subtext: "Average per trip",
      icon: "fa-calculator",
    },
  ];

  // Render overview statistics
  if (statsGrid) {
    statsGrid.innerHTML = overviewStats
      .map((stat) => createStatCard(stat))
      .join("");
  }

  // Render vendor statistics
  if (vendorStatsContainer) {
    vendorStatsContainer.innerHTML = createVendorTable(
      purchaseData.vendorStats,
      purchaseData.totalSpent
    );
  }
}

// Original createVendorTable function
export const createVendorTable = (vendorStats, totalSpent) => {
  const rows = vendorStats
    .map(
      (vendor) => `
            <tr>
                <td>${vendor.vendor}</td>
                <td>${formatCurrency(vendor.total_spent)}</td>
                <td>${formatPercent(vendor.total_spent, totalSpent)}</td>
                <td>--</td>  <!-- Placeholder for cheapest item, as it's not in the API response -->
            </tr>
        `
    )
    .join("");

  return `
            <table class="vendor-table">
                <thead>
                    <tr>
                        <th>Vendor</th>
                        <th>Total Spent</th>
                        <th>% of Total</th>
                        <th>Cheapest Item</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `;
};

// Utility functions for formatting data
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export const formatPercent = (value, total) => {
  return ((value / total) * 100).toFixed(1) + "%";
};

// Component for rendering individual stat cards
export const createStatCard = ({ title, value, subtext, icon }) => {
  return `
            <div class="stat-card">
                <h3><i class="fas ${icon}"></i>${title}</h3>
                <div class="stat-value">${value}</div>
                <div class="stat-subtext">${subtext}</div>
            </div>
        `;
};

// Call fetchStatistics when the page loads
document.addEventListener("DOMContentLoaded", fetchStatistics);
