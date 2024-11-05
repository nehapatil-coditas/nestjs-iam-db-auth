npm install @nestjs/typeorm typeorm pg @aws-sdk/rds-signer
npm install @nestjs/config
npm install @aws-sdk/rds-signer@3.677.0
npm install --save-dev ts-node
npm install typeorm@latest
npm install pg --save
docker build -t nestjs-rds-test .
docker run --env-file .env nestjs-rds-test
