# slide 1

Why we are talking about git rebase : in git there is 2 way of to integrate changes from one branch into another => merge or rebase.
say we want to take them from anakin to yoda mastery of git (with memes)

# slide 1 bis

give base info:

- branch are just pointers
- every commit has a link to its predecessor unless it is the first commit

# slide 2

showing a base tree with 2 branches to pose the example
present the case where we mostly use merge aka develop is ahead & we want to bring the changes down to master
side note on git preventing you from checking other branch if you have uncommited changes that are in conflict with the branch destination.
We can play wit the audience and make it interactive so they can guess what will be the result of the merge or stuff like that.

make it live with commit coming on the base branch so i can explain main interest of git rebase

# slide 3

explain the different merge mode: fast-forward, merge-point

# slide 4

showing the same tree with 2 branches but the master have changes that develop do not have.
we show the effect of rebase and explain why it is important to use it.
explain that it does not generate merge commit
Note that the snapshot pointed to by the final commit you end up with, whether it’s the last of the rebased commits for a rebase or the final merge commit after a merge, is the same snapshot — it’s only the history that is different. Rebasing replays changes from one line of work onto another in the order they were introduced, whereas merging takes the endpoints and merges them together.

# slide drawback

Do not rebase commits that exist outside your repository. ==> better for me : "do not rebase commits that exist where you are not the only one working"

# slide 5

explain `git rebase --onto`

# slide 5

rebasing rewrite history so you can delete commit, changes commit messages etc. but it means that you need to force push when you use it because your local history will not match the distant so git will prevent you from pushing and will ask you to get your local history in line with the remote one.

# slide 5

Mention the fact that even if you mess things up you can still find information in the reflog but it might be painful. Show picture of the reflog to show the criticality of having proper named commits.
mention `git reset --hard` if we want to reset the local branch to the distant if we mess things up

# slide 6

Place where you generate merge commits that are not needed.
git pull vs git pull --rebase

# slide X

talking about merge --no-ff & rebase -p

# slide Y

talk about git workflow with the branches => git flow?

# slide Z

Talk about conflict resolution and the fact that ours and theirs is inversed
