FROM node:22-bookworm

ENV NODE_ENV=production \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH"

WORKDIR /app

RUN python3 -m venv /opt/venv

COPY package.json ./
RUN npm install

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]