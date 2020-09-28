rm deploy.zip 2> /dev/null


#For Windows, use 7z
#7z a -r -tzip deploy.zip *.js email.pug client_secret.json node_modules/*
zip -r deploy.zip *.js email.pug client_secret.json node_modules/*

aws lambda update-function-code --function-name iran-divestment --zip-file fileb://deploy.zip

# aws lambda update-function-configuration --function-name iran-divestment \

# aws lambda delete-function --function-name iran-divestment