This is a forked project from https://github.com/apigee-127/swagger-tools with an attemp to add Open API 3 support. :)


# update swagger-ui version to 3.34.0
# update latest version oas3-tools

# manual package
```
npm install
npm run-script build
npm pack
```

# involve local package to your project
## copy file:oas3-tools-2.1.3.tgz to your project folder, add below into package.json
```
 "oas3-tools": "file:oas3-tools-2.1.3.tgz",
```