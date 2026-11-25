#!/usr/bin/env node
/**
 * Firestore 시드 업로드
 *   npm run seed                 → 없는 문서만 생성 (콘솔 수정분 보호)
 *   npm run seed -- --force      → 기존 문서도 덮어쓰기
 *   npm run seed -- --dry-run    → 업로드 없이 데이터 검증만
 *
 * 인증: 프로젝트 루트의 serviceAccount.json (git 제외)
 *       또는 GOOGLE_APPLICATION_CREDENTIALS 환경변수 경로
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DATA_PATH = resolve(ROOT, 'seed/seed-data.json')
const KEY_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? resolve(ROOT, 'serviceAccount.json')
const BATCH_LIMIT = 400
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*-\d{4}-\d{2,}$/
const REQUIRED = ['category', 'year', 'title']

const args = new Set(process.argv.slice(2))
const FORCE = args.has('--force')
const DRY_RUN = args.has('--dry-run')

function fail(msg) {
  console.error(`\n✖ ${msg}\n`)
  process.exit(1)
}

// ── 데이터 로드 & 검증 ──────────────────────────────────────────
const data = JSON.parse(readFileSync(DATA_PATH, 'utf8'))
const settings = data?.settings?.site
const works = Array.isArray(data?.works) ? data.works : []

if (!settings) fail('seed-data.json 에 settings.site 가 없습니다.')

const errors = []
const seen = new Set()
const workDocs = works.map((w, i) => {
  const { id, ...fields } = w
  const label = id ?? `works[${i}]`
  if (!id || typeof id !== 'string') errors.push(`${label}: id 없음`)
  else if (!ID_PATTERN.test(id)) errors.push(`${label}: id 형식이 {category}-{year}-{nn} 이 아님`)
  if (seen.has(id)) errors.push(`${label}: id 중복`)
  seen.add(id)
  for (const key of REQUIRED) {
    if (fields[key] === undefined || fields[key] === '') errors.push(`${label}: ${key} 없음`)
  }
  if (fields.year !== undefined) fields.year = Number(fields.year)
  if (fields.order !== undefined && fields.order !== '') fields.order = Number(fields.order)
  return { id, fields }
})

if (errors.length) fail(`데이터 오류 ${errors.length}건\n  - ${errors.join('\n  - ')}`)

const docs = [
  { path: 'settings/site', fields: settings },
  ...workDocs.map(({ id, fields }) => ({ path: `works/${id}`, fields })),
]

console.log(`✔ 데이터 검증 완료: settings 1 + works ${workDocs.length}`)

if (DRY_RUN) {
  console.log('  (--dry-run: 업로드하지 않음)')
  process.exit(0)
}

// ── 업로드 ──────────────────────────────────────────────────────
if (!existsSync(KEY_PATH)) {
  fail(`서비스 계정 키를 찾을 수 없습니다: ${KEY_PATH}
  Firebase 콘솔 → 프로젝트 설정 → 서비스 계정 → "새 비공개 키 생성"으로 받은 파일을
  프로젝트 루트에 serviceAccount.json 으로 저장하세요. (git에 올라가지 않습니다)`)
}

const { initializeApp, cert } = await import('firebase-admin/app')
const { getFirestore } = await import('firebase-admin/firestore')

const serviceAccount = JSON.parse(readFileSync(KEY_PATH, 'utf8'))
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

console.log(`→ 프로젝트: ${serviceAccount.project_id}${FORCE ? '  (--force: 덮어쓰기)' : ''}`)

const refs = docs.map((d) => db.doc(d.path))
const snaps = await db.getAll(...refs)

let created = 0
let overwritten = 0
let skipped = 0
let batch = db.batch()
let pending = 0

for (let i = 0; i < docs.length; i++) {
  const exists = snaps[i].exists
  if (exists && !FORCE) {
    skipped++
    continue
  }
  batch.set(refs[i], docs[i].fields)
  exists ? overwritten++ : created++
  if (++pending >= BATCH_LIMIT) {
    await batch.commit()
    batch = db.batch()
    pending = 0
  }
}
if (pending > 0) await batch.commit()

console.log(`✔ 완료 — 생성 ${created} / 덮어씀 ${overwritten} / 건너뜀(이미 존재) ${skipped}`)
if (skipped && !FORCE) console.log('  기존 문서를 덮어쓰려면: npm run seed -- --force')
