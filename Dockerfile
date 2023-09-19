# Use Node image
FROM node:14

# Set working directory
WORKDIR /usr/src/app

# Install Chrome
RUN apt-get update \
  && apt-get install -yq --no-install-recommends \
  libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
  libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 \
  libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 \
  libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
  libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 \
  libxrender1 libxss1 libxtst6 libnss3 \
  && rm -rf /var/lib/apt/lists/*

# Install ChromeDriver
RUN wget https://chromedriver.storage.googleapis.com/2.41/chromedriver_linux64.zip \
  && unzip chromedriver_linux64.zip \
  && mv chromedriver /usr/bin/chromedriver \
  && chown root:root /usr/bin/chromedriver \
  && chmod +x /usr/bin/chromedriver

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Run tests
CMD ["npm", "test"]
