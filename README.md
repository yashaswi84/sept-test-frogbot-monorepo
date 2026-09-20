# frogbot-monorepo-demo

Public monorepo demo for **Frogbot V3** against `https://tokyoshiftleft.jfrog.io/`.

> Repo is **public** so GitHub Code Scanning + Dependency Graph work on a personal account
> (private repos need GitHub Advanced Security). See [GitHub Security integration](#github-security) below.

Two sub-projects, each with seeded CVEs on `main`:

| Project | Stack | Seeded vulnerability |
|---------|-------|----------------------|
| `frontend/` | npm | `minimatch@3.0.2` (ReDoS, CVE-2022-3517), `mpath@0.7.0` (prototype pollution) |
| `backend/` | pip | `pyjwt==1.7.1` (CVE-2022-29217), `urllib3==1.26.5` (multiple CVEs) |

**Pull-request scan:** open a PR that adds `axios@0.21.0` to `frontend/` — Frogbot should
report it as a newly introduced issue (PR scan only reports diff-introduced vulns).

## Frogbot

- `.frogbot/frogbot-config.yml` — monorepo project definitions (`frontend` + `backend`)
- `.github/workflows/frogbot-scan-repository.yml` — full-repo scan on `main`
- `.github/workflows/frogbot-scan-pull-request.yml` — diff scan on PRs

Scanner settings use the platform **System_Default_Profile** (auto-selected). The repo-local
`.frogbot/frogbot-config.yml` documents the monorepo `workingDirs` layout.

**Note:** The first repository scan auto-registers the repo on the JFrog tenant. If a follow-up
scan fails with `profile returned with 0 modules`, delete the broken profile via
`POST /xray/api/v1/xsc/profile/reset` with the `config_profile_id`.

## GitHub Security

Results are published to GitHub per the [Frogbot GitHub scan results docs](https://docs.jfrog.com/security/docs/github-1).

| Destination | Workflow | Env var |
|-------------|----------|---------|
| **Security → Code scanning alerts** (repo scan) | `frogbot-scan-repository.yml` | automatic (SARIF upload) |
| **Security → Code scanning alerts** (PR scan) | `frogbot-scan-pull-request.yml` | `JF_UPLOAD_PR_SECURITY_RESULTS_TO_VCS=true` |
| **Insights → Dependency graph** (SBOM) | `frogbot-scan-repository.yml` | `JF_UPLOAD_SBOM_TO_VCS=true` (default) |

**Prerequisites:** Code scanning + Dependency graph enabled on the repo; `frontend/package-lock.json`
on `main` so npm SBOM resolves; JFrog Advanced Security license on the tenant for SBOM upload.

After a scan, filter alerts by tool: **JFrog Xray scanner**, **JFrog SAST**, **JFrog Secrets scanner**.
Use `branch:main` for repository scans or `pr:<number>` for pull request scans.

Enable vulnerability alerts on the repo for Dependency Graph SBOM upload
(`PUT /repos/{owner}/{repo}/vulnerability-alerts`).
