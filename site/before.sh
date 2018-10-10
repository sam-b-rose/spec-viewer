PATH=`echo $PATH | sed -e 's/:\.\/node_modules\/\.bin//'`
REMOVE_ME=$(find ../specs -name .gitremove -execdir pwd \;)

if [[ $REMOVE_ME != "" ]]
then
  rm -r "$REMOVE_ME"
  git add -A ../specs
  git commit -m "Remove directories containing .gitremove"
  git push origin HEAD:master
  echo "Removed folders and pushed changes 🚀"
  echo "Stopping build 🛑"
  exit 1
else
  echo "Nothing to be removed 👍"
fi
