docker-compose build
docker-compose up -d 
# И можно проверить curlом
curl -v "http://localhost:8181/api/category?search=qu&sort=createDate&pageSize=4"

в случае если кантейнер с приложением не подымается
npm i
tsc -p .
npm run start
