try {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  setDashboardData(data);
} catch (error) {
  console.error('Error fetching dashboard data:', error);
  setDashboardData({ error });
}
