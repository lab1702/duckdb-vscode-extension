# Release Process

This document describes how to create a new release of the DuckDB VS Code extension.

## Automated Release Process

The extension uses GitHub Actions to automatically build and package the extension when a new release is created.

### Creating a New Release

1. **Update the version in `package.json`:**
   ```json
   {
     "version": "0.0.2"
   }
   ```

2. **Commit and push the version change:**
   ```bash
   git add package.json
   git commit -m "Bump version to 0.0.2"
   git push origin main
   ```

3. **Create a new release on GitHub:**
   - Go to the [Releases page](https://github.com/lab1702/duckdb-vscode-extension/releases)
   - Click "Create a new release"
   - Tag version: `v0.0.2` (must start with 'v')
   - Release title: `v0.0.2`
   - Describe the changes in the release notes
   - Click "Publish release"

4. **GitHub Actions will automatically:**
   - Build the extension
   - Run tests to ensure quality
   - Package the extension into a `.vsix` file
   - Attach the `.vsix` file to the release

### What Happens During Release

The GitHub Actions workflow (`release.yml`) will:

1. **Build Environment Setup:**
   - Checkout the code
   - Setup Node.js 20.x
   - Install dependencies with `npm ci`

2. **Quality Checks:**
   - Run ESLint to check code quality
   - Compile TypeScript to ensure no compilation errors
   - Setup virtual display (xvfb) for headless VS Code testing
   - Run the full test suite in headless mode

3. **Package Extension:**
   - Install the VS Code Extension Manager (`@vscode/vsce`)
   - Package the extension into a `.vsix` file
   - Upload the `.vsix` file to the GitHub release

### CI/CD Testing

The workflows use `xvfb` (X Virtual Framebuffer) to run VS Code tests in headless environments:
- Virtual display is configured with screen resolution 1024x768x24
- Tests run with proper environment variables for CI compatibility
- Ensures consistent testing across local and CI environments

### Manual Release (Alternative)

If you need to create a release manually:

```bash
# Ensure everything is built and tested
npm run compile
npm test

# Package the extension
npm install -g @vscode/vsce
vsce package

# The .vsix file will be created in the current directory
```

### Release Checklist

Before creating a release:

- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md` with new features/fixes
- [ ] Ensure all tests pass locally: `npm test`
- [ ] Ensure code compiles: `npm run compile`
- [ ] Ensure linting passes: `npm run lint`
- [ ] Test the extension in VS Code Extension Development Host
- [ ] Create and push version commit
- [ ] Create GitHub release with proper tag format (`v0.0.2`)

The automated process ensures consistent, tested releases every time!
