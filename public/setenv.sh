#!/bin/sh

# Recreate config file
rm -rf ./env-config.js
touch ./env-config.js

# Add assignment 
echo "window._env_ = {" >> ./static/js/env-config.js

# Read each line in .env file
# Each line represents key=value pairs
# while read -r line || [[ -n "$line" ]];
# do
#   # Split env variables by character `=`
#   if printf '%s\n' "$line" | grep -q -e '='; then
#     varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
#     varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
#   fi

#   # Read value of current variable if exists as Environment variable
#   value=$(printf '%s\n' "${!varname}")
#   # Otherwise use value from .env file
#   [[ -z $value ]] && value=${varvalue}
  
#   # Append configuration property to JS file
#   echo "  $varname: \"$value\"," >> ./env-config.js
# done < .env

echo "  API_HOST: \"${API_HOST:=127.0.0.1}\"," >> ./static/js/env-config.js
echo "  API_PORT: \"${API_PORT:=8000}\"," >> ./static/js/env-config.js
echo "  API_PROTOCOL: \"${API_PROTOCOL:=http}\"," >> ./static/js/env-config.js
echo "}" >> ./static/js/env-config.js

cat ./static/js/env-config.js