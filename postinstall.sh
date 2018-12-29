set -x

# This clones the PR version of yarn (which takes a while)
yarn meta git update

# This uses the feature added by the PR.
alias local_yarn="$PWD/yarn/bin/yarn"
cd foo-5713 && local_yarn link
cd .. && local_yarn link foo-5713
