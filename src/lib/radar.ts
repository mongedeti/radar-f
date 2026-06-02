export function getRadarStatus(lastContact: string | null) {
  if (!lastContact) return "atenção"

  const now = new Date().getTime()
  const last = new Date(lastContact).getTime()
  const diffDays = (now - last) / (1000 * 60 * 60 * 24)

  if (diffDays > 7) return "risco"
  if (diffDays > 4) return "atenção"
  return "saudável"
}

export function getPriorityScore(lastContact: string | null) {
  const status = getRadarStatus(lastContact)

  if (status === "risco") return 1
  if (status === "atenção") return 2
  return 3
}
