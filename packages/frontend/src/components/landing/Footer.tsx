import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-20" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600">
          <p>&copy; 2025 BoatsAnalytics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
