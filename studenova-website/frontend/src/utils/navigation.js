export function isCollegeOrganizer(user) {
  return user?.role === 'college_organizer' || user?.role === 'college_admin';
}

export function getCollegeOrganizerPath(user) {
  const verificationStatus = user?.verificationStatus || user?.verification_status || 'approved';

  if (verificationStatus === 'pending') {
    return '/college/pending-approval';
  }

  if (verificationStatus === 'rejected') {
    return '/college/rejected';
  }

  return '/college/dashboard';
}

export function getDashboardPath(user) {
  if (isCollegeOrganizer(user)) {
    return getCollegeOrganizerPath(user);
  }

  if (user?.role === 'industry_organizer') {
    return '/dashboard/industry-organizer';
  }

  return '/dashboard/student';
}
