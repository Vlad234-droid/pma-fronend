#!/bin/sh

#  Script is used in the Azure Devops pipeline
#  Create rc-tag and branch from the tag
#
#  variables:
#    RC_VERSION
#  env:
#    BUILD_SOURCE_BRANCH_NAME: $(Build.SourceBranchName)

version=$RC_VERSION
current_branch=$BUILD_SOURCE_BRANCH_NAME

tag_name=rc-$version
branch_name=v$version

if [[ -z $version ]]; then
  echo "Please set RC_VERSION variable before run"
  exit 1
fi
if [[ -z $current_branch ]]; then
  current_branch="master"
fi
#git pull origin $current_branch

echo "Tag $tag_name creating from $current_branch..."
git tag -a $tag_name -m "Release candidate tag $tag_name created from $current_branch"

if [[ $? -ne 0 ]]; then
  exit 2
fi
echo "Tag $tag_name pushing..."
git push origin $tag_name

if [[ $? -ne 0 ]]; then
  exit 3
fi
echo "Branch $branch_name from tag $tag_name creating..."
git branch $branch_name $tag_name

if [[ $? -ne 0 ]]; then
  exit 4
fi
echo "Branch $branch_name pushing..."
git push origin $branch_name

if [[ $? -ne 0 ]]; then
  exit 5
fi