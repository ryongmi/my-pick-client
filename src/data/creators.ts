// Minimal stub for creators data - replaced by real API
export const creators = [];

// Placeholder function for backward compatibility - should be replaced by Redux actions
export const mockGetFollowedCreators = async () => {
  return { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasNext: false, hasPrev: false } };
};

// For backward compatibility with existing components
export default creators;