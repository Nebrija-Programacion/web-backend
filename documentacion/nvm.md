# Install nvm on Ubuntu 18.04

## Step 1: Download and install package
```bash
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
``` 
## Step 2: Configuration
After installation run the following command on your terminal

```bash
$ export NVM_DIR=”$HOME/.nvm”
$ [ -s “$NVM_DIR/nvm.sh” ] && \. “$NVM_DIR/nvm.sh”
$ [ -s "$NVM_DIR/bash_completion" ] && \.   "$NVM_DIR/bash_completion"
```

## Step 3: Verify your installation

```bash
$ nvm — version
```

## Step 4: Instal node.js v12.6.0
```bash
$ nvm install 12.6.0
```

from https://medium.com/@nbanzyme/easy-way-to-install-nvm-on-ubuntu-18-04-2cfb19ee5391