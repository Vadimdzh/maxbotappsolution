function buildFullName(student) {
  return [student.firstName, student.lastName].filter(Boolean).join(' ').trim();
}

export function serializeProfile(student) {
  return {
    avatarUrl: student.avatarUrl,
    university: student.university,
    faculty: student.faculty,
    fullName: buildFullName(student),
    phone: student.phone,
    email: student.email,
    level: student.level,
    points: student.points,
  };
}

export async function updateStudentProfile(student, payload) {
  const allowed = ['university', 'faculty', 'phone', 'email'];
  const updates = {};
  for (const field of allowed) {
    if (payload[field] !== undefined) {
      updates[field] = payload[field];
    }
  }
  if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
    const error = new Error('Invalid email format');
    error.status = 400;
    throw error;
  }
  await student.update(updates);
  return serializeProfile(student);
}
