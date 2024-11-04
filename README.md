# ★ AeroVault ★  

# How to set up the workspace    

## Cloning the Repository:
<pre>
# Type this in Git bash or VS Code in-built terminal to Clone the main branch
# Go to whatever directory you want the repo folder to be created through the terminal your using
git clone https://github.com/pramodh123kit/AeroVault.git
cd AeroVault
# To open the VS code from the project folder
code .
</pre>
  


## Checking Out to the Specific Branch:
## To get a copy of the main branch
<pre>
# Your branch's name (eg: pramodh_branch)
git checkout pramodh_branch

git fetch origin main
git checkout main
git pull origin main 
git checkout pramodh_branch <--your branch's name
git merge main
</pre>



***Remember, when you clone the repository, you get a local copy of all branches, but you have to explicitly switch to your branch for you to work on your designated part of the project.***

# How to commit the changes you've done  

## Commit Changes
<pre>
# Git status will list the changes you have done (added a new file, deleted a file, updated a file)
git status
  
# This will add all the changes you have done
git add --all
git commit -m "a message of what your going to commit comes here" 
  
# Replace this "pramodh_branch" name with your branch's name
git push origin pramodh_branch 
</pre>

## Create a Pull Request
* Go to the repository on GitHub and navigate to (your branch)
* Click on the "Pull Request" button
* In the Pull Request interface, select the **main branch**
* Write a description, changes and screenshots of the updates you've made in Pull Request
