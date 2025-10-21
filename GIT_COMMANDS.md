# Git Commands for DNA Dash Repository

## After Installing Git, Run These Commands:

### 1. Initialize Git Repository
```bash
git init
```

### 2. Add Remote Repository
```bash
git remote add origin https://github.com/jpetree331/DNA-mRNA-complement-game.git
```

### 3. Add All Files
```bash
git add .
```

### 4. Create Initial Commit
```bash
git commit -m "Initial commit: DNA Dash game with full functionality

- Complete DNA complement and mRNA transcription game
- Teacher data tracking with fuzzy name matching  
- Railway backend deployment ready
- Netlify frontend deployment ready
- Clear data functionality for teachers
- Password-protected data access
- Comprehensive documentation"
```

### 5. Set Default Branch to Main
```bash
git branch -M main
```

### 6. Push to GitHub
```bash
git push -u origin main
```

## Alternative: If You Get Authentication Errors

If you get authentication errors, you can use GitHub CLI or set up a Personal Access Token:

### Option A: Use GitHub CLI
1. Install GitHub CLI: https://cli.github.com/
2. Run: `gh auth login`
3. Follow the prompts to authenticate

### Option B: Use Personal Access Token
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with repo permissions
3. Use token as password when prompted

## Verify Upload

After pushing, check your repository at:
https://github.com/jpetree331/DNA-mRNA-complement-game

You should see all the files uploaded successfully.
