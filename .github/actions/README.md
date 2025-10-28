# GitHub Actions Composite Actions

This directory contains reusable Composite Actions that are used across multiple workflows to reduce duplication and improve maintainability.

## Available Actions

### 1. Setup Node.js Environment (`setup-nodejs`)

**Purpose**: Sets up Node.js environment with npm cache and installs dependencies.

**Inputs**:

- `node-version` (optional): Node.js version to use (default: "22")
- `install-playwright` (optional): Whether to install Playwright browsers (default: "false")

**Usage**:

```yaml
- name: Setup Node.js Environment
  uses: ./.github/actions/setup-nodejs
  with:
    node-version: ${{ env.NODE_VERSION }}
    install-playwright: "true"
```

### 2. Run Unit Tests (`run-unit-tests`)

**Purpose**: Runs unit tests for both backend and frontend packages with coverage.

**Inputs**:

- `upload-coverage` (optional): Whether to upload coverage artifacts (default: "true")
- `coverage-suffix` (optional): Suffix for coverage artifact names (default: "")

**Usage**:

```yaml
- name: Run Unit Tests
  uses: ./.github/actions/run-unit-tests
  with:
    coverage-suffix: "-master"
```

### 3. Build Packages (`build-packages`)

**Purpose**: Builds both backend and frontend packages.

**Inputs**:

- `upload-builds` (optional): Whether to upload build artifacts (default: "true")
- `build-suffix` (optional): Suffix for build artifact names (default: "")

**Usage**:

```yaml
- name: Build Packages
  uses: ./.github/actions/build-packages
  with:
    build-suffix: "-master"
```

## Benefits

1. **Reduced Duplication**: Common steps are centralized in reusable actions
2. **Consistency**: All workflows use the same setup and test procedures
3. **Maintainability**: Changes to common steps only need to be made in one place
4. **Reusability**: Actions can be easily used in new workflows
5. **Version Control**: Actions are versioned with the repository

## Workflows Using These Actions

- `master.yml` - Master branch quality gate
- `pull-request.yml` - Pull request checks
- `ci.yml` - Main CI/CD pipeline

## Adding New Composite Actions

To add a new Composite Action:

1. Create a new directory under `.github/actions/`
2. Add an `action.yml` file with the action definition
3. Update this README with the new action documentation
4. Use the action in relevant workflows
