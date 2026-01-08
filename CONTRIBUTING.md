# Contributing to Prediction Markets

Thanks for your interest in contributing! This project covers both Kalshi and Polymarket prediction markets APIs.

---

## 🌳 Branching Strategy

**⚠️ IMPORTANT: Do NOT push directly to `main`**

We use a simple branch strategy:

```
main        ← Production-ready, stable code
  ↑
dev         ← Integration branch for all PRs
  ↑
feature/*   ← Your feature branches
```

### How to Contribute

1. **Create a feature branch** from `dev`
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** (keep it small — see below)

3. **Push to your feature branch**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a PR** → Target: `dev` branch (NOT `main`)

5. **After review**, your PR will be merged into `dev`

---

## 📦 Small PRs > Large PRs

**We prefer many small PRs over one large PR.**

### Why Small PRs?

- ✅ Easier to review
- ✅ Faster feedback
- ✅ Less likely to have conflicts
- ✅ Easier to revert if needed
- ✅ Clearer commit history

### What Makes a Good PR?

| ✅ Good PR Size | ❌ Too Large |
|-----------------|--------------|
| Fix a typo | Fix all typos |
| Add one API endpoint | Add entire API module |
| Update one doc | Rewrite all docs |
| Fix one bug | Fix ten bugs |
| Add one test | Add full test suite |

**Rule of thumb:** If your PR touches more than 3-4 files or 200-300 lines, consider splitting it.

---

## 📝 Commit Guidelines

### Small, Focused Commits

Each commit should do **one thing**.

```bash
# Good: One change per commit
git commit -m "fix: Correct Polymarket API response parsing"

# Good: Clear, specific
git commit -m "docs: Add example for profile endpoint"

# Bad: Too many changes
git commit -m "fix stuff and add things"
```

### Commit Message Format

```
type: brief description

Optional detailed explanation.
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

---

## 🔧 Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/prediction-markets.git
cd prediction-markets

# Add upstream remote
git remote add upstream https://github.com/ebowwa/prediction-markets.git

# Create feature branch
git checkout dev
git pull upstream dev
git checkout -b feature/your-feature
```

---

## 📋 What to Contribute

Looking for ideas? Here are some areas:

- **Documentation:** Improve guides, fix typos, add examples
- **Tests:** Add test coverage for API endpoints
- **Features:** Add new API endpoints or data analysis tools
- **Bug fixes:** Squash bugs you find
- **Examples:** Add demo scripts or notebooks

---

## ✅ Before Your PR

- [ ] Branch is named `feature/your-feature-name`
- [ ] PR targets `dev` branch (NOT `main`)
- [ ] Commits are small and focused
- [ ] Code follows existing patterns
- [ ] Docs updated if needed
- [ ] No secrets or sensitive data

---

## 🚀 After Your PR is Merged

Once your PR is merged into `dev`:

1. **Delete your feature branch**
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. **Sync your local `dev`**
   ```bash
   git checkout dev
   git pull upstream dev
   ```

3. **Start your next feature!**

---

## ❓ Questions?

Feel free to open an issue for discussion before starting large work.

---

**Happy contributing!** 🎉
