## Contributing

Fork the main repo and work in your forked repo only.  It is best to create a new branch for each change or set of changes you will make.

    git checkout -b <branch name>

This project currently requires building the distribution locally and pushing that as well

    grunt build

In your current branch go ahead and commit your changes and verify the changes you are committing/pushing are only the ones you want

    git status / git diff
    git commit -a -m "message"


Then before pushing your remote branch always rebase to upstream master

    git fetch upstream
    git checkout master
    git rebase upstream/master
    git checkout <branch>
    git rebase master


Then verify that everything is still working as you expect it to, test in the browser, then push your remote branch

    git push origin <branch name>

Go into github now and create the merge request.

Once merged set the JIRA to ON_DEV (if inprogress click commit)
