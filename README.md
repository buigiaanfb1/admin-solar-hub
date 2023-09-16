### Installing

`yarn` - Install all the dependencies for the web app and server

### Branch name rule 
- Create a branch name should follow a pattern: /(master/main|develop) (1)$"(feature fix hotfix release)\/.+$/g
- Must start with "feature/", "fix/", "release/", "hotfix/".
- Must be in lowercase and contain only letters (a-z), numbers (0-9), hyphen (-) or dot (.)

For example: 
- ✅ `feature/US56821-enhancement`
- ✅ `fix/US56821-enhancement`
- ✅ `release/v1.2.0`
- ✅ `hotfix/release-v1.2.0`
- ❌ `Feature: Implemenet new UI`
- ❌ `Fix: something went wrong`

### Precommit 
`yarn commit` - It runs prettier, linting and unit tests and a series of prompts to format the commit message. 
### Git commit format 
- Type of commit must be followed on convention below.
```json
feat: A new feature
fix: A bug fix
test: Adding new test or making changes to existing test.
docs: Documentation related changes
chore: A code change that external user won't see (eg: change to .gitignore file or prettierra file)
build: Build related changes (eg: npm related/ adding external dependencies/ CI - CD)
ci: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs) refactor: A code that neither fix bug nor adds a feature. (eg: You can use this when there is semantic changes like renaming a variable/ function name)
revert: Reverts a previous commit
perf: A code that improves performance
style: A code that is related to styling
```

- A common commit message will look like:
  - ✅ `feat: start to pair programming`
  - ✅ `refactor: delete useless code inside the generated migration`
  - ❌ `testing: commit type is incorrect`
- To check a valid commit:
  - `echo "feat: replace rovider"./node_modules/.bin/commitlint` ✅
  - `echo "testing: authentication yyy" | ./node_modules/.bin/commitlint` ❌ 

### Create React App
You can find detailed instructions on using Create React App and many tips in [its documentation](https://facebook.github.io/create-react-app/).
