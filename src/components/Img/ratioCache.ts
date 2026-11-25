/** 한 번 로드된 이미지의 원본 비율(가로/세로) — 다시 마운트될 때(상세→홈 복귀) 높이가 튀지 않게 */
export const ratioCache = new Map<string, number>()
